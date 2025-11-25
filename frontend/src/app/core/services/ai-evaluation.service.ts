import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvaluationRequest, EvaluationResponse } from '../interfaces/ai-evaluation.interface';

@Injectable({
    providedIn: 'root'
})
export class AiEvaluationService {
    private apiUrl = 'http://localhost:3000/ai';

    constructor(private http: HttpClient) { }

    evaluateMonth(month: number, year: number): Observable<EvaluationResponse> {
        const request: EvaluationRequest = { month, year };
        return this.http.post<EvaluationResponse>(`${this.apiUrl}/evaluate-month`, request);
    }
}
