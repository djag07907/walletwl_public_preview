import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Payment } from "../payments.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { PaymentsMenuOptionsComponent } from "./payments-menu-options.component";
import { BuildingIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-payment-cell",
  standalone: true,
  imports: [CommonModule, BuildingIconComponent],
  template: `
    <div class="payment-info">
      <div class="payment-icon">
        <icon-building size="1.25rem"></icon-building>
      </div>
      <div class="payment-details">
        <p class="payment-name">{{ payment.payer.citizenName }}</p>
        <p class="payment-tax-id">Tax ID: {{ payment.payer.taxId }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .payment-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .payment-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        background: var(--primary-color-light, #dbeafe);
        color: var(--primary-color, #3b82f6);
        flex-shrink: 0;
      }

      .payment-details {
        min-width: 0;
        flex: 1;
      }

      .payment-name {
        font-weight: 500;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .payment-tax-id {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0.125rem 0 0 0;
      }
    `,
  ],
})
export class PaymentCellComponent {
  @Input() payment!: Payment;
}

@Component({
  selector: "app-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="payment.status === 'paid' ? 'default' : 'danger'">
      {{ translationService.t("payments." + payment.status) }}
    </app-badge>
  `,
})
export class StatusCellComponent {
  @Input() payment!: Payment;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-actions-cell",
  standalone: true,
  imports: [CommonModule, PaymentsMenuOptionsComponent],
  template: `
    <app-payments-menu-options
      [id]="payment.id"
      (actionSelected)="onAction($event)"
    ></app-payments-menu-options>
  `,
})
export class ActionsCellComponent {
  @Input() payment!: Payment;
  @Output() actionSelected = new EventEmitter<{ action: string; id: string }>();

  onAction(event: { action: string; id: string }): void {
    this.actionSelected.emit(event);
  }
}
