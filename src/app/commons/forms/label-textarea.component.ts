import { Component, Input, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { emptyString } from "@app/resources/constants";
import { FormFieldComponent } from "./form-field.component";
import { TextareaComponent } from "./textarea.component";

@Component({
  selector: "app-label-textarea",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    TextareaComponent,
  ],
  template: `
    <app-form-field
      [label]="label"
      [fieldId]="fieldId"
      [required]="required"
      [hint]="hint"
      [error]="error"
    >
      <app-textarea
        [placeholder]="placeholder"
        [disabled]="disabled"
        [rows]="rows"
        [value]="value"
        (valueChange)="onValueChange($event)"
      ></app-textarea>
    </app-form-field>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabelTextareaComponent),
      multi: true,
    },
  ],
})
export class LabelTextareaComponent implements ControlValueAccessor {
  @Input() label: string = emptyString;
  @Input() fieldId: string = emptyString;
  @Input() placeholder: string = emptyString;
  @Input() required: boolean = false;
  @Input() hint: string = emptyString;
  @Input() error: string = emptyString;
  @Input() disabled: boolean = false;
  @Input() rows: number = 3;

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
