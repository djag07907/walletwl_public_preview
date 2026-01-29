import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "../users.mock";
import { BadgeComponent } from "@commons/ui/badge.component";
import { UsersMenuOptionsComponent } from "./users-menu-options.component";
import { UsersIconComponent } from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";
import { UserRole } from "@app/commons/enum/user_role";

@Component({
  selector: "app-user-cell",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-info">
      <div class="user-avatar">
        {{ getInitials(user.firstName, user.lastName) }}
      </div>
      <div class="user-details">
        <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
        <p class="user-id">ID: {{ user.id }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: var(--primary-color-light, #dbeafe);
        color: var(--primary-color, #3b82f6);
        font-weight: 600;
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .user-details {
        min-width: 0;
        flex: 1;
      }

      .user-name {
        font-weight: 500;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-id {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0.125rem 0 0 0;
      }
    `,
  ],
})
export class UserCellComponent {
  @Input() user!: User;

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }
}

@Component({
  selector: "app-email-cell",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-info">
      <p class="email-text">{{ user.email }}</p>
    </div>
  `,
  styles: [
    `
      .email-info {
        .email-text {
          font-size: 0.875rem;
          color: var(--text-color, #1a1a1a);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    `,
  ],
})
export class EmailCellComponent {
  @Input() user!: User;
}

@Component({
  selector: "app-role-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="getRoleVariant(user.role)">
      {{ getRoleLabel(user.role) }}
    </app-badge>
  `,
})
export class RoleCellComponent {
  @Input() user!: User;

  getRoleVariant(
    role: string,
  ): "default" | "secondary" | "success" | "warning" | "danger" {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "danger";
      case UserRole.MUNICIPALITY_ADMIN:
        return "warning";
      case UserRole.MANAGER:
        return "success";
      case UserRole.USER:
        return "secondary";
      default:
        return "secondary";
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Super Admin";
      case UserRole.MUNICIPALITY_ADMIN:
        return "Municipality Admin";
      case UserRole.MANAGER:
        return "Manager";
      case UserRole.USER:
        return "Regular User";
      default:
        return role;
    }
  }
}

@Component({
  selector: "app-user-status-cell",
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="user.status === 'active' ? 'success' : 'secondary'">
      {{ translationService.t("users." + user.status) }}
    </app-badge>
  `,
})
export class UserStatusCellComponent {
  @Input() user!: User;
  constructor(public translationService: TranslationService) {}
}

@Component({
  selector: "app-user-actions-cell",
  standalone: true,
  imports: [CommonModule, UsersMenuOptionsComponent],
  template: `
    <app-users-menu-options
      [userId]="user.id"
      (actionSelected)="onAction($event)"
    ></app-users-menu-options>
  `,
})
export class UserActionsCellComponent {
  @Input() user!: User;
  @Input() onActionSelected!: (event: any) => void;

  onAction(event: any): void {
    if (this.onActionSelected) {
      this.onActionSelected(event);
    }
  }
}
