export type Option = {
    id: number;
    text: string;
    questionId: number;
    createdAt: string;
    updatedAt: string;
}

export type Question = {
    id: number;
    question: string;
    options: Option[];
    answer: string;
    topic: string;
    subject: string;
    explanation: string;
    createdAt: string;
    updatedAt: string;
}