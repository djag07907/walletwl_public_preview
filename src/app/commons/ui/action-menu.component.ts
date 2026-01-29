import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "@commons/buttons/button.component";
import { MoreVerticalIconComponent } from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";

export interface MenuItem {
  label: string;
  action: string;
  icon?: string;
  divider?: boolean;
  destructive?: boolean;
}

@Component({
  selector: "app-action-menu",
  standalone: true,
  imports: [CommonModule, ButtonComponent, MoreVerticalIconComponent],
  template: `
    <div class="action-menu">
      <app-button
        variant="ghost"
        size="sm"
        customClass="menu-trigger"
        (clicked)="toggleMenu()"
      >
        <icon-more-vertical size="1rem"></icon-more-vertical>
      </app-button>
      <div class="menu-content" [class.open]="isOpen" *ngIf="isOpen">
        <div class="menu-header" *ngIf="menuLabel">{{ menuLabel }}</div>
        <ng-container *ngFor="let item of items">
          <div class="menu-divider" *ngIf="item.divider"></div>
          <button
            *ngIf="!item.divider"
            class="menu-item"
            [class.destructive]="item.destructive"
            (click)="onItemClick(item)"
          >
            <i
              *ngIf="item.icon"
              [class]="'pi pi-' + item.icon + ' menu-icon'"
            ></i>
            {{ item.label }}
          </button>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .action-menu {
        position: relative;
        display: inline-block;
      }

      ::ng-deep .menu-trigger {
        padding: 0.25rem !important;
        min-width: auto !important;
      }

      .menu-content {
        position: absolute;
        right: 0;
        top: calc(100% + 0.5rem);
        min-width: 12rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 50;
        opacity: 0;
        transform: translateY(-0.5rem);
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      .menu-content.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .menu-header {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
      }

      .menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 0.75rem;
        font-size: 0.875rem;
        color: var(--text-color, #1a1a1a);
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .menu-item:hover {
        background-color: #f9fafb;
      }

      .menu-item.destructive {
        color: #dc2626;
      }

      .menu-item.destructive:hover {
        background-color: #fee2e2;
      }

      .menu-icon {
        font-size: 1rem;
        flex-shrink: 0;
      }

      .menu-divider {
        height: 1px;
        background-color: #e5e7eb;
        margin: 0.25rem 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .menu-content {
          transition: none;
        }
      }
    `,
  ],
})
export class ActionMenuComponent {
  @Input() items: MenuItem[] = [];
  @Input() menuLabel: string = emptyString;
  @Output() itemClicked = new EventEmitter<string>();

  isOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  onItemClick(item: MenuItem): void {
    this.itemClicked.emit(item.action);
    this.isOpen = false;
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
