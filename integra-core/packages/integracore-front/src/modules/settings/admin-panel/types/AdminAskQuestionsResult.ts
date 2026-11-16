import { type AskQuestionAnswer, type AskQuestionItem } from 'integracore-shared/ai';

export type AdminAskQuestionsResult = {
  questions: AskQuestionItem[];
  status: string;
  answers?: AskQuestionAnswer[];
};
