export type Question = {
    question: string;
    options: string[];
    answer: string;
    category: string;
    difficulty: "Fácil" | "Médio" | "Difícil";
}