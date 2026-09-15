import { Request, Response } from 'express';
import { getDriver } from '../config/database';
import { RetrievalRepository } from '../repositories/retrieval';
import { RetrievalService } from '../services/retrieval';

export class RetrievalController {
  private service: RetrievalService;

  constructor() {
    const repository = new RetrievalRepository(getDriver());
    this.service = new RetrievalService(repository);
  }

  public queryMitigations = async (req: Request, res: Response): Promise<void> => {
    try {
      const results = await this.service.getMitigations(req.body);
      res.status(200).json({
        count: results.length,
        results,
      });
    } catch (error) {
      console.error('Error retrieving mitigations:', error);
      res.status(500).json({ error: 'Failed to retrieve mitigations' });
    }
  };
}