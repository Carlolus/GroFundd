import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiLog } from '../../../core/interfaces/ai-log.interface';

@Component({
    selector: 'app-ai-log-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ai-log-detail.component.html',
    styleUrls: ['./ai-log-detail.component.scss']
})
export class AiLogDetailComponent {
    @Input() log!: AiLog;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    formatDate(dateString: Date | string): string {
        const date = new Date(dateString);
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    get formattedOutput(): string {
        if (!this.log?.output_text) return '';
        try {
            // Remove markdown code blocks if present
            let cleanText = this.log.output_text.replace(/```json\n|\n```/g, '');
            // Try to parse as JSON to pretty print
            const parsed = JSON.parse(cleanText);
            return JSON.stringify(parsed, null, 2);
        } catch (e) {
            return this.log.output_text;
        }
    }
}
