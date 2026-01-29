import { Component, Input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardComponent } from "@app/commons/cards/card.component";

@Component({
  selector: "app-batch-kpi-card",
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card customClass="kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">{{ label }}</span>
        <div class="kpi-icon" [ngClass]="type">
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>
      <div class="kpi-value" [class.error-text]="type === 'error'">
        {{ value }}
      </div>
      <div class="kpi-footer" [ngClass]="footerClass">
        <ng-content select="[footerIcon]"></ng-content>
        <span>{{ footerText }}</span>
      </div>
    </app-card>
  `,
  styles: [
    `
      .kpi-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          .kpi-label {
            color: #64748b;
            font-weight: 600;
            font-size: 1rem;
            font-family: var(--font-family-primary) !important;
          }

          .kpi-icon {
            width: 32px;
            height: 32px;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;

            &.total {
              background: #eff6ff;
            }
            &.valid {
              background: #ecfdf5;
            }
            &.error {
              background: #fef2f2;
            }
          }
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-family: var(--font-family-primary) !important;

          &.error-text {
            color: #ef4444;
          }
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: var(--font-family-primary) !important;

          &.success {
            color: #10b981;
          }
          &.danger {
            color: #ef4444;
          }
          &.warning {
            color: #f59e0b;
          }
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class BatchKpiCardComponent {
  @Input() label: string = "";
  @Input() value: string | number = "";
  @Input() footerText: string = "";
  @Input() footerClass: "success" | "danger" | "warning" = "success";
  @Input() type: "total" | "valid" | "error" = "total";
}
