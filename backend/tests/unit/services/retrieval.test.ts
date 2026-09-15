import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RetrievalService } from '../../../src/services/retrieval';
import { RetrievalRepository } from '../../../src/repositories/retrieval';
import { CoverageScoreService } from '../../../src/services/coverageScore';

describe('RetrievalService', () => {
  let retrievalService: RetrievalService;
  let mockRepository: RetrievalRepository;
  let mockScoreService: CoverageScoreService;

  beforeEach(() => {
    mockRepository = {
      getMitigations: vi.fn(),
    } as unknown as RetrievalRepository;

    mockScoreService = {
      calculateCoverage: vi.fn(),
    } as unknown as CoverageScoreService;

    retrievalService = new RetrievalService(mockRepository, mockScoreService);
  });

  it('üres bemenet esetén azonnal üres választ ad vissza adatbázishívás nélkül', async () => {
    const result = await retrievalService.getMitigations({
      techniqueIds: [],
      softwareNames: [],
    });

    expect(result).toEqual({
      totalTechniques: 0,
      byTechnique: [],
      rankedMitigations: [],
    });

    expect(mockRepository.getMitigations).not.toHaveBeenCalled();
    expect(mockScoreService.calculateCoverage).not.toHaveBeenCalled();
  });

  it('kitisztítja a szóközöket és szűri a duplikációkat a bemenetből', async () => {
    vi.mocked(mockRepository.getMitigations).mockResolvedValue([]);
    vi.mocked(mockScoreService.calculateCoverage).mockReturnValue([]);

    await retrievalService.getMitigations({
      techniqueIds: [' T1059.001 ', 'T1059.001', ''],
      platforms: [' Windows '],
    });

    expect(mockRepository.getMitigations).toHaveBeenCalledWith({
      techniqueIds: ['T1059.001'],
      softwareNames: [],
      platforms: ['Windows'],
    });
  });

  it('összefűzi a repó és a score service eredményeit a válaszobjektumba', async () => {
    const mockRepoData = [
      {
        techniqueId: 'T1059.001',
        techniqueName: 'PowerShell',
        platforms: ['Windows'],
        mitigations: [{ mitigationId: 'M1038', name: 'Exec Prevention', description: '' }],
      },
    ];

    const mockScoredData = [
      {
        mitigationId: 'M1038',
        name: 'Exec Prevention',
        description: '',
        mitigatedTechniqueIds: ['T1059.001'],
        coverageScore: 1.0,
      },
    ];

    vi.mocked(mockRepository.getMitigations).mockResolvedValue(mockRepoData);
    vi.mocked(mockScoreService.calculateCoverage).mockReturnValue(mockScoredData);

    const result = await retrievalService.getMitigations({
      techniqueIds: ['T1059.001'],
    });

    expect(result.totalTechniques).toBe(1);
    expect(result.byTechnique).toEqual(mockRepoData);
    expect(result.rankedMitigations).toEqual(mockScoredData);
    expect(mockScoreService.calculateCoverage).toHaveBeenCalledWith(mockRepoData, 1);
  });
});