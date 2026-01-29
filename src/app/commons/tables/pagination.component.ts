import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "@commons/buttons/button.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-table-pagination",
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="pagination-container">
      <div class="pagination-info">
        <span class="text-sm">
          {{ translationService.t("table.showing") }} {{ startItem }}
          {{ translationService.t("table.to") }} {{ endItem }}
          {{ translationService.t("table.of") }} {{ totalItems }}
          {{ translationService.t("table.results") }}
        </span>
      </div>
      <div class="pagination-controls">
        <app-button
          variant="outline"
          size="sm"
          [disabled]="currentPage === 1"
          (clicked)="onPageChange(currentPage - 1)"
        >
          {{ translationService.t("table.previous") }}
        </app-button>
        <div class="pagination-pages">
          <button
            *ngFor="let page of visiblePages"
            [class]="getPageClass(page)"
            [disabled]="page === currentPage"
            (click)="onPageChange(page)"
          >
            {{ page }}
          </button>
        </div>
        <app-button
          variant="outline"
          size="sm"
          [disabled]="currentPage === totalPages"
          (clicked)="onPageChange(currentPage + 1)"
        >
          {{ translationService.t("table.next") }}
        </app-button>
      </div>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .pagination-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
        padding: 1rem 1.5rem;
        border-top: 1px solid #e5e7eb;
        align-items: center;
      }

      .pagination-info {
        color: #6b7280;
        font-size: 0.875rem;
        line-height: 2.5rem;
        display: flex;
        align-items: center;
      }

      .pagination-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .pagination-pages {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0 0.25rem;
      }

      .pagination-pages button {
        min-width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        background: white;
        color: var(--text-color, #1a1a1a);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .pagination-pages button:hover:not(:disabled) {
        background: #f9fafb;
      }

      .pagination-pages button:disabled {
        background: var(--primary-color, #3b82f6);
        color: white;
        cursor: default;
        border-color: var(--primary-color, #3b82f6);
      }

      .pagination-pages button.ellipsis {
        border: none;
        background: transparent;
        cursor: default;
      }

      .pagination-pages button.ellipsis:hover {
        background: transparent;
      }

      @media (min-width: 640px) {
        .pagination-container {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .pagination-info {
          margin: 0;
        }
      }

      @media (max-width: 768px) {
        .pagination-container {
          padding: 1rem 1rem 0 1rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pagination-pages button {
          transition: none;
        }
      }
    `,
  ],
})
export class TablePaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  constructor(public translationService: TranslationService) {}

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }

  get visiblePages(): number[] {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, this.currentPage - delta);
      i <= Math.min(this.totalPages - 1, this.currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) {
      rangeWithDots.push(-1, this.totalPages);
    } else if (this.totalPages > 1) {
      rangeWithDots.push(this.totalPages);
    }

    return rangeWithDots;
  }

  getPageClass(page: number): string {
    if (page === -1) return "pagination-pages button ellipsis";
    return "pagination-pages button";
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
