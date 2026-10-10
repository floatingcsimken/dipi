import axios from 'axios';
import type { AgentChatRequestDto, AgentChatResponseDto } from '../types/agent';


const API_BASE_URL = 'http://localhost:5000/api/agent'; // Vagy port 5000 / 4000

export const sendChatMessage = async (request: AgentChatRequestDto): Promise<AgentChatResponseDto> => {
  const response = await axios.post<AgentChatResponseDto>(`${API_BASE_URL}/chat`, request);
  return response.data;
};