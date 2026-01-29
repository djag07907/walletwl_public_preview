import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { ForgotPasswordHeroComponent } from "./components/forgot-password-hero.component";
import { ForgotPasswordFormComponent } from "./components/forgot-password-form.component";
import { LanguageSwitcherComponent } from "@app/commons/language-switcher.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ForgotPasswordHeroComponent,
    ForgotPasswordFormComponent,
    LanguageSwitcherComponent,
  ],
  providers: [MessageService],
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {
  isLoading = false;

  constructor(private router: Router, private messageService: MessageService) {}

  async onResetSubmit(formData: { email: string }): Promise<void> {
    this.isLoading = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(
        "Password reset link sent to:",
        formData.email,
        "- Link: /create-password?token=sample-token-123"
      );

      const formComponent = document.querySelector(
        "app-forgot-password-form"
      ) as any;
      if (formComponent && formComponent.setSubmitted) {
        formComponent.setSubmitted(formData.email);
      }

      this.messageService.add({
        severity: "success",
        summary: "Reset Link Sent",
        detail: "Please check your email for the password reset link.",
        life: 3000,
      });

      this.isLoading = false;
    } catch (error) {
      console.error("Error sending reset email:", error);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to send reset link. Please try again.",
        life: 3000,
      });
      this.isLoading = false;
    }
  }

  onBackToLogin(): void {
    this.router.navigate(["/login"]);
  }
}
