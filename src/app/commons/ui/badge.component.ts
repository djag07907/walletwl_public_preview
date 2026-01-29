import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem 0.625rem;
        font-size: 0.75rem;
        font-weight: 500;
        border-radius: 9999px;
        white-space: nowrap;
        text-transform: capitalize;
      }

      .badge-default {
        background: var(--primary-color, #3b82f6);
        color: white;
      }

      .badge-secondary {
        background: #f3f4f6;
        color: #6b7280;
      }

      .badge-success {
        background: #dcfce7;
        color: #059669;
      }

      .badge-warning {
        background: #fef3c7;
        color: #f59e0b;
      }

      .badge-danger {
        background: #fee2e2;
        color: #dc2626;
      }
    `,
  ],
})
export class BadgeComponent {
  @Input() variant: "default" | "secondary" | "success" | "warning" | "danger" =
    "default";
  @Input() customClass: string = emptyString;

  get badgeClasses(): string {
    return `badge-${this.variant} ${this.customClass}`.trim();
  }
}
