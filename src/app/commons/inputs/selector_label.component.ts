import { Component, Input, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { SelectModule } from "primeng/select";
import { FloatLabelModule } from "primeng/floatlabel";
import { emptyString } from "@app/resources/constants";

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  standalone: true,
  selector: "app-select-label",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    FloatLabelModule,
  ],
  template: `
    <p-floatlabel class="floating-label-fix" floatLabel="always">
      <p-select
        [id]="fieldId"
        [options]="options"
        [placeholder]="placeholder"
        [ngModel]="value"
        [disabled]="disabled"
        (onChange)="onSelectionChange($event)"
        (onBlur)="onBlur()"
        (onFocus)="onFocus()"
      ></p-select>
      <label [for]="fieldId">{{ label }}</label>
    </p-floatlabel>
    <small class="error-text" *ngIf="errorMessage">{{ errorMessage }}</small>
  `,
  styles: [
    `
      .error-text {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
      }

      :host {
        width: 100%;
        display: block;
      }

      p-floatlabel {
        width: 100%;
      }

      ::ng-deep p-select {
        width: 100% !important;
      }

      ::ng-deep p-select .p-select {
        width: 100% !important;
      }

      ::ng-deep p-select .p-inputtext {
        width: 100% !important;
      }

      ::ng-deep .floating-label-fix.p-float-label .p-select {
        padding-top: 2rem !important;
      }

      .floating-label-fix {
        position: relative;
      }

      ::ng-deep .floating-label-fix.p-float-label label {
        position: absolute !important;
        top: -0.75rem !important;
        left: 0.75rem !important;
        background: white !important;
        padding: 0 0.25rem !important;
        font-size: 0.75rem !important;
        color: #6c757d !important;
        font-weight: 600 !important;
        pointer-events: none;
        z-index: 1;
      }

      p-select,
      .p-dropdown {
        width: 100% !important;
      }

      .p-dropdown {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.8);

        &:hover {
          border-color: #d1d5db;
        }

        &:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectLabelComponent),
      multi: true,
    },
  ],
})
export class SelectLabelComponent implements ControlValueAccessor {
  @Input() label: string = emptyString;
  @Input() fieldId: string = emptyString;
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = emptyString;
  @Input() selectClass: string = "w-full";
  @Input() errorMessage: string = emptyString;
  @Input() floatLabel: "auto" | "always" | "never" = "always";
  @Input() disabled: boolean = false;

  value: any = null;

  private onChange = (value: any) => {
    // Esta funcion se usa para notificar cambios al formulario
    this.value = value;
  };
  private onTouched = () => {};

  onSelectionChange(event: any) {
    this.value = event.value;
    this.onChange(event.value);
  }

  onFocus() {
    // TODO: Agregar gestión de evento focus
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
