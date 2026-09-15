import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { RetrievalController } from '../../../src/controllers/retrieval';
import { RetrievalService } from '../../../src/services/retrieval';
import { RetrievalResponseDto } from '../../../src/types/dtos/retrieval';

describe('RetrievalController', () => {
  let controller: RetrievalController;
  let mockService: RetrievalService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getMitigations: vi.fn(),
    } as unknown as RetrievalService;

    controller = new RetrievalController(mockService);

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it('sikeres kérés esetén 200-as státuszt és a feldolgozott adatokat küldi vissza', async () => {
    mockReq = {
      body: { techniqueIds: ['T1059.001'] },
    };

    const mockServiceResponse: RetrievalResponseDto = {
      totalTechniques: 1,
      byTechnique: [],
      rankedMitigations: [],
    };

    vi.mocked(mockService.getMitigations).mockResolvedValue(mockServiceResponse);

    await controller.queryMitigations(mockReq as Request, mockRes as Response);

    expect(mockService.getMitigations).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockServiceResponse);
  });

  it('ha a service hibát dob, 500-as státuszkóddal és hibaüzenettel tér vissza', async () => {
    mockReq = {
      body: { techniqueIds: ['T1059.001'] },
    };

    // A konzol hibaüzenetének elnémítása a teszt alatt
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(mockService.getMitigations).mockRejectedValue(new Error('Database connection failed'));

    await controller.queryMitigations(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to retrieve mitigations' });
  });
});