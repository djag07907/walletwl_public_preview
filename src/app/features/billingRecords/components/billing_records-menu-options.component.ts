import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ActionMenuComponent,
  MenuItem,
} from "@commons/ui/action-menu.component";
import { TranslationService } from "@app/services/translation.service";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-billing-records-menu-options",
  standalone: true,
  imports: [CommonModule, ActionMenuComponent],
  template: `
    <app-action-menu
      [items]="menuItems"
      [menuLabel]="translationService.t('billing_records.actions')"
      (itemClicked)="onActionClick($event)"
    ></app-action-menu>
  `,
})
export class BillingRecordsMenuOptionsComponent {
  @Input() billingRecordId!: string;
  @Output() actionSelected = new EventEmitter<{
    action: string;
    billingRecordId: string;
  }>();

  menuItems: MenuItem[] = [];

  constructor(public translationService: TranslationService) {
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      {
        label: this.translationService.t("billing_records.view_details"),
        action: "view",
        icon: "eye",
      },
      {
        label: this.translationService.t("billing_records.edit"),
        action: "edit",
        icon: "pencil",
      },
      {
        label: emptyString,
        action: emptyString,
        divider: true,
      },
      {
        label: this.translationService.t("billing_records.delete"),
        action: "delete",
        icon: "trash",
        destructive: true,
      },
    ];
  }

  onActionClick(action: string): void {
    this.actionSelected.emit({ action, billingRecordId: this.billingRecordId });
  }
}
