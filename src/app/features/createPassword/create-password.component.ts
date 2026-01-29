import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { CreatePasswordHeroComponent } from "./components/create-password-hero.component";
import { CreatePasswordFormComponent } from "./components/create-password-form.component";
import { LanguageSwitcherComponent } from "@app/commons/language-switcher.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CreatePasswordHeroComponent,
    CreatePasswordFormComponent,
    LanguageSwitcherComponent,
  ],
  providers: [MessageService],
  selector: "app-create-password",
  templateUrl: "./create-password.component.html",
  styleUrls: ["./create-password.component.scss"],
})
export class CreatePasswordComponent {
  isLoading = false;

  constructor(private router: Router, private messageService: MessageService) {}

  async onPasswordSubmit(formData: { password: string }): Promise<void> {
    this.isLoading = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("New password created:", formData.password);

      const formComponent = document.querySelector(
        "app-create-password-form"
      ) as any;
      if (formComponent && formComponent.setSubmitted) {
        formComponent.setSubmitted();
      }

      this.messageService.add({
        severity: "success",
        summary: "Password Created",
        detail: "Your password has been successfully created.",
        life: 3000,
      });

      this.isLoading = false;

      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 2000);
    } catch (error) {
      console.error("Error creating password:", error);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to create password. Please try again.",
        life: 3000,
      });
      this.isLoading = false;
    }
  }

  onBackToLogin(): void {
    this.router.navigate(["/login"]);
  }
}
