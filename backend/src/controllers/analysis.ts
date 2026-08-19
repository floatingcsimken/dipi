import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis';
import { AnalysisRequestDto } from '../types/dtos/analysis';

export class AnalysisController {
  private service: AnalysisService;

  constructor(service: AnalysisService) {
    this.service = service;
  }

  public analyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestDto: AnalysisRequestDto = req.body;
      const result = await this.service.analyzeIncident(requestDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}