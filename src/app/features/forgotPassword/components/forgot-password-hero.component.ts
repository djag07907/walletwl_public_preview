import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  PackageIconComponent,
  MailIconComponent,
  ShieldIconComponent,
} from "@app/shared/components/icons/icons.component";
import { TranslationService } from "@app/services/translation.service";

@Component({
  selector: "app-forgot-password-hero",
  standalone: true,
  imports: [
    CommonModule,
    PackageIconComponent,
    MailIconComponent,
    ShieldIconComponent,
  ],
  template: `
    <div
      class="hero-container bg-gradient-blue p-12 flex-col justify-between relative overflow-hidden"
    >
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1-2 -translate-y-1-2"
        ></div>
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1-2 translate-y-1-2"
        ></div>
      </div>

      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-12">
          <div
            class="h-12 w-12 rounded-xl bg-white-20 backdrop-blur-sm flex items-center justify-center"
          >
            <icon-package size="1.5rem" color="white"></icon-package>
          </div>
          <span class="text-3xl font-bold text-white">WalletWL</span>
        </div>

        <div class="space-y-6">
          <div>
            <h1 class="text-5xl font-bold text-white leading-tight">
              {{ t.t("hero.forgot_password.title_line1") }}<br />
              {{ t.t("hero.forgot_password.title_line2") }}
            </h1>
            <p class="text-xl text-blue-100">
              {{ t.t("hero.forgot_password.subtitle") }}
            </p>
          </div>

          <div class="pt-8 space-y-6">
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-lg bg-white-10 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
              >
                <icon-mail size="1.5rem" color="white"></icon-mail>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">
                  {{ t.t("hero.forgot_password.feature1_title") }}
                </h3>
                <p class="text-blue-100">
                  {{ t.t("hero.forgot_password.feature1_description") }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-lg bg-white-10 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
              >
                <icon-shield size="1.5rem" color="white"></icon-shield>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">
                  {{ t.t("hero.forgot_password.feature2_title") }}
                </h3>
                <p class="text-blue-100">
                  {{ t.t("hero.forgot_password.feature2_description") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="relative z-10">
        <p class="text-sm text-blue-200">
          {{ t.t("hero.forgot_password.footer_text") }}
        </p>
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

      .hero-container {
        display: flex;
        width: 100%;
        min-height: 100vh;
      }

      @media (max-width: 1023px) {
        :host {
          display: none;
        }
      }

      .bg-gradient-blue {
        background: linear-gradient(
          135deg,
          #2563eb 0%,
          #1d4ed8 50%,
          #1e3a8a 100%
        );
      }
      .flex-col {
        flex-direction: column;
      }
      .justify-between {
        justify-content: space-between;
      }
      .relative {
        position: relative;
      }
      .overflow-hidden {
        overflow: hidden;
      }
      .absolute {
        position: absolute;
      }
      .inset-0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
      .opacity-10 {
        opacity: 0.1;
      }
      .top-0 {
        top: 0;
      }
      .left-0 {
        left: 0;
      }
      .bottom-0 {
        bottom: 0;
      }
      .right-0 {
        right: 0;
      }
      .w-96 {
        width: 24rem;
      }
      .h-96 {
        height: 24rem;
      }
      .bg-white {
        background-color: white;
      }
      .rounded-full {
        border-radius: 50%;
      }
      .blur-3xl {
        filter: blur(64px);
      }
      .-translate-x-1-2 {
        transform: translateX(-50%);
      }
      .-translate-y-1-2 {
        transform: translateY(-50%);
      }
      .translate-x-1-2 {
        transform: translateX(50%);
      }
      .translate-y-1-2 {
        transform: translateY(50%);
      }
      .z-10 {
        z-index: 10;
      }
      .items-center {
        align-items: center;
      }
      .gap-3 {
        gap: 0.75rem;
      }
      .gap-4 {
        gap: 1rem;
      }
      .mb-12 {
        margin-bottom: 3rem;
      }
      .mb-1 {
        margin-bottom: 0.25rem;
      }
      .h-12 {
        height: 3rem;
      }
      .w-12 {
        width: 3rem;
      }
      .rounded-xl {
        border-radius: 0.75rem;
      }
      .rounded-lg {
        border-radius: 0.5rem;
      }
      .bg-white-20 {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .bg-white-10 {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .flex {
        display: flex;
      }
      .items-center {
        align-items: center;
      }
      .justify-center {
        justify-content: center;
      }

      .h-12.w-12.flex.items-center.justify-center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        min-width: 3rem;
        min-height: 3rem;
      }

      .h-12.w-12.flex.items-center.justify-center i {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .backdrop-blur-sm {
        backdrop-filter: blur(4px);
      }
      .justify-center {
        justify-content: center;
      }
      .flex-shrink-0 {
        flex-shrink: 0;
      }
      .p-12 {
        padding: 3rem;
      }
      .pt-8 {
        padding-top: 2rem;
      }
      .space-y-6 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1.5rem;
      }
      .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem;
      }
      .text-5xl {
        font-size: 3rem;
        line-height: 1;
      }
      .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
      .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }
      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      .font-bold {
        font-weight: 700;
      }
      .font-semibold {
        font-weight: 600;
      }
      .text-white {
        color: white;
      }
      .text-blue-100 {
        color: #dbeafe;
      }
      .text-blue-200 {
        color: #bfdbfe;
      }
      .leading-tight {
        line-height: 1.25;
      }
    `,
  ],
})
export class ForgotPasswordHeroComponent {
  constructor(public t: TranslationService) {}
}
