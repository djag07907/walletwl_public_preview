import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  effect,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Municipality, mockMunicipalitiesData } from "../municipalities.mock";
import { mockMunicipalityUsersData } from "../municipalities-users.mock";
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
import {
  BuildingIconComponent,
  DollarIconComponent,
  ArrowLeftIconComponent,
  SaveIconComponent,
  UsersIconComponent,
  UploadIconComponent,
  TrashIconComponent,
} from "@app/shared/components/icons/icons.component";
import { primaryColor, secondaryColor } from "@app/resources/styles.constants";

@Component({
  selector: "app-municipality-form",
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
    BuildingIconComponent,
    ArrowLeftIconComponent,
    SaveIconComponent,
    UploadIconComponent,
    TrashIconComponent,
    UsersIconComponent,
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
        [formGroup]="municipalityForm"
        (ngSubmit)="onSubmit()"
        class="municipality-form"
      >
        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-building size="1.25rem"></icon-building>
              <div>
                <h3 class="section-title">
                  {{
                    translationService.t(
                      "municipalities.municipality_information"
                    )
                  }}
                </h3>
                <p class="section-description">
                  {{
                    translationService.t(
                      "municipalities.municipality_information_desc"
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
                  [label]="
                    translationService.t('municipalities.municipality_id')
                  "
                  fieldId="id"
                  type="text"
                  [placeholder]="
                    translationService.t(
                      'municipalities.municipality_id_placeholder'
                    )
                  "
                  [required]="true"
                  [error]="getFieldError('id')"
                  formControlName="id"
                  [disabled]="isEdit"
                >
                </app-label-input>

                <app-label-input
                  [label]="
                    translationService.t('municipalities.municipality_name')
                  "
                  fieldId="municipalityName"
                  type="text"
                  [placeholder]="
                    translationService.t(
                      'municipalities.municipality_name_placeholder'
                    )
                  "
                  [required]="true"
                  [error]="getFieldError('municipalityName')"
                  formControlName="municipalityName"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('municipalities.region')"
                  fieldId="region"
                  type="text"
                  [placeholder]="
                    translationService.t('municipalities.region_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('region')"
                  formControlName="region"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('municipalities.tax_id')"
                  fieldId="taxId"
                  type="text"
                  [placeholder]="
                    translationService.t('municipalities.tax_id_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('taxId')"
                  formControlName="taxId"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('municipalities.website_url')"
                  fieldId="websiteUrl"
                  type="text"
                  [placeholder]="
                    translationService.t(
                      'municipalities.website_url_placeholder'
                    )
                  "
                  formControlName="websiteUrl"
                >
                </app-label-input>

                <app-label-selector
                  [label]="translationService.t('municipalities.status')"
                  fieldId="status"
                  [options]="statusOptions"
                  [required]="true"
                  formControlName="status"
                >
                </app-label-selector>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-users size="1.25rem"></icon-users>
              <div>
                <h3 class="section-title">
                  {{
                    translationService.t("municipalities.contact_information")
                  }}
                </h3>
                <p class="section-description">
                  {{
                    translationService.t(
                      "municipalities.contact_information_desc"
                    )
                  }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="form-fields">
              <div class="form-grid">
                <app-label-selector
                  [label]="
                    translationService.t('municipalities.contact_person')
                  "
                  fieldId="contactPerson"
                  [options]="userOptions"
                  [required]="true"
                  [error]="getFieldError('contactPerson')"
                  formControlName="contactPerson"
                >
                </app-label-selector>

                <app-label-input
                  [label]="translationService.t('municipalities.contact_phone')"
                  fieldId="contactPhone"
                  type="text"
                  [placeholder]="
                    translationService.t(
                      'municipalities.contact_phone_placeholder'
                    )
                  "
                  [required]="true"
                  [error]="getFieldError('contactPhone')"
                  formControlName="contactPhone"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('municipalities.contact_email')"
                  fieldId="contactEmail"
                  type="email"
                  [placeholder]="
                    translationService.t(
                      'municipalities.contact_email_placeholder'
                    )
                  "
                  [required]="true"
                  [error]="getFieldError('contactEmail')"
                  formControlName="contactEmail"
                >
                </app-label-input>
              </div>
            </div>
          </app-card-content>
        </app-card>
        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-upload size="1.25rem"></icon-upload>
              <div>
                <h3 class="section-title">
                  {{ translationService.t("municipalities.branding") }}
                </h3>
                <p class="section-description">
                  {{ translationService.t("municipalities.branding_desc") }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="branding-grid">
              <div class="logo-upload">
                <div
                  class="logo-preview"
                  [class.has-logo]="logoPreview"
                  [class.loading]="isLogoLoading"
                >
                  <div *ngIf="isLogoLoading" class="loader-overlay">
                    <div class="spinner"></div>
                  </div>
                  <img
                    *ngIf="logoPreview && !isLogoLoading"
                    [src]="logoPreview"
                    alt="Logo Preview"
                  />
                  <icon-building
                    *ngIf="!logoPreview && !isLogoLoading"
                    size="2rem"
                  ></icon-building>
                </div>
                <div class="upload-controls">
                  <app-button
                    type="button"
                    variant="outline"
                    size="sm"
                    (clicked)="logoInput.click()"
                  >
                    <icon-upload size="1rem"></icon-upload>
                    {{ translationService.t("municipalities.upload_logo") }}
                  </app-button>
                  <input
                    #logoInput
                    type="file"
                    (change)="onLogoSelected($event)"
                    accept="image/*"
                    style="display: none"
                  />
                  <app-button
                    *ngIf="logoPreview"
                    type="button"
                    variant="outline"
                    size="sm"
                    customClass="text-danger"
                    (clicked)="removeLogo()"
                  >
                    <icon-trash size="1rem"></icon-trash>
                  </app-button>
                </div>
              </div>

              <div class="color-pickers-grid">
                <div class="color-field">
                  <label>{{
                    translationService.t("municipalities.primary_color")
                  }}</label>
                  <div class="color-input-wrapper">
                    <input type="color" formControlName="primaryColor" />
                    <span>{{
                      municipalityForm.get("primaryColor")?.value
                    }}</span>
                  </div>
                </div>
                <div class="color-field">
                  <label>{{
                    translationService.t("municipalities.secondary_color")
                  }}</label>
                  <div class="color-input-wrapper">
                    <input type="color" formControlName="secondaryColor" />
                    <span>{{
                      municipalityForm.get("secondaryColor")?.value
                    }}</span>
                  </div>
                </div>
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
            {{ translationService.t("municipalities.cancel") }}
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

      .municipality-form {
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

      .branding-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2rem;
        align-items: center;

        @media (max-width: 640px) {
          grid-template-columns: 1fr;
          justify-items: center;
        }
      }

      .logo-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border: 2px dashed #e5e7eb;
        border-radius: 0.75rem;
        transition: border-color 0.2s;
        width: fit-content;

        &:hover {
          border-color: var(--primary-color, #3b82f6);
        }
      }

      .logo-preview {
        width: 100px;
        height: 100px;
        border-radius: 0.75rem;
        background: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        color: #9ca3af;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        &.has-logo {
          background: white;
        }

        &.loading {
          background: #f3f4f6;
        }
      }

      .loader-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        z-index: 10;
      }

      .spinner {
        width: 24px;
        height: 24px;
        border: 2px solid #e5e7eb;
        border-top-color: var(--primary-color, #3b82f6);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .upload-controls {
        display: flex;
        gap: 0.5rem;
      }

      .color-pickers-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
        }
      }

      .color-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
      }

      .color-input-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;

        input[type="color"] {
          -webkit-appearance: none;
          border: none;
          width: 2rem;
          height: 2rem;
          cursor: pointer;
          background: none;
          padding: 0;

          &::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          &::-webkit-color-swatch {
            border: 1px solid #e5e7eb;
            border-radius: 0.25rem;
          }
        }

        span {
          font-family: monospace;
          font-size: 0.875rem;
          color: #4b5563;
        }
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
export class MunicipalityFormComponent implements OnInit {
  @Input() municipality?: Municipality;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  municipalityForm!: FormGroup;
  isSubmitting: boolean = false;
  id?: string;
  logoPreview: string | null = null;
  isLogoLoading: boolean = false;

  statusOptions: SelectOption[] = [];
  userOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
        this.municipality = this.loadMunicipalityById(this.id);
      }

      this.initializeForm();
      this.initializeOptions();
    });
  }

  private initializeForm(): void {
    this.municipalityForm = this.fb.group({
      id: [
        { value: this.municipality?.id || emptyString, disabled: this.isEdit },
        [Validators.required],
      ],
      municipalityName: [
        this.municipality?.municipalityName || emptyString,
        [Validators.required],
      ],
      region: [this.municipality?.region || emptyString, [Validators.required]],
      contactPerson: [
        this.municipality?.contactPerson || emptyString,
        [Validators.required],
      ],
      contactPhone: [
        this.municipality?.contactPhone || emptyString,
        [Validators.required],
      ],
      contactEmail: [
        this.municipality?.contactEmail || emptyString,
        [Validators.required, Validators.email],
      ],
      taxId: [this.municipality?.taxId || emptyString, [Validators.required]],
      websiteUrl: [this.municipality?.websiteUrl || emptyString],
      status: [this.municipality?.status || "active", [Validators.required]],
      logo: [this.municipality?.logo || emptyString],
      primaryColor: [this.municipality?.primaryColor || primaryColor],
      secondaryColor: [this.municipality?.secondaryColor || secondaryColor],
    });

    if (this.municipality?.logo) {
      this.logoPreview = this.municipality.logo;
    }

    this.municipalityForm
      .get("contactPerson")
      ?.valueChanges.subscribe((fullName) => {
        const user = mockMunicipalityUsersData.find(
          (u) => `${u.firstName} ${u.lastName}` === fullName
        );
        if (user) {
          this.municipalityForm.patchValue({
            contactPhone: user.phone,
            contactEmail: user.email,
          });
        }
      });
  }

  private initializeOptions(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("municipalities.active"),
        value: "active",
      },
      {
        label: this.translationService.t("municipalities.inactive"),
        value: "inactive",
      },
    ];

    this.userOptions = mockMunicipalityUsersData.map((user) => ({
      label: `${user.firstName} ${user.lastName} (${user.email})`,
      value: `${user.firstName} ${user.lastName}`,
    }));
  }

  async onLogoSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      this.isLogoLoading = true;
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          this.logoPreview = reader.result as string;
          this.municipalityForm.patchValue({ logo: this.logoPreview });

          const colors = await this.extractColorsFromImage(this.logoPreview);
          this.municipalityForm.patchValue({
            primaryColor: colors.primary,
            secondaryColor: colors.secondary,
          });
        } catch (error) {
          console.error("Error processing logo:", error);
        } finally {
          this.isLogoLoading = false;
          this.cdr.detectChanges();
        }
      };

      reader.onerror = () => {
        this.isLogoLoading = false;
      };

      reader.readAsDataURL(file);
    }
  }

  private extractColorsFromImage(
    dataUrl: string
  ): Promise<{ primary: string; secondary: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ primary: primaryColor, secondary: secondaryColor });
          return;
        }

        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        const colorCounts: { [key: string]: number } = {};

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 128) continue;

          const qr = Math.floor(r / 32) * 32;
          const qg = Math.floor(g / 32) * 32;
          const qb = Math.floor(b / 32) * 32;

          if (
            (qr > 224 && qg > 224 && qb > 224) ||
            (qr < 32 && qg < 32 && qb < 32)
          ) {
            continue;
          }

          const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb)
            .toString(16)
            .slice(1)}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sortedColors = Object.entries(colorCounts).sort(
          (a, b) => b[1] - a[1]
        );

        const primary = sortedColors[0]?.[0] || primaryColor;
        const secondary =
          sortedColors[1]?.[0] || sortedColors[0]?.[0] || secondaryColor;

        resolve({ primary, secondary });
      };
      img.onerror = () =>
        resolve({ primary: primaryColor, secondary: secondaryColor });
      img.src = dataUrl;
    });
  }

  removeLogo(): void {
    this.logoPreview = null;
    this.municipalityForm.patchValue({
      logo: emptyString,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
    });
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.municipalityForm.valid) {
      this.isSubmitting = true;

      const formValue = this.municipalityForm.getRawValue();

      const submission = {
        ...formValue,
      };

      this.formSubmit.emit(submission);

      // TODO: Implementar la lógica de guardado
      setTimeout(() => {
        this.router.navigate(["home/municipalities"]);
      }, 1000);
    } else {
      Object.keys(this.municipalityForm.controls).forEach((key) => {
        const control = this.municipalityForm.get(key);
        control?.markAsTouched();
        if (control?.invalid) {
          // TODO: Implementar la lógica de validación
        }
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.router.navigate(["home/municipalities"]);
  }

  getFieldError(fieldName: string): string {
    const control = this.municipalityForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.["required"]) {
        return "This field is required";
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
      ? this.translationService.t("municipalities.edit_municipality")
      : this.translationService.t("municipalities.create_municipality");
  }

  get formSubtitle(): string {
    return this.isEdit
      ? this.translationService.t("municipalities.edit_municipality_subtitle")
      : this.translationService.t(
          "municipalities.create_municipality_subtitle"
        );
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEdit
        ? this.translationService.t("municipalities.saving")
        : this.translationService.t("municipalities.creating");
    }
    return this.isEdit
      ? this.translationService.t("municipalities.save")
      : this.translationService.t("municipalities.save");
  }

  private loadMunicipalityById(id: string): Municipality | undefined {
    // TODO: Reemplazar con API
    return mockMunicipalitiesData.find(
      (municipality) => municipality.id === id
    );
  }
}
