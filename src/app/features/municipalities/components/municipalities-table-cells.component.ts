import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Municipality } from "../municipalities.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { MunicipalitiesMenuOptionsComponent } from "./municipalities-menu-options.component";
import { BuildingIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-municipality-cell",
  standalone: true,
  imports: [CommonModule, BuildingIconComponent],
  template: `
    <div class="municipality-info">
      <div
        class="municipality-icon"
        [style.background-image]="
          municipality.logo ? 'url(' + municipality.logo + ')' : null
        "
        [style.background-size]="'cover'"
      >
        <icon-building
          *ngIf="!municipality.logo"
          size="1.25rem"
        ></icon-building>
      </div>
      <div class="municipality-details">
        <p class="municipality-name">{{ municipality.municipalityName }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .municipality-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .municipality-icon {
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

      .municipality-details {
        min-width: 0;
        flex: 1;
      }

      .municipality-name {
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
export class MunicipalityCellComponent {
  @Input() municipality!: Municipality;
}

@Component({
  selector: "app-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge
      [variant]="municipality.status === 'active' ? 'default' : 'secondary'"
    >
      {{ translationService.t("municipalities." + municipality.status) }}
    </app-badge>
  `,
})
export class StatusCellComponent {
  @Input() municipality!: Municipality;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-actions-cell",
  standalone: true,
  imports: [CommonModule, MunicipalitiesMenuOptionsComponent],
  template: `
    <app-municipalities-menu-options
      [id]="municipality.id"
      (actionSelected)="onAction($event)"
    ></app-municipalities-menu-options>
  `,
})
export class ActionsCellComponent {
  @Input() municipality!: Municipality;
  @Input() onActionSelected!: (event: any) => void;

  onAction(event: any): void {
    if (this.onActionSelected) {
      this.onActionSelected(event);
    }
  }
}
