import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentService } from '../../../src/services/agent';
import { RetrievalService } from '../../../src/services/retrieval';
import { MetadataRepository } from '../../../src/repositories/metadata';

describe('AgentService', () => {
  let service: AgentService;
  let mockRetrievalService: RetrievalService;
  let mockMetadataRepo: MetadataRepository;

  beforeEach(() => {
    mockRetrievalService = {
      getMitigations: vi.fn().mockResolvedValue({
        rankedMitigations: [
          {
            mitigationId: 'M1038',
            name: 'Execution Prevention',
            description: 'Test description',
            coverageScore: 1.0,
            mitigatedTechniqueIds: ['T1566'],
          },
        ],
      }),
    } as unknown as RetrievalService;

    mockMetadataRepo = {
      validateTechniqueIds: vi.fn().mockResolvedValue([
        { id: 'T1566', name: 'Phishing' },
      ]),
    } as unknown as MetadataRepository;

    service = new AgentService(mockRetrievalService, mockMetadataRepo);
  });

  it('üres vagy hibás prompt esetén hibaüzenetet dob', async () => {
    await expect(service.investigate('')).rejects.toThrow('Prompt cannot be empty');
    await expect(service.investigate('   ')).rejects.toThrow('Prompt cannot be empty');
  });

  it('sikeresen feldolgozza a promptot, validálja a technikákat és lekéri a mitigációkat', async () => {
    (service as any).openai = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    origin: [{ name: 'Initial Access', description: 'Phishing attack vector' }],
                    currentTechniques: ['T1566'],
                    predictedNext: [{ name: 'Execution', description: 'PowerShell execution' }],
                    threatProfile: {
                      patternName: 'Phishing Campaign',
                      reasoning: 'Observed social engineering indicators.',
                    },
                    analystSummary: 'Suspicious email delivery detected.',
                  }),
                },
              },
            ],
          }),
        },
      },
    };

    const result = await service.investigate('User received a malicious link in email.');

    expect(result).toBeDefined();
    expect(result.rawPrompt).toEqual('User received a malicious link in email.');
    expect(result.totalTechniques).toEqual(1);
    expect(result.progression.currentTechniques).toEqual(['T1566']);
    expect(result.progression.threatProfile?.patternName).toEqual('Phishing Campaign');
    expect(result.mitigations).toHaveLength(1);
    expect(result.mitigations[0].mitigationId).toEqual('M1038');

    expect(mockMetadataRepo.validateTechniqueIds).toHaveBeenCalledWith(['T1566']);
    expect(mockRetrievalService.getMitigations).toHaveBeenCalledWith({
      techniqueIds: ['T1566'],
    });
  });
});