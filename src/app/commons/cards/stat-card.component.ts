import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CardComponent,
  CardContentComponent,
} from "@commons/cards/card.component";

export interface StatData {
  label: string;
  value: string;
  iconColor: string;
}

@Component({
  selector: "app-stat-card",
  standalone: true,
  imports: [CommonModule, CardComponent, CardContentComponent],
  template: `
    <app-card customClass="stat-card-bg">
      <app-card-content customClass="stat-card-content">
        <div class="stat-icon-container" [style.color]="data.iconColor">
          <ng-content></ng-content>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ data.value }}</p>
          <p class="stat-label">{{ data.label }}</p>
        </div>
      </app-card-content>
    </app-card>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      * {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      ::ng-deep .stat-card-bg {
        background: rgba(249, 250, 251, 0.3);
        height: 100%;
      }

      ::ng-deep .stat-card-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem !important;
      }

      .stat-icon-container {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 0.5rem;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stat-icon-container ::ng-deep i {
        font-size: 1.25rem;
      }

      .stat-info {
        flex: 1;
        min-width: 0;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (min-width: 640px) {
        .stat-icon-container {
          height: 3rem;
          width: 3rem;
        }

        .stat-icon-container ::ng-deep i {
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 1.875rem;
        }

        ::ng-deep .stat-card-content {
          padding: 1rem !important;
        }
      }

      @media (max-width: 480px) {
        .stat-value {
          font-size: 1.25rem;
        }

        .stat-icon-container {
          height: 2rem;
          width: 2rem;
        }

        .stat-icon-container ::ng-deep i {
          font-size: 1rem;
        }

        ::ng-deep .stat-card-content {
          gap: 0.5rem;
          padding: 0.625rem 0.75rem !important;
        }
      }
    `,
  ],
})
export class StatCardComponent {
  @Input() data!: StatData;
}
