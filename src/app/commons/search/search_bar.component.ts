import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  template: `
    <div class="search-bar-wrapper" [class.focused]="isFocused">
      <i class="pi pi-search search-icon"></i>
      <input
        type="text"
        pInputText
        [(ngModel)]="search"
        placeholder="Search for something..."
        class="search-input"
        (input)="handleInputChange($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keyup.enter)="handleSearch()"
      />
      <button
        *ngIf="search && search.length > 0"
        pButton
        type="button"
        icon="pi pi-times"
        class="p-button-text clear-button"
        (click)="clearSearch()"
        [attr.aria-label]="'Clear search'"
      ></button>
    </div>
  `,
  styles: [
    `
      .search-bar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 25px;
        padding: 0 1rem;
        height: 40px;
        min-width: 280px;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      .search-bar-wrapper:hover {
        border-color: #6366f1;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
      }

      .search-bar-wrapper.focused {
        border-color: #6366f1;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1),
          0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .search-icon {
        color: #6b7280;
        margin-right: 0.75rem;
        font-size: 14px;
        transition: color 0.2s ease;
      }

      .search-bar-wrapper.focused .search-icon {
        color: #6366f1;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font-size: 14px;
        color: #374151;
        font-weight: 400;
        padding: 0;
      }

      .search-input::placeholder {
        color: #9ca3af;
        font-weight: 400;
      }

      .clear-button {
        margin-left: 0.5rem;
        width: 24px;
        height: 24px;
        min-width: 24px;
        padding: 0;
        border-radius: 50%;
        color: #6b7280;
        transition: all 0.2s ease;
      }

      ::ng-deep .clear-button:hover {
        background-color: #f3f4f6 !important;
        color: #374151 !important;
      }

      ::ng-deep .clear-button:focus {
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .search-bar-wrapper {
          min-width: 200px;
          height: 36px;
          padding: 0 0.75rem;
        }

        .search-input {
          font-size: 13px;
        }

        .search-icon {
          font-size: 13px;
          margin-right: 0.5rem;
        }
      }

      @media (max-width: 480px) {
        .search-bar-wrapper {
          min-width: 150px;
          height: 34px;
        }
      }
    `,
  ],
})
export class SearchBarComponent {
  @Input() search: string = emptyString;
  @Output() searchChange = new EventEmitter<string>();
  @Output() onSearch = new EventEmitter<string>();

  isFocused = false;

  handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.search = value;
    this.searchChange.emit(value);
  }

  handleSearch() {
    this.onSearch.emit(this.search);
  }

  clearSearch() {
    this.search = emptyString;
    this.searchChange.emit(this.search);
    this.onSearch.emit(this.search);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
}
