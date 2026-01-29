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
  selector: "app-textarea",
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="textarea-wrapper" [ngClass]="customClass">
      <textarea
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        [rows]="rows"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
        [class]="textareaClasses"
      ></textarea>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .textarea-wrapper {
        position: relative;
        width: 100%;
      }

      textarea {
        width: 100%;
        padding: 0.625rem 1rem;
        font-size: 0.875rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        outline: none;
        transition: all 0.2s ease;
        background: white;
        color: var(--text-color, #1a1a1a);
        resize: vertical;
        min-height: 80px;
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      textarea::placeholder {
        color: #9ca3af;
      }

      textarea:focus {
        border-color: var(--primary-color, #3b82f6);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      textarea:disabled {
        background: #f9fafb;
        cursor: not-allowed;
        opacity: 0.6;
      }

      @media (prefers-reduced-motion: reduce) {
        textarea {
          transition: none;
        }
      }
    `,
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder: string = emptyString;
  @Input() disabled: boolean = false;
  @Input() customClass: string = emptyString;
  @Input() rows: number = 3;
  @Input() value: string = emptyString;
  @Output() valueChange = new EventEmitter<string>();
  onChange: any = () => {};
  onTouched: any = () => {};

  get textareaClasses(): string {
    return this.customClass;
  }

  onInputChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;
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
