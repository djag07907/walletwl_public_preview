import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [ngClass]="customClass">
      <span class="input-prefix" *ngIf="prefix">{{ prefix }}</span>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        [class]="inputClasses"
        [style.padding-left]="prefix ? '2.5rem' : null"
      />
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .input-wrapper {
        position: relative;
        width: 100%;
      }

      input {
        width: 100%;
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        outline: none;
        transition: all 0.2s ease;
        background: white;
        color: var(--text-color, #1a1a1a);
      }

      input::placeholder {
        color: #9ca3af;
      }

      input:focus {
        border-color: var(--primary-color, #3b82f6);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      input:disabled {
        background: #f9fafb;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .input-prefix {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 500;
        pointer-events: none;
        z-index: 10;
      }

      @media (prefers-reduced-motion: reduce) {
        input {
          transition: none;
        }
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() prefix: string = emptyString;
  @Input() type: string = "text";
  @Input() placeholder: string = emptyString;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() customClass: string = emptyString;
  @Input() value: string = emptyString;
  @Output() valueChange = new EventEmitter<string>();
  onChange: any = () => {};
  onTouched: any = () => {};

  get inputClasses(): string {
    return this.customClass;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  writeValue(value: string): void {
    this.value = value || emptyString;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
