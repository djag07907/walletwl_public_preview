import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BillingRecord } from "../billing_records.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { BillingRecordsMenuOptionsComponent } from "./billing_records-menu-options.component";
import { BuildingIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-billing-record-cell",
  standalone: true,
  imports: [CommonModule, BuildingIconComponent],
  template: `
    <div class="billing-record-info">
      <div class="billing-record-icon">
        <icon-building size="1.25rem"></icon-building>
      </div>
      <div class="billing-record-details">
        <p class="billing-record-name">{{ billingRecord.citizenName }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .billing-record-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .billing-record-icon {
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

      .billing-record-details {
        min-width: 0;
        flex: 1;
      }

      .billing-record-name {
        font-weight: 500;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
})
export class BillingRecordCellComponent {
  @Input() billingRecord!: BillingRecord;
}

@Component({
  selector: "app-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge
      [variant]="billingRecord.status === 'paid' ? 'default' : 'secondary'"
    >
      {{ translationService.t("billing_records." + billingRecord.status) }}
    </app-badge>
  `,
})
export class StatusCellComponent {
  @Input() billingRecord!: BillingRecord;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-actions-cell",
  standalone: true,
  imports: [CommonModule, BillingRecordsMenuOptionsComponent],
  template: `
    <app-billing-records-menu-options
      [billingRecordId]="billingRecord.id"
      (actionSelected)="onAction($event)"
    ></app-billing-records-menu-options>
  `,
})
export class ActionsCellComponent {
  @Input() billingRecord!: BillingRecord;
  @Input() onActionSelected!: (event: any) => void;

  onAction(event: any): void {
    if (this.onActionSelected) {
      this.onActionSelected(event);
    }
  }
}
