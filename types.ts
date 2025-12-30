
export enum TabType {
  INTRO = 'INTRO',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  ALGORITHMS = 'ALGORITHMS',
  HEALTH_CHECKS = 'HEALTH_CHECKS',
  TYPES = 'TYPES',
  QUIZ = 'QUIZ'
}

export interface Server {
  id: string;
  name: string;
  weight: number;
  connections: number;
  isHealthy: boolean;
  status: 'idle' | 'busy' | 'down';
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
