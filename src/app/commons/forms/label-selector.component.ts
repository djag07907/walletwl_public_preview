import { Component, Input, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { emptyString } from "@app/resources/constants";
import { FormFieldComponent } from "./form-field.component";
import { SelectComponent, SelectOption } from "./select.component";

@Component({
  selector: "app-label-selector",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    SelectComponent,
  ],
  template: `
    <app-form-field
      [label]="label"
      [fieldId]="fieldId"
      [required]="required"
      [hint]="hint"
      [error]="error"
    >
      <app-select
        [options]="options"
        [disabled]="disabled"
        [value]="value"
        [placeholder]="placeholder"
        (valueChange)="onValueChange($event)"
      ></app-select>
    </app-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelSelectorComponent),
      multi: true,
    },
  ],
})
export class LabelSelectorComponent implements ControlValueAccessor {
  @Input() label: string = emptyString;
  @Input() fieldId: string = emptyString;
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = emptyString;
  @Input() required: boolean = false;
  @Input() hint: string = emptyString;
  @Input() error: string = emptyString;
  @Input() disabled: boolean = false;

  value: string = emptyString;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
