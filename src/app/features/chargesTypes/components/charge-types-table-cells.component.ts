import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChargeType } from "../charges_types.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { ChargeTypesMenuOptionsComponent } from "./charge-types-menu-options.component";
import { CheckCircleIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-charge-type-cell",
  standalone: true,
  imports: [CommonModule],
  template: ` <span class="code-value">{{ type.code }}</span> `,
  styles: [
    `
      .code-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary-color, #2563eb);
        background: var(--primary-color-light, #eff6ff);
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
      }
    `,
  ],
})
export class ChargeTypeCellComponent {
  @Input() type!: ChargeType;
}

@Component({
  selector: "app-category-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="getCategoryVariant(type.category)">
      {{ translationService.t(type.category) }}
    </app-badge>
  `,
})
export class CategoryCellComponent {
  @Input() type!: ChargeType;

  constructor(public translationService: TranslationService) {}

  getCategoryVariant(category: string): any {
    switch (category) {
      case "dashboard.top_transactions.taxes":
        return "default";
      case "dashboard.top_transactions.services":
        return "success";
      case "dashboard.top_transactions.fines":
        return "danger";
      case "dashboard.top_transactions.permits":
        return "warning";
      default:
        return "secondary";
    }
  }
}

@Component({
  selector: "app-taxable-cell",
  standalone: true,
  imports: [CommonModule, CheckCircleIconComponent],
  template: `
    <div class="taxable-cell" *ngIf="type.taxable">
      <icon-check-circle size="1.2rem" color="#10b981"></icon-check-circle>
    </div>
  `,
  styles: [
    `
      .taxable-cell {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class TaxableCellComponent {
  @Input() type!: ChargeType;
}

@Component({
  selector: "app-charge-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="type.status === 'active' ? 'success' : 'secondary'">
      {{ translationService.t("wallets." + type.status) }}
    </app-badge>
  `,
})
export class ChargeStatusCellComponent {
  @Input() type!: ChargeType;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-charge-actions-cell",
  standalone: true,
  imports: [CommonModule, ChargeTypesMenuOptionsComponent],
  template: `
    <app-charge-types-menu-options
      [id]="type.id"
      (actionSelected)="onAction($event)"
    ></app-charge-types-menu-options>
  `,
})
export class ChargeActionsCellComponent {
  @Input() type!: ChargeType;
  @Input() onActionSelected!: (event: any) => void;

  onAction(event: any): void {
    if (this.onActionSelected) {
      this.onActionSelected(event);
    }
  }
}
