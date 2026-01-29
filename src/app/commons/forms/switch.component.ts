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
  selector: "app-switch",
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked"
      [attr.aria-label]="label"
      [disabled]="disabled"
      [class]="switchClasses"
      (click)="toggle()"
    >
      <span [class]="thumbClasses"></span>
    </button>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      button {
        position: relative;
        display: inline-flex;
        align-items: center;
        height: 1.5rem;
        width: 2.75rem;
        flex-shrink: 0;
        cursor: pointer;
        border-radius: 9999px;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        background-color: #e5e7eb;

        &:focus-visible {
          outline: 2px solid var(--primary-color, #3b82f6);
          outline-offset: 2px;
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        &.checked {
          background-color: var(--primary-color, #3b82f6);
        }
      }

      .thumb {
        pointer-events: none;
        display: block;
        height: 1.25rem;
        width: 1.25rem;
        border-radius: 9999px;
        background-color: white;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px 0 rgba(0, 0, 0, 0.06);
        transition: transform 0.2s ease;
        transform: translateX(0);

        &.checked {
          transform: translateX(1.25rem);
        }
      }
    `,
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() label: string = emptyString;
  @Input() disabled: boolean = false;
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get switchClasses(): string {
    return this.checked ? "checked" : emptyString;
  }

  get thumbClasses(): string {
    return `thumb ${this.checked ? "checked" : emptyString}`;
  }

  toggle(): void {
    if (this.disabled) return;

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
