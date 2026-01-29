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
import { from } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { User } from "../users.mock";
import { mockMunicipalitiesData } from "@app/features/municipalities/municipalities.mock";
import { UsersService } from "../services/users.service";
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
  UsersIconComponent,
  ShieldIconComponent,
  ArrowLeftIconComponent,
  SaveIconComponent,
} from "@app/shared/components/icons/icons.component";
import { UserRole } from "@app/commons/enum/user_role";

@Component({
  selector: "app-user-form",
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
    UsersIconComponent,
    ShieldIconComponent,
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

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-users size="1.25rem"></icon-users>
              <div>
                <h3 class="section-title">
                  {{ translationService.t("users.user_information") }}
                </h3>
                <p class="section-description">
                  {{ translationService.t("users.user_information_desc") }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="form-grid">
              <app-label-input
                [label]="translationService.t('users.first_name')"
                fieldId="firstName"
                type="text"
                [placeholder]="
                  translationService.t('users.first_name_placeholder')
                "
                [required]="true"
                [error]="getFieldError('firstName')"
                formControlName="firstName"
              >
              </app-label-input>

              <app-label-input
                [label]="translationService.t('users.last_name')"
                fieldId="lastName"
                type="text"
                [placeholder]="
                  translationService.t('users.last_name_placeholder')
                "
                [required]="true"
                [error]="getFieldError('lastName')"
                formControlName="lastName"
              >
              </app-label-input>

              <app-label-input
                [label]="translationService.t('form.email')"
                fieldId="email"
                type="email"
                [placeholder]="translationService.t('users.email_placeholder')"
                [required]="true"
                [error]="getFieldError('email')"
                formControlName="email"
              >
              </app-label-input>

              <app-label-selector
                [label]="translationService.t('users.municipality')"
                fieldId="municipalityId"
                [options]="municipalityOptions"
                [placeholder]="
                  translationService.t('users.municipality_placeholder')
                "
                [required]="false"
                [error]="getFieldError('municipalityId')"
                formControlName="municipalityId"
              >
              </app-label-selector>
            </div>
          </app-card-content>
        </app-card>

        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-shield size="1.25rem"></icon-shield>
              <div>
                <h3 class="section-title">
                  {{ translationService.t("users.role_and_permissions") }}
                </h3>
                <p class="section-description">
                  {{ translationService.t("users.role_and_permissions_desc") }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="form-grid">
              <app-label-selector
                [label]="translationService.t('users.role')"
                fieldId="role"
                [options]="roleOptions"
                [required]="true"
                [error]="getFieldError('role')"
                formControlName="role"
              >
              </app-label-selector>

              <app-label-selector
                [label]="translationService.t('users.status')"
                fieldId="status"
                [options]="statusOptions"
                [required]="true"
                formControlName="status"
              >
              </app-label-selector>
            </div>
          </app-card-content>
        </app-card>

        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-shield size="1.25rem"></icon-shield>
              <div>
                <h3 class="section-title">
                  {{ translationService.t("users.account_security") }}
                </h3>
                <p class="section-description">
                  {{ translationService.t("users.account_security_desc") }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="form-grid">
              <app-label-input
                [label]="translationService.t('users.password')"
                fieldId="password"
                type="password"
                [placeholder]="
                  translationService.t('users.password_placeholder')
                "
                [required]="!isEdit"
                [error]="getFieldError('password')"
                formControlName="password"
              >
              </app-label-input>

              <app-label-input
                [label]="translationService.t('users.confirm_password')"
                fieldId="confirmPassword"
                type="password"
                [placeholder]="
                  translationService.t('users.confirm_password_placeholder')
                "
                [required]="!isEdit"
                [error]="getFieldError('confirmPassword')"
                formControlName="confirmPassword"
              >
              </app-label-input>
            </div>
            <p class="password-hint" *ngIf="isEdit">
              {{ translationService.t("users.password_hint") }}
            </p>
          </app-card-content>
        </app-card>

        <div class="form-actions">
          <app-button
            type="button"
            variant="outline"
            (clicked)="onCancel()"
            [disabled]="isSubmitting"
          >
            {{ translationService.t("users.cancel") }}
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
        max-width: 64rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @media (max-width: 768px) {
          padding: 1rem;
          gap: 1rem;
        }
      }

      .form-header {
        display: flex;
        align-items: center;
        gap: 1rem;

        .back-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          background: #f9fafb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-color, #1a1a1a);

          &:hover {
            background: #e5e7eb;
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

          @media (max-width: 768px) {
            font-size: 1.5rem;
          }
        }

        .form-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
        }
      }

      .user-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @media (max-width: 768px) {
          gap: 1rem;
        }
      }

      .section-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        color: var(--primary-color, #3b82f6);

        > *:first-child {
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        > div {
          flex: 1;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-color, #1a1a1a);
          margin: 0;
          line-height: 1.25;
        }

        .section-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
          line-height: 1.4;
        }
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
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

      ::ng-deep .submit-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .password-hint {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        font-style: italic;
      }

      * {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
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
export class UserFormComponent implements OnInit {
  @Input() user?: User;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  userForm!: FormGroup;
  isSubmitting: boolean = false;
  userId?: string;

  statusOptions: SelectOption[] = [];
  roleOptions: SelectOption[] = [];
  municipalityOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeOptions();
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeOptions();

    this.route.paramMap.subscribe((params) => {
      this.userId = params.get("id") || undefined;
      this.isEdit = !!this.userId;

      if (this.isEdit && this.userId) {
        this.usersService.getUserById(this.userId).subscribe((user) => {
          if (user) {
            this.user = user;
            this.updateFormWithUserData(user);
          }
        });
      } else {
        this.userForm.reset({
          firstName: emptyString,
          lastName: emptyString,
          email: emptyString,
          role: UserRole.USER,
          municipalityId: emptyString,
          status: "active",
          password: emptyString,
          confirmPassword: emptyString,
        });
      }

      this.updatePasswordValidators();
    });
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: [emptyString, [Validators.required]],
      lastName: [emptyString, [Validators.required]],
      email: [emptyString, [Validators.required, Validators.email]],
      role: [UserRole.USER, [Validators.required]],
      municipalityId: [emptyString, []],
      status: ["active", [Validators.required]],
      password: [emptyString, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [emptyString],
    });
  }

  private updateFormWithUserData(user: User): void {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      municipalityId: user.municipalityId || emptyString,
      status: user.status,
    });

    this.userForm.get("password")?.setValue(emptyString);
    this.userForm.get("confirmPassword")?.setValue(emptyString);

    this.updatePasswordValidators();
  }

  private updatePasswordValidators(): void {
    const passwordControl = this.userForm.get("password");
    const confirmControl = this.userForm.get("confirmPassword");

    if (this.isEdit) {
      passwordControl?.clearValidators();
      passwordControl?.addValidators([Validators.minLength(8)]);
      confirmControl?.clearValidators();
    } else {
      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    }

    passwordControl?.updateValueAndValidity();
    confirmControl?.updateValueAndValidity();
  }

  private initializeOptions(): void {
    this.statusOptions = [
      { label: this.translationService.t("users.active"), value: "active" },
      { label: this.translationService.t("users.inactive"), value: "inactive" },
    ];

    this.roleOptions = [
      { label: "Super Admin", value: UserRole.SUPER_ADMIN },
      { label: "Municipality Admin", value: UserRole.MUNICIPALITY_ADMIN },
      { label: "Manager", value: UserRole.MANAGER },
      { label: "Regular User", value: UserRole.USER },
    ];

    this.municipalityOptions = mockMunicipalitiesData.map((m) => ({
      label: m.municipalityName,
      value: m.id,
    }));
  }

  onSubmit(): void {
    const password = this.userForm.get("password")?.value;
    const confirmPassword = this.userForm.get("confirmPassword")?.value;

    if (password && password !== confirmPassword) {
      this.userForm.get("confirmPassword")?.setErrors({ mismatch: true });
      return;
    }

    if (this.userForm.valid) {
      this.isSubmitting = true;

      const userData = this.userForm.value;

      const operation =
        this.isEdit && this.userId
          ? this.usersService.updateUser(this.userId, userData)
          : from(this.usersService.createUser(userData));

      operation.subscribe({
        next: () => {
          this.formSubmit.emit(userData);
          this.router.navigate(["home/users"]);
        },
        error: (err: any) => {
          console.error("Error saving user:", err);
          this.isSubmitting = false;
        },
      });
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.router.navigate(["home/users"]);
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.["required"]) {
        return this.translationService.t("form.required");
      }
      if (control.errors?.["email"]) {
        return this.translationService.t("form.email_invalid");
      }
      if (control.errors?.["minlength"]) {
        return this.translationService.t("users.password_min_length");
      }
      if (control.errors?.["mismatch"]) {
        return this.translationService.t("users.passwords_no_match");
      }
    }
    return emptyString;
  }

  get formTitle(): string {
    return this.isEdit
      ? this.translationService.t("users.edit_user")
      : this.translationService.t("users.create_user");
  }

  get formSubtitle(): string {
    return this.isEdit
      ? this.translationService.t("users.edit_subtitle")
      : this.translationService.t("users.create_subtitle");
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEdit
        ? this.translationService.t("users.saving")
        : this.translationService.t("users.creating");
    }
    return this.isEdit
      ? this.translationService.t("users.save")
      : this.translationService.t("users.save");
  }
}
