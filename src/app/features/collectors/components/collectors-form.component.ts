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
import { Collector, mockCollectorsData } from "../collectors.mock";
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
import { LabelTextareaComponent } from "@commons/forms/label-textarea.component";
import {
  BuildingIconComponent,
  DollarIconComponent,
  ArrowLeftIconComponent,
  SaveIconComponent,
  UsersIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-collector-form",
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
    LabelTextareaComponent,
    BuildingIconComponent,
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
        [formGroup]="collectorForm"
        (ngSubmit)="onSubmit()"
        class="collector-form"
      >
        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-building size="1.25rem"></icon-building>
              <div>
                <h3 class="section-title">
                  {{ translationService.t("collectors.collector_information") }}
                </h3>
                <p class="section-description">
                  {{
                    translationService.t(
                      "collectors.collector_information_desc"
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
                  [label]="translationService.t('collectors.collector_name')"
                  fieldId="name"
                  type="text"
                  [placeholder]="
                    translationService.t(
                      'collectors.collector_name_placeholder'
                    )
                  "
                  [required]="true"
                  [error]="getFieldError('name')"
                  formControlName="name"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('collectors.collector_id')"
                  fieldId="id"
                  type="text"
                  [placeholder]="
                    translationService.t('collectors.collector_id_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('id')"
                  formControlName="id"
                  [disabled]="isEdit"
                >
                </app-label-input>

                <app-label-input
                  label="Email"
                  fieldId="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  [required]="true"
                  [error]="getFieldError('email')"
                  formControlName="email"
                >
                </app-label-input>

                <app-label-input
                  label="Phone"
                  fieldId="phone"
                  type="tel"
                  placeholder="+1 234 567 890"
                  [required]="true"
                  [error]="getFieldError('phone')"
                  formControlName="phone"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('collectors.role')"
                  fieldId="role"
                  type="text"
                  placeholder="Collector"
                  [required]="true"
                  [error]="getFieldError('role')"
                  formControlName="role"
                >
                </app-label-input>

                <app-label-selector
                  [label]="translationService.t('collectors.status')"
                  fieldId="status"
                  [options]="statusOptions"
                  [required]="true"
                  formControlName="status"
                >
                </app-label-selector>
              </div>

              <div class="form-grid-full">
                <app-label-textarea
                  [label]="
                    translationService.t('collectors.assigned_municipalities')
                  "
                  fieldId="assignedMunicipalities"
                  placeholder="Springfield, Shelbyville"
                  [required]="true"
                  [error]="getFieldError('assignedMunicipalities')"
                  formControlName="assignedMunicipalities"
                  hint="Separate municipalities with commas"
                >
                </app-label-textarea>
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
            {{ translationService.t("collectors.cancel") }}
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

        @media (max-width: 480px) {
          padding: 0.75rem;
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

        @media (max-width: 480px) {
          font-size: 1.5rem;
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

      .collector-form {
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

      .form-grid-3 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .form-grid-full {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;

        gap: 0.75rem;
        padding-top: 0.5rem;

        ::ng-deep .submit-btn,
        ::ng-deep .cancel-btn {
          @media (max-width: 640px) {
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          flex-direction: column-reverse;

          app-button {
            width: 100%;
          }
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          transition: none !important;
          animation: none !important;
        }
      }
    `,
  ],
})
export class CollectorFormComponent implements OnInit {
  @Input() collector?: Collector;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  collectorForm!: FormGroup;
  isSubmitting: boolean = false;
  id?: string;

  statusOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute
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
        this.collector = this.loadCollectorById(this.id);
      }

      this.initializeForm();
      this.initializeOptions();
    });
  }

  // TODO: Datos de prueba
  private initializeForm(): void {
    const assignedMunis = this.collector?.assignedMunicipalities
      ? this.collector.assignedMunicipalities.join(", ")
      : emptyString;

    this.collectorForm = this.fb.group({
      name: [this.collector?.name || emptyString, [Validators.required]],
      id: [
        { value: this.collector?.id || emptyString, disabled: this.isEdit },
        [Validators.required],
      ],
      email: [
        this.collector?.email || emptyString,
        [Validators.required, Validators.email],
      ],
      phone: [this.collector?.phone || emptyString, [Validators.required]],
      role: [this.collector?.role || "Collector", [Validators.required]],
      assignedMunicipalities: [assignedMunis, [Validators.required]],
      status: [this.collector?.status || "active", [Validators.required]],
    });
  }

  private initializeOptions(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("collectors.active"),
        value: "active",
      },
      {
        label: this.translationService.t("collectors.inactive"),
        value: "inactive",
      },
      {
        label: this.translationService.t("collectors.suspended"),
        value: "suspended",
      },
    ];
  }

  onSubmit(): void {
    if (this.collectorForm.valid) {
      this.isSubmitting = true;

      const formValue = this.collectorForm.getRawValue();
      const munis = formValue.assignedMunicipalities
        .split(",")
        .map((s: string) => s.trim());

      const submission = {
        ...formValue,
        assignedMunicipalities: munis,
      };

      this.formSubmit.emit(submission);

      // TODO: Implementar la lógica de guardado
      setTimeout(() => {
        this.router.navigate(["home/collectors"]);
      }, 1000);
    } else {
      Object.keys(this.collectorForm.controls).forEach((key) => {
        this.collectorForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.router.navigate(["home/collectors"]);
  }

  getFieldError(fieldName: string): string {
    const control = this.collectorForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.["required"]) {
        return "This field is required"; // Simple fallback, usually from translation
      }
      if (control.errors?.["email"]) {
        return (
          this.translationService.t("form.email_invalid") || "Invalid email"
        );
      }
    }
    return emptyString;
  }

  get formTitle(): string {
    return this.isEdit
      ? this.translationService.t("collectors.edit_collector")
      : this.translationService.t("collectors.create_collector");
  }

  get formSubtitle(): string {
    return this.isEdit
      ? this.translationService.t("collectors.edit_collector_subtitle")
      : this.translationService.t("collectors.create_collector_subtitle");
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEdit
        ? this.translationService.t("collectors.saving")
        : this.translationService.t("collectors.creating");
    }
    return this.isEdit
      ? this.translationService.t("collectors.save")
      : this.translationService.t("collectors.save");
  }

  private loadCollectorById(id: string): Collector | undefined {
    // TODO: Reemplazar con API
    return mockCollectorsData.find((collector) => collector.id === id);
  }
}
