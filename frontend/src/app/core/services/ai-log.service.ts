import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiLog } from '../interfaces/ai-log.interface';

@Injectable({
    providedIn: 'root'
})
export class AiLogService {
    private apiUrl = 'http://localhost:3000/ai-logs';

    constructor(private http: HttpClient) { }

    getLogs(): Observable<AiLog[]> {
        return this.http.get<AiLog[]>(this.apiUrl);
    }

    getLogById(id: string): Observable<AiLog> {
        return this.http.get<AiLog>(`${this.apiUrl}/${id}`);
    }
}
