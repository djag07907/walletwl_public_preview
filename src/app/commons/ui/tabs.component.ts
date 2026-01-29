import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-container">
      <div class="tabs-list" role="tablist">
        <button
          *ngFor="let tab of tabs"
          type="button"
          role="tab"
          [attr.aria-selected]="activeTab === tab.id"
          [class.active]="activeTab === tab.id"
          class="tab-button"
          (click)="selectTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content" role="tabpanel">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .tabs-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .tabs-list {
        display: inline-flex;
        background-color: #f3f4f6;
        padding: 0.25rem;
        border-radius: 0.5rem;
        width: fit-content;
      }

      .tab-button {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        border: none;
        background: transparent;
        color: #6b7280;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;

        &:hover {
          color: #1f2937;
        }

        &.active {
          background-color: white;
          color: var(--text-color, #1a1a1a);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        &:focus-visible {
          outline: 2px solid var(--primary-color, #3b82f6);
          outline-offset: 2px;
        }
      }

      .tab-content {
        flex: 1;
        position: relative;
        contain: layout style paint;

        ::ng-deep {
          > * {
            position: relative;
            display: block;
          }

          icon-globe,
          icon-building,
          icon-bell,
          icon-shield,
          icon-database {
            display: inline-flex;
            position: static;
          }
        }
      }

      @media (max-width: 640px) {
        .tabs-list {
          width: 100%;
          overflow-x: auto;
          display: flex;
        }

        .tab-button {
          flex-shrink: 0;
        }
      }
    `,
  ],
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTab: string = "";
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.tabChange.emit(tabId);
  }
}
