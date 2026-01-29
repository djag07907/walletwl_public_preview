import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ChargeType, mockChargeTypesData } from "../charges_types.mock";
import { TranslationService } from "@app/services/translation.service";
import { emptyString } from "@app/resources/constants";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { SelectOption } from "@commons/forms/select.component";
import { LabelInputComponent } from "@commons/forms/label-input.component";
import { LabelSelectorComponent } from "@commons/forms/label-selector.component";
import { SwitchComponent } from "@commons/forms/switch.component";
import {
  TagsIconComponent,
  ArrowLeftIconComponent,
  SaveIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-charge-types-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    ButtonComponent,
    LabelInputComponent,
    LabelSelectorComponent,
    SwitchComponent,
    TagsIconComponent,
    ArrowLeftIconComponent,
    SaveIconComponent,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button class="back-button" (click)="onCancel()">
          <icon-arrow-left size="1.25rem"></icon-arrow-left>
        </button>
        <div class="header-text">
          <h1 class="form-title">{{ formTitle }}</h1>
          <p class="form-subtitle">{{ formSubtitle }}</p>
        </div>
      </div>

      <form
        [formGroup]="chargeTypeForm"
        (ngSubmit)="onSubmit()"
        class="charge-form"
      >
        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-tags size="1.25rem"></icon-tags>
              <div>
                <h3 class="section-title">
                  {{
                    translationService.t("charge_types.charge_type_information")
                  }}
                </h3>
                <p class="section-description">
                  {{
                    translationService.t(
                      "charge_types.charge_type_information_desc"
                    )
                  }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="form-fields">
              <div class="form-grid">
                <app-label-input
                  [label]="translationService.t('charge_types.code')"
                  fieldId="code"
                  type="text"
                  [placeholder]="
                    translationService.t('charge_types.code_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('code')"
                  formControlName="code"
                >
                </app-label-input>

                <app-label-selector
                  [label]="translationService.t('charge_types.category')"
                  fieldId="category"
                  [options]="categoryOptions"
                  [required]="true"
                  [error]="getFieldError('category')"
                  formControlName="category"
                >
                </app-label-selector>

                <app-label-input
                  [label]="translationService.t('charge_types.default_amount')"
                  fieldId="defaultAmount"
                  type="number"
                  [placeholder]="
                    translationService.t('charge_types.amount_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('defaultAmount')"
                  formControlName="defaultAmount"
                >
                </app-label-input>

                <app-label-selector
                  [label]="translationService.t('charge_types.status')"
                  fieldId="status"
                  [options]="statusOptions"
                  [required]="true"
                  formControlName="status"
                >
                </app-label-selector>
              </div>

              <div class="form-grid-full">
                <app-label-input
                  [label]="translationService.t('charge_types.description')"
                  fieldId="description"
                  type="text"
                  [placeholder]="
                    translationService.t('charge_types.description_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('description')"
                  formControlName="description"
                >
                </app-label-input>
              </div>

              <div class="taxable-toggle">
                <div class="toggle-info">
                  <span class="toggle-label">{{
                    translationService.t("charge_types.taxable")
                  }}</span>
                  <span class="toggle-desc"
                    >Whether this charge attracts taxes</span
                  >
                </div>
                <app-switch formControlName="taxable"></app-switch>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <div class="form-actions">
          <app-button
            type="button"
            variant="outline"
            (clicked)="onCancel()"
            [disabled]="isSubmitting"
          >
            {{ translationService.t("charge_types.cancel") }}
          </app-button>
          <app-button
            type="submit"
            [disabled]="isSubmitting"
            customClass="submit-button"
          >
            <icon-save size="1rem"></icon-save>
            {{ submitButtonText }}
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .form-container {
        width: 100%;
        min-height: 100%;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @media (max-width: 768px) {
          padding: 1rem;
        }
      }

      .form-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .back-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        border: none;
        background: transparent;
        color: var(--text-color, #1a1a1a);
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f3f4f6;
        }
      }

      .header-text {
        flex: 1;
      }

      .form-title {
        font-size: 1.875rem;
        font-weight: 700;
        color: var(--text-color, #1a1a1a);
        margin: 0;

        @media (min-width: 640px) {
          font-size: 2.25rem;
        }
      }

      .form-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0.25rem 0 0 0;

        @media (min-width: 640px) {
          font-size: 1rem;
        }
      }

      .charge-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
      }

      .section-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        color: var(--primary-color, #3b82f6);
      }

      .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color, #1a1a1a);
        margin: 0;
      }

      .section-description {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0.25rem 0 0 0;
      }

      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .form-grid-full {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .taxable-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .toggle-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .toggle-desc {
          font-size: 0.75rem;
          color: #6b7280;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding-top: 0.5rem;

        @media (max-width: 768px) {
          flex-direction: column-reverse;

          app-button {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class ChargeTypesFormComponent implements OnInit {
  @Input() chargeType?: ChargeType;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  chargeTypeForm!: FormGroup;
  isSubmitting: boolean = false;
  id?: string;

  categoryOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeOptions();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id") || undefined;
      this.isEdit = !!this.id;

      if (this.isEdit && this.id) {
        this.chargeType = this.loadChargeTypeById(this.id);
      }

      this.initializeForm();
      this.initializeOptions();
    });
  }

  private initializeForm(): void {
    this.chargeTypeForm = this.fb.group({
      code: [this.chargeType?.code || emptyString, [Validators.required]],
      description: [
        this.chargeType?.description || emptyString,
        [Validators.required],
      ],
      category: [
        this.chargeType?.category || emptyString,
        [Validators.required],
      ],
      defaultAmount: [
        this.chargeType?.defaultAmount || 0,
        [Validators.required, Validators.min(0)],
      ],
      taxable: [this.chargeType?.taxable || false],
      status: [this.chargeType?.status || "active", [Validators.required]],
    });
  }

  private initializeOptions(): void {
    this.categoryOptions = [
      { label: "Taxes", value: "Taxes" },
      { label: "Services", value: "Services" },
      { label: "Fines", value: "Fines" },
      { label: "Permits", value: "Permits" },
    ];

    this.statusOptions = [
      {
        label: this.translationService.t("wallets.active"),
        value: "active",
      },
      {
        label: this.translationService.t("wallets.inactive"),
        value: "inactive",
      },
    ];
  }

  onSubmit(): void {
    if (this.chargeTypeForm.valid) {
      this.isSubmitting = true;

      const formValue = this.chargeTypeForm.getRawValue();

      const submission = {
        ...formValue,
        id: this.chargeType?.id || Date.now().toString(),
      };

      this.formSubmit.emit(submission);

      setTimeout(() => {
        this.router.navigate(["home/charge-types"]);
      }, 1000);
    } else {
      Object.keys(this.chargeTypeForm.controls).forEach((key) => {
        this.chargeTypeForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.router.navigate(["home/charge-types"]);
  }

  getFieldError(fieldName: string): string {
    const control = this.chargeTypeForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.["required"]) {
        return "This field is required";
      }
      if (control.errors?.["min"]) {
        return "Value must be positive";
      }
    }
    return emptyString;
  }

  get formTitle(): string {
    return this.isEdit
      ? this.translationService.t("charge_types.edit_charge_type")
      : this.translationService.t("charge_types.create_charge_type");
  }

  get formSubtitle(): string {
    return this.isEdit
      ? this.translationService.t("charge_types.edit_charge_type_subtitle")
      : this.translationService.t("charge_types.create_charge_type_subtitle");
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEdit
        ? this.translationService.t("charge_types.saving")
        : this.translationService.t("charge_types.creating");
    }
    return this.isEdit
      ? this.translationService.t("charge_types.save")
      : this.translationService.t("charge_types.save");
  }

  private loadChargeTypeById(id: string): ChargeType | undefined {
    return mockChargeTypesData.find((t) => t.id === id);
  }
}
