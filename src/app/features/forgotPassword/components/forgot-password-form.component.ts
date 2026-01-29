import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslationService } from "@app/services/translation.service";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import {
  PackageIconComponent,
  CheckCircleIconComponent,
  ArrowLeftIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { AppVersionComponent } from "@app/shared/components/app-version/app-version.component";

@Component({
  selector: "app-forgot-password-form",
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
    ArrowLeftIconComponent,
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

        <p-card class="forgot-password-card border-2 shadow-xl">
          <ng-template pTemplate="header">
            <div class="card-header space-y-2 pb-6">
              <h2 class="text-3xl font-bold">
                {{
                  isSubmitted
                    ? translationService.t("forgot_password.title_success")
                    : translationService.t("forgot_password.title")
                }}
              </h2>
              <p class="text-base text-muted-foreground">
                {{
                  isSubmitted
                    ? translationService.t(
                        "forgot_password.description_success"
                      )
                    : translationService.t("forgot_password.description")
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
                <p class="text-sm text-muted-foreground">
                  {{ translationService.t("forgot_password.email_sent_to") }}
                </p>
                <p class="text-base font-semibold text-foreground">
                  {{ submittedEmail }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ translationService.t("forgot_password.link_expires") }}
                </p>
              </div>
              <div class="space-y-3">
                <p-button
                  type="button"
                  [label]="
                    translationService.t('forgot_password.try_another_email')
                  "
                  class="w-full h-11 text-base font-semibold outline-button"
                  [outlined]="true"
                  (onClick)="onTryAnotherEmail()"
                ></p-button>
                <p-button
                  type="button"
                  [label]="
                    translationService.t('forgot_password.back_to_login')
                  "
                  class="w-full h-11 text-base font-semibold ghost-button"
                  [text]="true"
                  (onClick)="onBackToLogin()"
                >
                  <ng-template pTemplate="icon">
                    <icon-arrow-left size="1rem"></icon-arrow-left>
                  </ng-template>
                </p-button>
              </div>
            </div>

            <form
              *ngIf="!isSubmitted"
              (ngSubmit)="onSubmit()"
              [formGroup]="forgotPasswordForm"
              class="space-y-5"
            >
              <div class="space-y-2">
                <label for="email" class="text-sm font-semibold">{{
                  translationService.t("forgot_password.email_label")
                }}</label>
                <input
                  pInputText
                  id="email"
                  type="email"
                  [placeholder]="
                    translationService.t('forgot_password.email_placeholder')
                  "
                  formControlName="email"
                  class="h-11 text-base w-full"
                />
                <p class="text-xs text-muted-foreground">
                  {{ translationService.t("forgot_password.email_hint") }}
                </p>
                <small *ngIf="getFieldError('email')" class="error-text">
                  {{ getFieldError("email") }}
                </small>
              </div>

              <div class="pt-2">
                <p-button
                  type="submit"
                  [label]="
                    isLoading
                      ? translationService.t('forgot_password.sending')
                      : translationService.t('forgot_password.send_reset_link')
                  "
                  class="w-full h-11 text-base font-semibold blue-button mt-6"
                  [loading]="isLoading"
                  [disabled]="isLoading"
                ></p-button>
              </div>

              <div class="pt-2">
                <p-button
                  type="button"
                  [label]="
                    translationService.t('forgot_password.back_to_login')
                  "
                  class="w-full h-11 text-base font-semibold ghost-button"
                  [text]="true"
                  (onClick)="onBackToLogin()"
                >
                  <ng-template pTemplate="icon">
                    <icon-arrow-left size="1rem"></icon-arrow-left>
                  </ng-template>
                </p-button>
              </div>
            </form>
          </ng-template>
        </p-card>
      </div>

      <div class="w-full max-w-md mx-auto mt-8">
        <p class="text-xs text-center text-muted-foreground mb-4">
          {{ translationService.t("forgot_password.didnt_receive") }}
          <button
            class="underline hover:text-foreground font-medium cursor-pointer"
          >
            {{ translationService.t("forgot_password.contact_support") }}
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
      .h-20 {
        height: 5rem;
      }
      .w-20 {
        width: 5rem;
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

      .forgot-password-card {
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

        .outline-button .p-button {
          background: transparent !important;
          border: 2px solid #e5e7eb !important;
          color: #374151 !important;

          &:hover {
            background: #f9fafb !important;
            border-color: #d1d5db !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          }

          &:active {
            background: #f3f4f6 !important;
          }
        }

        .ghost-button .p-button {
          background: transparent !important;
          border: none !important;
          color: #6b7280 !important;

          &:hover {
            background: #f9fafb !important;
            color: #374151 !important;
          }

          &:active {
            background: #f3f4f6 !important;
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

        .forgot-password-card {
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
export class ForgotPasswordFormComponent implements OnChanges {
  @Input() isLoading = false;
  @Output() resetSubmit = new EventEmitter<{ email: string }>();
  @Output() backToLogin = new EventEmitter<void>();

  forgotPasswordForm: FormGroup;
  isSubmitted = false;
  submittedEmail = emptyString;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public translationService: TranslationService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: [emptyString, [Validators.required, Validators.email]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isLoading"] && this.forgotPasswordForm) {
      const emailControl = this.forgotPasswordForm.get("email");
      if (this.isLoading) {
        emailControl?.disable();
      } else {
        emailControl?.enable();
      }
    }
  }

  onSubmit(): void {
    if (!this.forgotPasswordForm.valid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const email = this.forgotPasswordForm.get("email")?.value || emptyString;
    this.resetSubmit.emit({ email });

    // Set submitted state after a delay to simulate API call
    setTimeout(() => {
      this.setSubmitted(email);
    }, 1000);
  }

  onTryAnotherEmail(): void {
    this.isSubmitted = false;
    this.submittedEmail = emptyString;
    this.forgotPasswordForm.reset();
  }

  onBackToLogin(): void {
    this.backToLogin.emit();
  }

  setSubmitted(email: string): void {
    this.isSubmitted = true;
    this.submittedEmail = email;
  }

  getFieldError(fieldName: string): string {
    const control = this.forgotPasswordForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"])
        return this.translationService.t("forgot_password.field_required");
      if (control.errors["email"])
        return this.translationService.t("forgot_password.email_invalid");
    }
    return emptyString;
  }
}
