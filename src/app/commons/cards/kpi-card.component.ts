import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
  CardTitleComponent,
} from "@commons/cards/card.component";

export interface KpiData {
  title: string;
  value: string;
  change: string | null;
  trend: "up" | "down" | null;
  subtitle: string | null;
}

@Component({
  selector: "app-kpi-card",
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardTitleComponent,
  ],
  template: `
    <app-card [hoverEffect]="true">
      <app-card-header customClass="kpi-header">
        <div class="kpi-header-content">
          <app-card-title customClass="kpi-title">{{
            data.title
          }}</app-card-title>
          <div class="icon-container">
            <ng-content select="[icon]"></ng-content>
          </div>
        </div>
      </app-card-header>
      <app-card-content>
        <div class="kpi-value">{{ data.value }}</div>
        <div class="kpi-footer">
          <div
            class="trend-indicator"
            [class.positive]="data.trend === 'up'"
            [class.negative]="data.trend === 'down'"
          >
            <ng-content select="[trendIcon]"></ng-content>
          </div>
          <span
            class="kpi-change"
            [class.positive]="data.trend === 'up'"
            [class.negative]="data.trend === 'down'"
          >
            {{ data.change }}
          </span>
          <span class="kpi-subtitle">{{ data.subtitle }}</span>
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

      :host ::ng-deep *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      .kpi-header {
        padding-bottom: 0.5rem !important;
      }

      .kpi-header-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .kpi-title {
        font-size: 0.875rem !important;
        font-weight: 500 !important;
        color: #6b7280 !important;
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      ::ng-deep .kpi-title {
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      ::ng-deep .kpi-title * {
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      ::ng-deep app-card-title.kpi-title h3 {
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      .icon-container {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 0.5rem;
        background: rgba(59, 130, 246, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .icon-container ::ng-deep i {
        color: var(--primary-color, #3b82f6) !important;
        font-size: 1.25rem;
      }

      .kpi-value {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--text-color, #1a1a1a);
        line-height: 1.2;
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      .kpi-footer {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-top: 0.5rem;
      }

      .trend-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .trend-indicator ::ng-deep i {
        font-size: 1rem;
      }

      .trend-indicator.positive ::ng-deep i {
        color: #059669 !important;
      }

      .trend-indicator.negative ::ng-deep i {
        color: #dc2626 !important;
      }

      .kpi-change {
        font-size: 0.875rem;
        font-weight: 600;
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      .kpi-change.positive {
        color: #059669;
      }

      .kpi-change.negative {
        color: #dc2626;
      }

      .kpi-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin-left: 0.25rem;
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      @media (max-width: 768px) {
        .kpi-value {
          font-size: 1.5rem;
        }

        .kpi-subtitle {
          font-size: 0.75rem;
        }
      }

      @media (max-width: 480px) {
        .kpi-value {
          font-size: 1.25rem;
        }

        .icon-container {
          height: 2rem;
          width: 2rem;
        }

        .icon-container ::ng-deep i {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class KpiCardComponent {
  @Input() data!: KpiData;
}
