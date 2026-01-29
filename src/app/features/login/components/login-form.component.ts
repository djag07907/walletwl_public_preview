import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslationService } from "@app/services/translation.service";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import {
  EyeIconComponent,
  EyeOffIconComponent,
  AlertCircleIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
// import { DemoCredentialsComponent } from "./demo-credentials.component";
import { AppVersionComponent } from "@app/shared/components/app-version/app-version.component";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasNumber = /[0-9]/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(value);
  const isValidLength = value.length >= 8;

  const passwordValid =
    hasNumber && hasLetter && hasSpecialChar && isValidLength;

  if (!passwordValid) {
    return {
      passwordStrength: { hasNumber, hasLetter, hasSpecialChar, isValidLength },
    };
  }
  return null;
}

@Component({
  selector: "app-login-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    EyeIconComponent,
    EyeOffIconComponent,
    AlertCircleIconComponent,
    // DemoCredentialsComponent,
    AppVersionComponent,
  ],
  template: `
    <div
      class="flex-1 flex flex-col justify-between p-8 bg-background min-h-screen"
    >
      <div
        class="w-full max-w-md mx-auto flex-grow flex flex-col justify-center"
      >
        <p-card class="login-card border-2 shadow-xl">
          <ng-template pTemplate="header">
            <div class="card-header space-y-2 pb-6">
              <h2 class="text-3xl font-bold">{{ t.t("login.welcome") }}</h2>
            </div>
          </ng-template>

          <ng-template pTemplate="content">
            <form
              (ngSubmit)="onSubmit()"
              [formGroup]="loginForm"
              class="space-y-5"
            >
              <div *ngIf="error" class="alert alert-destructive">
                <icon-alert-circle size="1rem"></icon-alert-circle>
                <span class="alert-description">{{
                  getTranslatedError()
                }}</span>
              </div>

              <div class="space-y-2">
                <label for="email" class="text-sm font-semibold">{{
                  t.t("login.email")
                }}</label>
                <input
                  pInputText
                  id="email"
                  type="email"
                  [placeholder]="t.t('login.email_placeholder')"
                  formControlName="userEmail"
                  class="h-11 text-base w-full"
                />
                <small *ngIf="getFieldError('userEmail')" class="error-text">
                  {{ getFieldError("userEmail") }}
                </small>
              </div>

              <div class="space-y-2">
                <label for="password" class="text-sm font-semibold">{{
                  t.t("login.password")
                }}</label>
                <div class="relative">
                  <input
                    pInputText
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    [placeholder]="t.t('login.password_placeholder')"
                    formControlName="password"
                    class="h-11 text-base pr-10 w-full"
                  />
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="password-toggle"
                    tabindex="-1"
                  >
                    <icon-eye-off
                      *ngIf="showPassword"
                      size="1.25rem"
                    ></icon-eye-off>
                    <icon-eye *ngIf="!showPassword" size="1.25rem"></icon-eye>
                  </button>
                </div>
                <small *ngIf="getFieldError('password')" class="error-text">
                  {{ getFieldError("password") }}
                </small>
              </div>

              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-2">
                  <p-checkbox
                    id="remember"
                    formControlName="rememberUser"
                    [binary]="true"
                  ></p-checkbox>
                  <label
                    for="remember"
                    class="text-sm font-normal cursor-pointer"
                    >{{ t.t("login.remember") }}</label
                  >
                </div>
                <a
                  (click)="onForgotPassword()"
                  class="text-sm font-semibold text-primary hover:text-primary-80 cursor-pointer"
                >
                  {{ t.t("login.forgot") }}
                </a>
              </div>

              <p-button
                type="submit"
                [label]="
                  isLoading ? t.t('login.signing_in') : t.t('login.sign_in')
                "
                class="w-full h-11 text-base font-semibold blue-button mt-4"
                [loading]="isLoading"
                [disabled]="isLoading"
              ></p-button>
            </form>

            <!-- <app-demo-credentials></app-demo-credentials> -->
          </ng-template>
        </p-card>
      </div>

      <div class="w-full max-w-md mx-auto mt-8">
        <p class="text-xs text-center text-muted-foreground mb-4">
          {{ t.t("login.terms_agreement") }}
          <a class="underline hover:text-foreground cursor-pointer">{{
            t.t("login.terms_of_service")
          }}</a>
          {{ t.t("login.and") }}
          <a class="underline hover:text-foreground cursor-pointer ml-1">{{
            t.t("login.privacy_policy")
          }}</a>
        </p>
        <app-version></app-version>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        flex: 1;
        min-width: 0;
      }

      .flex-1 {
        flex: 1 1 0%;
      }
      .flex {
        display: flex;
      }
      .flex-col {
        flex-direction: column;
      }
      .flex-grow {
        flex-grow: 1;
      }
      .items-center {
        align-items: center;
      }
      .justify-center {
        justify-content: center;
      }
      .justify-between {
        justify-content: space-between;
      }
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
      .min-h-screen {
        min-height: 100vh;
      }
      .p-8 {
        padding: 2rem;
      }
      .bg-background {
        background-color: #fafafa;
      }
      .w-full {
        width: 100%;
      }
      .max-w-md {
        max-width: 28rem;
      }
      .lg\:hidden {
        @media (min-width: 1024px) {
          display: none;
        }
      }
      .gap-3 {
        gap: 0.75rem;
      }
      .mb-8 {
        margin-bottom: 2rem;
      }
      .mb-6 {
        margin-bottom: 1.5rem;
      }
      .ml-1 {
        margin-left: 0.25rem;
      }
      .mt-8 {
        margin-top: 2rem;
      }
      .mb-4 {
        margin-bottom: 1rem;
      }
      .mt-6 {
        margin-top: 1.5rem;
      }
      .h-12 {
        height: 3rem;
      }
      .w-12 {
        width: 3rem;
      }
      .h-11 {
        height: 2.75rem;
      }
      .rounded-xl {
        border-radius: 0.75rem;
      }
      .bg-primary {
        background-color: #2563eb;
      }
      .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
      }
      .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
      }
      .text-base {
        font-size: 1rem;
        line-height: 1.5rem;
      }
      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
      }
      .font-bold {
        font-weight: 700;
      }
      .font-semibold {
        font-weight: 600;
      }
      .font-normal {
        font-weight: 400;
      }
      .text-foreground {
        color: var(--text-color);
      }
      .text-muted-foreground {
        color: #6b7280;
      }
      .text-primary {
        color: #2563eb;
      }
      .border-2 {
        border-width: 2px;
      }
      .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      .space-y-5 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.25rem;
      }
      .space-y-2 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.5rem;
      }
      .space-x-2 > :not([hidden]) ~ :not([hidden]) {
        margin-left: 0.5rem;
      }
      .relative {
        position: relative;
      }
      .pr-10 {
        padding-right: 2.5rem;
      }
      .pt-4 {
        padding-top: 1rem;
      }
      .pt-2 {
        padding-top: 0.5rem;
      }
      .pb-6 {
        padding-bottom: 1.5rem;
      }
      .cursor-pointer {
        cursor: pointer;
      }
      .text-center {
        text-align: center;
      }
      .underline {
        text-decoration: underline;
      }
      .hover\:text-foreground:hover {
        color: var(--text-color);
      }
      .hover\:text-primary-80:hover {
        color: rgba(37, 99, 235, 0.8);
      }

      .login-card {
        width: 100%;
        border: 2px solid #e5e7eb;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border-radius: 0.75rem;
      }

      .card-header {
        padding: 1.5rem 1.5rem 0 1.5rem;
      }

      .card-header h2 {
        font-size: 1.875rem;
        line-height: 2.25rem;
        font-weight: 700;
        margin: 0;
      }

      .card-header p {
        font-size: 1rem;
        line-height: 1.5rem;
        color: #6b7280;
        margin: 0;
      }

      .alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 0.375rem;

        &.alert-destructive {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;

          .alert-description {
            font-size: 0.875rem;
          }
        }
      }

      .password-toggle {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: #374151;
        }
      }

      .error-text {
        color: #dc2626;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.25rem;
        display: block;
      }

      ::ng-deep {
        .p-inputtext {
          width: 100%;
          height: 2.75rem;
          font-size: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);

          &:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            background: white;
          }

          &:hover {
            border-color: #d1d5db;
          }
        }

        .p-checkbox {
          .p-checkbox-box {
            border: 2px solid #d1d5db;
            border-radius: 0.25rem;
            width: 1.125rem;
            height: 1.125rem;
            transition: all 0.2s ease;

            &:hover {
              border-color: #2563eb;
            }

            &.p-highlight {
              background: #2563eb;
              border-color: #2563eb;
            }
          }

          .p-checkbox-icon {
            color: white;
            font-size: 0.75rem;
          }
        }

        .p-button {
          background: #2563eb;
          border: none;
          color: white;
          padding: 0;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.2s ease;
          min-height: 2.75rem;
          width: 100%;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: #1d4ed8;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          }

          &:active {
            background: #1e40af;
          }

          &:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            box-shadow: none;
          }
        }

        .blue-button .p-button {
          background: #2563eb !important;
          border: none !important;
          color: white !important;

          &:hover {
            background: #1d4ed8 !important;
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          }

          &:active {
            transform: translateY(0);
          }

          &:disabled {
            background: #9ca3af !important;
            cursor: not-allowed;
            transform: none;
          }
        }

        .p-card {
          background: white;
          border-radius: 0.5rem;

          .p-card-content {
            padding: 0 1.5rem 1.5rem 1.5rem;
          }

          .p-card-header {
            padding: 1.5rem 1.5rem 0 1.5rem;
            border-bottom: none;
          }
        }
      }

      @media (max-width: 768px) {
        .p-8 {
          padding: 1rem;
        }

        .max-w-md {
          max-width: 100%;
        }

        .login-card {
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          padding: 1rem 1rem 0 1rem;
        }

        .card-header h2 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
      }
    `,
  ],
})
export class LoginFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() isLoading$?: Observable<boolean>;
  @Input() error$?: Observable<string | null>;

  isLoading = false;
  error = emptyString;
  private destroy$ = new Subject<void>();
  @Output() loginSubmit = new EventEmitter<{
    userEmail: string;
    password: string;
    rememberUser: boolean;
  }>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() contactSales = new EventEmitter<void>();

  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public t: TranslationService
  ) {
    this.loginForm = this.fb.group({
      userEmail: [emptyString, [Validators.required, Validators.email]],
      password: [emptyString, [Validators.required, passwordValidator]],
      rememberUser: [false],
    });

    const rememberedUser = localStorage.getItem("remembered_user");
    if (rememberedUser) {
      this.loginForm.patchValue({
        userEmail: rememberedUser,
        rememberUser: true,
      });
    }
  }

  ngOnInit(): void {
    if (this.isLoading$) {
      this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
        this.isLoading = loading;
        if (loading) {
          this.loginForm.disable();
        } else {
          this.loginForm.enable();
        }
      });
    }

    if (this.error$) {
      this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
        this.error = error || emptyString;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    if (this.isLoading) {
      this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isLoading) return;

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isLoading) {
      this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }

    this.loginSubmit.emit(this.loginForm.value);
  }

  onForgotPassword(): void {
    this.forgotPassword.emit();
  }

  onContactSales(): void {
    this.contactSales.emit();
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) return this.t.t("login.field_required");
      if (control.errors["email"]) return this.t.t("login.email_invalid");
      if (control.errors["passwordStrength"]) {
        const errors = control.errors["passwordStrength"];
        const requirements = [];
        if (!errors.isValidLength)
          requirements.push(this.t.t("login.min_8_chars"));
        if (!errors.hasLetter) requirements.push(this.t.t("login.letters"));
        if (!errors.hasNumber) requirements.push(this.t.t("login.numbers"));
        if (!errors.hasSpecialChar)
          requirements.push(this.t.t("login.special_chars"));
        return this.t
          .t("login.password_requirements")
          .replace("{{requirements}}", requirements.join(", "));
      }
    }
    return emptyString;
  }

  getTranslatedError(): string {
    if (!this.error) return emptyString;

    if (this.error.startsWith("login.error_")) {
      return this.t.t(this.error);
    }

    return this.error;
  }
}
