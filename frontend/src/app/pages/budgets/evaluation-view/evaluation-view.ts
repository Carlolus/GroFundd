import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiEvaluationService } from '../../../core/services/ai-evaluation.service';
import { EvaluationResponse } from '../../../core/interfaces/ai-evaluation.interface';

@Component({
    selector: 'app-evaluation-view',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './evaluation-view.html',
    styleUrls: ['./evaluation-view.scss']
})
export class EvaluationView implements OnInit {
    selectedMonth: number;
    selectedYear: number;
    monthOptions = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    yearOptions: number[] = [];

    evaluation: EvaluationResponse | null = null;
    isLoading = false;
    error: string | null = null;

    constructor(private aiEvaluationService: AiEvaluationService) {
        // Initialize with current date
        const now = new Date();
        this.selectedMonth = now.getMonth() + 1;
        this.selectedYear = now.getFullYear();

        // Generate year options (current year ± 5 years)
        const currentYear = now.getFullYear();
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            this.yearOptions.push(i);
        }
    }

    ngOnInit() {
        // Optionally auto-load evaluation for current month
        // this.evaluateMonth();
    }

    evaluateMonth() {
        this.isLoading = true;
        this.error = null;
        this.evaluation = null;

        this.aiEvaluationService.evaluateMonth(this.selectedMonth, this.selectedYear)
            .subscribe({
                next: (response) => {
                    this.evaluation = response;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error evaluating month:', err);
                    this.error = 'No se pudo generar la evaluación. Por favor, intenta nuevamente.';
                    this.isLoading = false;
                }
            });
    }

    getScoreColor(): string {
        if (!this.evaluation) return '#64748b';
        const score = this.evaluation.score;
        if (score >= 8) return '#10b981'; // Green
        if (score >= 6) return '#f59e0b'; // Yellow
        if (score >= 4) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

    getScoreGradient(): string {
        if (!this.evaluation) return 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
        const score = this.evaluation.score;
        if (score >= 8) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        if (score >= 6) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        if (score >= 4) return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }

    getScoreLabel(): string {
        if (!this.evaluation) return '';
        const score = this.evaluation.score;
        if (score >= 8) return 'Excelente';
        if (score >= 6) return 'Bueno';
        if (score >= 4) return 'Regular';
        return 'Necesita Mejorar';
    }

    getScorePercentage(): number {
        return this.evaluation ? (this.evaluation.score / 10) * 100 : 0;
    }
}
