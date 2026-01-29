import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslationService } from "@app/services/translation.service";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import {
  PackageIconComponent,
  CheckCircleIconComponent,
  EyeIconComponent,
  EyeOffIconComponent,
  AlertCircleIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { AppVersionComponent } from "@app/shared/components/app-version/app-version.component";

@Component({
  selector: "app-create-password-form",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PackageIconComponent,
    CheckCircleIconComponent,
    EyeIconComponent,
    EyeOffIconComponent,
    AlertCircleIconComponent,
    AppVersionComponent,
  ],
  template: `
    <div
      class="flex-1 flex flex-col justify-between p-8 bg-background min-h-screen"
    >
      <div
        class="w-full max-w-md mx-auto flex-grow flex flex-col justify-center"
      >
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div
            class="h-12 w-12 rounded-xl bg-primary flex items-center justify-center"
          >
            <icon-package size="1.5rem" color="white"></icon-package>
          </div>
          <span class="text-2xl font-bold text-foreground">WalletWL</span>
        </div>

        <p-card
          *ngIf="!tokenValid"
          class="create-password-card border-2 shadow-xl"
        >
          <ng-template pTemplate="header">
            <div class="card-header space-y-2 pb-6">
              <div class="flex justify-center mb-4">
                <div
                  class="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center"
                >
                  <icon-alert-circle
                    size="2rem"
                    color="#dc2626"
                  ></icon-alert-circle>
                </div>
              </div>
              <h2 class="text-3xl font-bold text-center">
                Invalid or Expired Link
              </h2>
              <p class="text-base text-muted-foreground text-center">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>
          </ng-template>

          <ng-template pTemplate="content">
            <p-button
              type="button"
              label="Request New Link"
              class="w-full h-11 text-base font-semibold blue-button"
              (onClick)="onRequestNewLink()"
            ></p-button>
          </ng-template>
        </p-card>

        <p-card
          *ngIf="tokenValid"
          class="create-password-card border-2 shadow-xl"
        >
          <ng-template pTemplate="header">
            <div class="card-header space-y-2 pb-6">
              <h2 class="text-3xl font-bold">
                {{ isSubmitted ? "Password Created!" : "Create New Password" }}
              </h2>
              <p class="text-base text-muted-foreground">
                {{
                  isSubmitted
                    ? "Your password has been successfully created"
                    : "Choose a strong password to secure your account"
                }}
              </p>
            </div>
          </ng-template>

          <ng-template pTemplate="content">
            <div *ngIf="isSubmitted" class="space-y-6">
              <div class="flex justify-center">
                <div
                  class="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <icon-check-circle
                    size="2.5rem"
                    color="#16a34a"
                  ></icon-check-circle>
                </div>
              </div>
              <div class="text-center space-y-3 bg-muted p-6 rounded-lg">
                <h3 class="text-lg font-semibold">Success!</h3>
                <p class="text-sm text-muted-foreground">
                  Your password has been created successfully. Redirecting you
                  to login...
                </p>
              </div>
            </div>

            <form
              *ngIf="!isSubmitted"
              (ngSubmit)="onSubmit()"
              [formGroup]="createPasswordForm"
              class="space-y-5"
            >
              <div class="space-y-2">
                <label for="password" class="text-sm font-semibold"
                  >New Password</label
                >
                <div class="relative">
                  <input
                    pInputText
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    formControlName="password"
                    class="h-11 text-base w-full pr-10"
                  />
                  <button
                    type="button"
                    (click)="showPassword = !showPassword"
                    class="absolute right-3 top-1-2 password-toggle"
                    tabindex="-1"
                  >
                    <icon-eye-off
                      *ngIf="showPassword"
                      size="1.25rem"
                      color="#6b7280"
                    ></icon-eye-off>
                    <icon-eye
                      *ngIf="!showPassword"
                      size="1.25rem"
                      color="#6b7280"
                    ></icon-eye>
                  </button>
                </div>
                <div
                  *ngIf="
                    createPasswordForm.get('password')?.value &&
                    createPasswordForm.get('password')?.value.length > 0
                  "
                  class="space-y-2"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="flex-1 h-2 bg-muted rounded-full overflow-hidden"
                    >
                      <div
                        class="password-strength-bar h-full transition-all duration-300"
                        [style.width.%]="passwordStrength.strength"
                        [ngStyle]="{
                          'background-color': passwordStrength.color
                        }"
                      ></div>
                    </div>
                    <span class="text-xs font-medium text-muted-foreground">{{
                      passwordStrength.label
                    }}</span>
                  </div>
                </div>
                <p class="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
                <small *ngIf="getFieldError('password')" class="error-text">
                  {{ getFieldError("password") }}
                </small>
              </div>

              <div class="space-y-2">
                <label for="confirmPassword" class="text-sm font-semibold"
                  >Confirm Password</label
                >
                <div class="relative">
                  <input
                    pInputText
                    id="confirmPassword"
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    formControlName="confirmPassword"
                    class="h-11 text-base w-full pr-10"
                  />
                  <button
                    type="button"
                    (click)="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1-2 password-toggle"
                    tabindex="-1"
                  >
                    <icon-eye-off
                      *ngIf="showConfirmPassword"
                      size="1.25rem"
                      color="#6b7280"
                    ></icon-eye-off>
                    <icon-eye
                      *ngIf="!showConfirmPassword"
                      size="1.25rem"
                      color="#6b7280"
                    ></icon-eye>
                  </button>
                </div>
                <p
                  *ngIf="
                    createPasswordForm.get('confirmPassword')?.value &&
                    createPasswordForm.get('password')?.value !==
                      createPasswordForm.get('confirmPassword')?.value
                  "
                  class="text-xs text-red-500"
                >
                  Passwords do not match
                </p>
                <small
                  *ngIf="getFieldError('confirmPassword')"
                  class="error-text"
                >
                  {{ getFieldError("confirmPassword") }}
                </small>
              </div>

              <div class="pt-4">
                <p-button
                  type="submit"
                  [label]="
                    isLoading ? 'Creating Password...' : 'Create Password'
                  "
                  class="w-full h-11 text-base font-semibold blue-button"
                  [loading]="isLoading"
                  [disabled]="
                    isLoading ||
                    createPasswordForm.get('password')?.value !==
                      createPasswordForm.get('confirmPassword')?.value
                  "
                ></p-button>
              </div>
            </form>
          </ng-template>
        </p-card>
      </div>

      <div class="w-full max-w-md mx-auto mt-8">
        <p class="text-xs text-center text-muted-foreground mb-4">
          Remember your password?
          <button
            (click)="onBackToLogin()"
            class="underline hover:text-foreground font-medium cursor-pointer"
          >
            Back to Login
          </button>
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
      .lg\\:hidden {
        @media (min-width: 1024px) {
          display: none;
        }
      }
      .gap-3 {
        gap: 0.75rem;
      }
      .gap-2 {
        gap: 0.5rem;
      }
      .mb-8 {
        margin-bottom: 2rem;
      }
      .mb-6 {
        margin-bottom: 1.5rem;
      }
      .mb-4 {
        margin-bottom: 1rem;
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
      .h-16 {
        height: 4rem;
      }
      .w-16 {
        width: 4rem;
      }
      .h-20 {
        height: 5rem;
      }
      .w-20 {
        width: 5rem;
      }
      .h-2 {
        height: 0.5rem;
      }
      .flex-1 {
        flex: 1;
      }
      .rounded-xl {
        border-radius: 0.75rem;
      }
      .rounded-lg {
        border-radius: 0.5rem;
      }
      .rounded-full {
        border-radius: 50%;
      }
      .bg-primary {
        background-color: #2563eb;
      }
      .bg-green-100 {
        background-color: #dcfce7;
      }
      .bg-red-100 {
        background-color: #fee2e2;
      }
      .bg-muted {
        background-color: #f1f5f9;
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
      .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
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
      .font-medium {
        font-weight: 500;
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
      .text-red-500 {
        color: #ef4444;
      }
      .border-2 {
        border-width: 2px;
      }
      .shadow-xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      .space-y-5 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.25rem;
      }
      .space-y-6 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.5rem;
      }
      .space-y-3 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.75rem;
      }
      .space-y-2 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.5rem;
      }
      .relative {
        position: relative;
      }
      .absolute {
        position: absolute;
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
      .p-6 {
        padding: 1.5rem;
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
      .hover\\:text-foreground:hover {
        color: var(--text-color);
      }
      .overflow-hidden {
        overflow: hidden;
      }

      .password-toggle {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        transition: color 0.2s;

        &:hover {
          color: var(--text-color);
        }
      }

      .top-1-2 {
        top: 50%;
        transform: translateY(-50%);
      }

      .create-password-card {
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

      .error-text {
        color: #dc2626;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.25rem;
        display: block;
      }

      .transition-all {
        transition: all 0.3s ease;
      }

      .duration-300 {
        transition-duration: 300ms;
      }

      .password-strength-bar {
        height: 100%;
        transition: all 0.3s ease;
        border-radius: 9999px;
      }

      ::ng-deep .bg-red-500 {
        background-color: #ef4444 !important;
      }

      ::ng-deep .bg-orange-500 {
        background-color: #f97316 !important;
      }

      ::ng-deep .bg-yellow-500 {
        background-color: #eab308 !important;
      }

      ::ng-deep .bg-green-500 {
        background-color: #22c55e !important;
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
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          }

          &:active {
            background: #1e40af !important;
          }

          &:disabled {
            background: #9ca3af !important;
            cursor: not-allowed;
            box-shadow: none;
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

        .create-password-card {
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
export class CreatePasswordFormComponent implements OnInit {
  private _isLoading = false;

  @Input()
  set isLoading(value: boolean) {
    this._isLoading = value;
    this.updateFormLoadingState();
  }
  get isLoading(): boolean {
    return this._isLoading;
  }

  @Output() passwordSubmit = new EventEmitter<{ password: string }>();
  @Output() backToLogin = new EventEmitter<void>();

  createPasswordForm: FormGroup;
  isSubmitted = false;
  showPassword = false;
  showConfirmPassword = false;
  tokenValid = true;
  token = emptyString;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public translationService: TranslationService
  ) {
    this.createPasswordForm = this.fb.group(
      {
        password: [emptyString, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [
          emptyString,
          [Validators.required, Validators.minLength(8)],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private updateFormLoadingState(): void {
    if (this.isLoading) {
      this.createPasswordForm.disable();
    } else {
      this.createPasswordForm.enable();
    }
  }

  ngOnInit(): void {
    // Get token from URL query params
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"] || emptyString;
      // Validate token (in real app, this would be an API call)
      if (!this.token) {
        this.tokenValid = false;
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  get passwordStrength(): {
    strength: number;
    label: string;
    color: string;
  } {
    const pwd = this.createPasswordForm.get("password")?.value || emptyString;
    if (pwd.length === 0)
      return { strength: 0, label: emptyString, color: emptyString };
    if (pwd.length < 8)
      return {
        strength: 25,
        label: this.translationService.t("create_password.strength_weak"),
        color: "#ef4444",
      };
    if (pwd.length < 12)
      return {
        strength: 50,
        label: this.translationService.t("create_password.strength_fair"),
        color: "#f97316",
      };
    if (pwd.length < 16)
      return {
        strength: 75,
        label: this.translationService.t("create_password.strength_good"),
        color: "#eab308",
      };
    return {
      strength: 100,
      label: this.translationService.t("create_password.strength_strong"),
      color: "#22c55e",
    };
  }

  getPasswordStrengthColor(): string {
    return this.passwordStrength.color;
  }

  onSubmit(): void {
    if (!this.createPasswordForm.valid) {
      this.createPasswordForm.markAllAsTouched();
      return;
    }

    const password =
      this.createPasswordForm.get("password")?.value || emptyString;
    this.passwordSubmit.emit({ password });
  }

  onBackToLogin(): void {
    this.backToLogin.emit();
  }

  onRequestNewLink(): void {
    this.router.navigate(["/forgotPassword"]);
  }

  setSubmitted(): void {
    this.isSubmitted = true;
  }

  getFieldError(fieldName: string): string {
    const control = this.createPasswordForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"])
        return this.translationService.t("create_password.field_required");
      if (control.errors["minLength"])
        return this.translationService.t("create_password.password_min_length");
      if (control.errors["passwordMismatch"])
        return this.translationService.t("create_password.password_mismatch");
    }
    return emptyString;
  }
}
