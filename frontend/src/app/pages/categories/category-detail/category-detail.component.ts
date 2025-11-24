import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/interfaces/category.interface';

@Component({
    selector: 'app-category-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent {
    @Input() category!: Category;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
