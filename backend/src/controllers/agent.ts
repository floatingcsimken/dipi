import { NextFunction, Request, Response } from 'express';
import { AgentService } from '../services/agent';
import { AgentChatRequestDto } from '../types/dtos/agent';

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

  public chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as AgentChatRequestDto;

      if (!body.messages || !Array.isArray(body.messages)) {
        res.status(400).json({ error: 'A messages tömb megadása kötelező!' });
        return;
      }

      const result = await this.agentService.handleChat(body);
      res.status(200).json(result);
    } catch (error) {
      console.error('Agent chat error:', error);
      res.status(500).json({ 
        error: 'Failed to process chat interaction', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };
}