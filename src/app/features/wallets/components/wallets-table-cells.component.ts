import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Wallet } from "../wallets.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { WalletsMenuOptionsComponent } from "./wallets-menu-options.component";
import { BuildingIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-wallet-cell",
  standalone: true,
  imports: [CommonModule, BuildingIconComponent],
  template: `
    <div class="wallet-info">
      <div class="wallet-icon">
        <icon-building size="1.25rem"></icon-building>
      </div>
      <div class="wallet-details">
        <p class="wallet-name">{{ wallet.dpi }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .wallet-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .wallet-icon {
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

      .wallet-details {
        min-width: 0;
        flex: 1;
      }

      .wallet-name {
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
export class WalletCellComponent {
  @Input() wallet!: Wallet;
}

@Component({
  selector: "app-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="wallet.status === 'active' ? 'default' : 'secondary'">
      {{ translationService.t("wallets." + wallet.status) }}
    </app-badge>
  `,
})
export class StatusCellComponent {
  @Input() wallet!: Wallet;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-actions-cell",
  standalone: true,
  imports: [CommonModule, WalletsMenuOptionsComponent],
  template: `
    <app-wallets-menu-options
      [id]="wallet.id"
      (actionSelected)="onAction($event)"
    ></app-wallets-menu-options>
  `,
})
export class ActionsCellComponent {
  @Input() wallet!: Wallet;
  @Input() onActionSelected!: (event: any) => void;

  onAction(event: any): void {
    if (this.onActionSelected) {
      this.onActionSelected(event);
    }
  }
}
