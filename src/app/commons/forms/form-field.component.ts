import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-form-field",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field">
      <label *ngIf="label" [for]="fieldId" class="field-label">
        {{ label }}
        <span *ngIf="required" class="required-indicator">*</span>
      </label>
      <ng-content></ng-content>
      <small *ngIf="hint && !error" class="field-hint">{{ hint }}</small>
      <small *ngIf="error" class="field-error">{{ error }}</small>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }

      .field-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color, #1a1a1a);
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .required-indicator {
        color: #ef4444;
        font-weight: 600;
      }

      .field-hint {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: -0.25rem;
      }

      .field-error {
        font-size: 0.75rem;
        color: #ef4444;
        margin-top: -0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .field-error::before {
        content: "⚠";
      }
    `,
  ],
})
export class FormFieldComponent {
  @Input() label: string = emptyString;
  @Input() fieldId: string = emptyString;
  @Input() required: boolean = false;
  @Input() hint: string = emptyString;
  @Input() error: string = emptyString;
}
