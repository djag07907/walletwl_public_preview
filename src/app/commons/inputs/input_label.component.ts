import { Component, Input, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { FloatLabelModule } from "primeng/floatlabel";
import { FormsModule } from "@angular/forms";
import { emptyString } from "@app/resources/constants";

@Component({
  standalone: true,
  selector: "app-input-label",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
  ],

  template: `
    <p-floatlabel class="input-container">
      <input
        *ngIf="inputType !== 'password'"
        pInputText
        [id]="fieldId"
        [type]="inputType"
        [placeholder]="placeholder"
        class="styled-input"
        [ngModel]="value"
        [disabled]="disabled"
        (ngModelChange)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
      />

      <p-password
        *ngIf="inputType === 'password'"
        [id]="fieldId"
        [toggleMask]="toggleMask"
        [feedback]="showFeedback"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ngModel]="value"
        (ngModelChange)="onPasswordInput($event)"
        (onBlur)="onBlur()"
        (onFocus)="onFocus()"
      />

      <label [for]="fieldId">{{ label }}</label>
    </p-floatlabel>

    <small class="error-text" *ngIf="errorMessage">{{ errorMessage }}</small>
  `,
  styles: [
    `
      .input-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
      }

      .styled-input {
        width: 100%;
        padding: 0.65rem 0.85rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        background-color: #fff;
      }

      .styled-input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        outline: none;
      }

      ::ng-deep .p-float-label label {
        color: #6b7280;
        font-size: 0.9rem;
      }

      ::ng-deep .p-password input {
        padding: 0.65rem 0.85rem;
        border-radius: 0.5rem;
        font-size: 1rem;
      }

      .error-text {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputLabelComponent),
      multi: true,
    },
  ],
})
export class InputLabelComponent implements ControlValueAccessor {
  @Input() label: string = emptyString;
  @Input() fieldId: string = emptyString;
  @Input() inputType: string = "text";
  @Input() placeholder: string = emptyString;
  @Input() errorMessage: string = emptyString;
  @Input() floatLabel: "auto" | "always" | "never" = "auto";
  @Input() toggleMask: boolean = true;
  @Input() showFeedback: boolean = false;
  @Input() disabled: boolean = false;

  value: string = emptyString;

  private onChange = (value: string) => {
    // Esta funcion se usa para notificar cambios al formulario
    this.value = value;
  };
  private onTouched = () => {};

  onPasswordInput(value: string) {
    this.value = value;
    this.onChange(value);
  }

  onInput(value: string) {
    this.value = value;
    this.onChange(value);
  }

  onFocus() {
    // TODO: Agregar gestión de evento focus
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || emptyString;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
