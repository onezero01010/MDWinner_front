export interface ChatMessage {
  question: string;
  answer: string;
  imageUrl?: string; // 이미지가 있을 경우
}