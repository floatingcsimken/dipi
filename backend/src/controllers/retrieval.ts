import { Request, Response } from 'express';
import { RetrievalService } from '../services/retrieval';

export class RetrievalController {
  constructor(private service: RetrievalService) {}

  public queryMitigations = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await this.service.getMitigations(req.body);

      // Közvetlenül visszaküldjük a strukturált eredményt
      res.status(200).json(response);
    } catch (error) {
      console.error('Error retrieving mitigations:', error);
      res.status(500).json({ error: 'Failed to retrieve mitigations' });
    }
  };
}