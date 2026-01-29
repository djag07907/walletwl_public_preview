import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Collector } from "../collectors.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { CollectorsMenuOptionsComponent } from "./collectors-menu-options.component";
import { BuildingIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-collector-cell",
  standalone: true,
  imports: [CommonModule, BuildingIconComponent],
  template: `
    <div class="collector-info">
      <div class="collector-icon">
        <icon-building size="1.25rem"></icon-building>
      </div>
      <div class="collector-details">
        <p class="collector-name">{{ collector.name }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .collector-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .collector-icon {
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

      .collector-details {
        min-width: 0;
        flex: 1;
      }

      .collector-name {
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
export class CollectorCellComponent {
  @Input() collector!: Collector;
}

@Component({
  selector: "app-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge
      [variant]="collector.status === 'active' ? 'default' : 'secondary'"
    >
      {{ translationService.t("collectors." + collector.status) }}
    </app-badge>
  `,
})
export class StatusCellComponent {
  @Input() collector!: Collector;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-actions-cell",
  standalone: true,
  imports: [CommonModule, CollectorsMenuOptionsComponent],
  template: `
    <app-collectors-menu-options
      [id]="collector.id"
      (actionSelected)="onAction($event)"
    ></app-collectors-menu-options>
  `,
})
export class ActionsCellComponent {
  @Input() collector!: Collector;
  @Input() onActionSelected!: (event: any) => void;

  onAction(event: any): void {
    if (this.onActionSelected) {
      this.onActionSelected(event);
    }
  }
}
