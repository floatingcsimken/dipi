import { Request, Response } from 'express';
import { AgentService } from '../services/agent';

export class AgentController {
  private agentService: AgentService;

  constructor(agentService: AgentService) {
    this.agentService = agentService;
  }

  investigate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        res.status(400).json({ error: 'Field "prompt" is required and must be a non-empty string.' });
        return;
      }

      const result = await this.agentService.investigate(prompt);
      res.status(200).json(result);
    } catch (error) {
      console.error('Agent investigation error:', error);
      res.status(500).json({ error: 'Failed to process incident investigation' });
    }
  };
}