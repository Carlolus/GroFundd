import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiLogService } from '../../../core/services/ai-log.service';
import { AiLog } from '../../../core/interfaces/ai-log.interface';
import { AiLogDetailComponent } from '../ai-log-detail/ai-log-detail.component';

@Component({
    selector: 'app-ai-logs-view',
    standalone: true,
    imports: [CommonModule, AiLogDetailComponent],
    templateUrl: './ai-logs-view.html',
    styleUrls: ['./ai-logs-view.scss']
})
export class AiLogsView implements OnInit {
    logs: AiLog[] = [];
    selectedLog: AiLog | null = null;

    constructor(private aiLogService: AiLogService) { }

    ngOnInit() {
        this.loadLogs();
    }

    loadLogs() {
        this.aiLogService.getLogs().subscribe({
            next: (data) => {
                this.logs = data;
            },
            error: (err) => {
                console.error('Error loading AI logs:', err);
            }
        });
    }

    onView(log: AiLog) {
        this.selectedLog = log;
    }

    closeDetailModal() {
        this.selectedLog = null;
    }

    formatDate(dateString: Date | string): string {
        const date = new Date(dateString);
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
