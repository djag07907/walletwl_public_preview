import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ActionMenuComponent,
  MenuItem,
} from "@commons/ui/action-menu.component";
import { TranslationService } from "@app/services/translation.service";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-users-menu-options",
  standalone: true,
  imports: [CommonModule, ActionMenuComponent],
  template: `
    <app-action-menu
      [items]="menuItems"
      [menuLabel]="translationService.t('users.actions')"
      (itemClicked)="onActionClick($event)"
    ></app-action-menu>
  `,
})
export class UsersMenuOptionsComponent {
  @Input() userId!: string;
  @Output() actionSelected = new EventEmitter<{
    action: string;
    userId: string;
  }>();

  menuItems: MenuItem[] = [];

  constructor(public translationService: TranslationService) {
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      {
        label: this.translationService.t("users.view_profile"),
        action: "view",
        icon: "eye",
      },
      {
        label: this.translationService.t("users.edit"),
        action: "edit",
        icon: "pencil",
      },
      {
        label: emptyString,
        action: emptyString,
        divider: true,
      },
      {
        label: this.translationService.t("users.deactivate"),
        action: "toggle_status",
        icon: "ban",
        destructive: true,
      },
    ];
  }

  onActionClick(action: string): void {
    this.actionSelected.emit({ action, userId: this.userId });
  }
}
