import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { emptyString } from "@app/resources/constants";

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: "app-select",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="select-wrapper">
      <select
        [value]="value"
        [disabled]="disabled"
        (change)="onSelectChange($event)"
        class="select"
        [class.placeholder-shown]="!value && placeholder"
      >
        <option *ngIf="placeholder" value="" disabled selected hidden>
          {{ placeholder }}
        </option>
        <option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      <i class="pi pi-chevron-down select-icon"></i>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .select-wrapper {
        position: relative;
        display: inline-block;
        width: 100%;
      }

      .select {
        width: 100%;
        padding: 0.625rem 2.5rem 0.625rem 1rem;
        font-size: 0.875rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        background: white;
        color: var(--text-color, #1a1a1a);
        cursor: pointer;
        appearance: none;
        outline: none;
        transition: all 0.2s ease;
      }

      .select:hover:not(:disabled) {
        border-color: #d1d5db;
      }

      .select:focus {
        border-color: var(--primary-color, #3b82f6);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .select:disabled {
        background: #f9fafb;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .select.placeholder-shown {
        color: #9ca3af;
      }

      .select-icon {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: #6b7280;
        font-size: 0.875rem;
      }

      @media (prefers-reduced-motion: reduce) {
        .select {
          transition: none;
        }
      }
    `,
  ],
})
export class SelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() value: string = emptyString;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = emptyString;
  @Output() valueChange = new EventEmitter<string>();

  onSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.valueChange.emit(this.value);
  }
}
