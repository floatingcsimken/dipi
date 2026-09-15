import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoverageScoreService } from '../../../src/services/coverageScore';
import { TechniqueMitigationResultDto } from '../../../src/types/dtos/retrieval';

describe('CoverageScoreService', () => {
  let service: CoverageScoreService;

  beforeEach(() => {
    service = new CoverageScoreService();
  });

  it('üres bemenet esetén üres tömböt ad vissza', () => {
    const result = service.calculateCoverage([], 0);
    expect(result).toEqual([]);
  });

  it('ha vannak technikák, de egyikhez sincs mitigáció, üres tömböt ad vissza', () => {
    const mockData: TechniqueMitigationResultDto[] = [
      {
        techniqueId: 'T1059.001',
        techniqueName: 'PowerShell',
        platforms: ['Windows'],
        mitigations: [],
      },
    ];

    const result = service.calculateCoverage(mockData, 1);
    expect(result).toEqual([]);
  });

  it('pontosan számolja a lefedettséget és csökkenő sorrendbe rendezi az elemeket', () => {
    const mockData: TechniqueMitigationResultDto[] = [
      {
        techniqueId: 'T1059.001',
        techniqueName: 'PowerShell',
        platforms: ['Windows'],
        mitigations: [
          { mitigationId: 'M1038', name: 'Execution Prevention', description: 'Leírás 1' },
          { mitigationId: 'M1026', name: 'Privileged Account Management', description: 'Leírás 2' },
        ],
      },
      {
        techniqueId: 'T1059.003',
        techniqueName: 'Windows Command Shell',
        platforms: ['Windows'],
        mitigations: [
          // M1038 mindkét technikát fedi -> 2/2 = 1.0 (100%)
          { mitigationId: 'M1038', name: 'Execution Prevention', description: 'Leírás 1' },
        ],
      },
    ];

    // Összesen 2 technikát vizsgáltunk
    const result = service.calculateCoverage(mockData, 2);

    expect(result).toHaveLength(2);

    // Első helyezett: M1038 (score: 1.0)
    expect(result[0].mitigationId).toBe('M1038');
    expect(result[0].coverageScore).toBe(1.0);
    expect(result[0].mitigatedTechniqueIds).toEqual(
      expect.arrayContaining(['T1059.001', 'T1059.003'])
    );

    // Második helyezett: M1026 (score: 0.5)
    expect(result[1].mitigationId).toBe('M1026');
    expect(result[1].coverageScore).toBe(0.5);
    expect(result[1].mitigatedTechniqueIds).toEqual(['T1059.001']);
  });

  it('egyenlő pontszám esetén név szerint növekvő sorrendbe rendez', () => {
    const mockData: TechniqueMitigationResultDto[] = [
      {
        techniqueId: 'T1059.001',
        techniqueName: 'PowerShell',
        platforms: ['Windows'],
        mitigations: [
          { mitigationId: 'M1049', name: 'Antivirus', description: '' },
          { mitigationId: 'M1045', name: 'Code Signing', description: '' },
        ],
      },
    ];

    const result = service.calculateCoverage(mockData, 1);

    // Mindkettő score: 1.0, de ABC-ben Antivirus megelőzi a Code Signing-ot
    expect(result[0].name).toBe('Antivirus');
    expect(result[1].name).toBe('Code Signing');
  });
});