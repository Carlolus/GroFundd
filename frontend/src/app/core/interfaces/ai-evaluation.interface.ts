export interface Highlights {
    positive: string[];
    negative: string[];
}

export interface EvaluationResponse {
    evaluation: string;
    score: number;
    highlights: Highlights;
    recommendations: string[];
    insights: string[];
}

export interface EvaluationRequest {
    month: number;
    year: number;
}
