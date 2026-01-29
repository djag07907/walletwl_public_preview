import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { emptyString } from "app/resources/constants";
import { HeaderBarComponent } from "app/commons/bars/app_header_bar.component";
import { CurrenciesBarComponent } from "app/commons/bars/currencies_bar.component";
import { CardModule } from "primeng/card";
import { StepsModule } from "primeng/steps";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { SelectModule } from "primeng/select";
import { FloatLabelModule } from "primeng/floatlabel";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { InputLabelComponent } from "@app/commons/inputs/input_label.component";
import { SelectLabelComponent } from "@app/commons/inputs/selector_label.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderBarComponent,
    CurrenciesBarComponent,
    SelectLabelComponent,
    InputLabelComponent,
    // Componentes de PrimeNG
    CardModule,
    StepsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    FloatLabelModule,
    ToastModule,
  ],
  providers: [MessageService],
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  currentStep = 0;
  isLoading = false;

  steps = [
    { label: "Identificación" },
    { label: "Datos Personales" },
    { label: "Seguridad" },
  ];

  countries = [
    { label: "Estados Unidos", value: "US" },
    { label: "México", value: "MX" },
    { label: "España", value: "ES" },
    { label: "Colombia", value: "CO" },
  ];

  securityQuestions = [
    { label: "¿Cuál es el nombre de tu primera mascota?", value: "pet" },
    { label: "¿En qué ciudad naciste?", value: "city" },
    { label: "¿Cuál es tu color favorito?", value: "color" },
    {
      label: "¿Cómo se llamaba tu mejor amigo de la infancia?",
      value: "friend",
    },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      country: [emptyString, Validators.required],
      accountOrCard: [
        emptyString,
        [Validators.required, Validators.minLength(8)],
      ],

      names: [emptyString, Validators.required],
      lastNames: [emptyString, Validators.required],
      identityNumber: [emptyString, Validators.required],
      email: [emptyString, [Validators.required, Validators.email]],
      telephoneNumber: [emptyString, Validators.required],
      phoneNumber: [emptyString, Validators.required],
      password: [emptyString, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [emptyString, Validators.required],
      securityQuestion: [emptyString, Validators.required],
      securityAnswer: [emptyString, Validators.required],
    });
  }
  next() {
    if (!this.isCurrentStepValid()) {
      this.messageService.add({
        severity: "warn",
        summary: "Campos requeridos",
        detail: "Por favor complete todos los campos requeridos",
      });
      return;
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previous() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submit() {
    if (!this.registerForm.valid) {
      this.messageService.add({
        severity: "error",
        summary: "Formulario inválido",
        detail: "Por favor revise todos los campos",
      });
      return;
    }

    if (
      this.registerForm.get("password")?.value !==
      this.registerForm.get("confirmPassword")?.value
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Error de confirmación",
        detail: "Las contraseñas no coinciden",
      });
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      try {
        this.messageService.add({
          severity: "success",
          summary: "Registro exitoso",
          detail: "Su cuenta ha sido creada correctamente",
        });

        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 2000);
      } catch (error) {
        this.messageService.add({
          severity: "error",
          summary: "Error de registro",
          detail: "Ocurrió un error durante el registro",
        });
      } finally {
        this.isLoading = false;
      }
    }, 1500);
  }

  isCurrentStepValid(): boolean {
    const currentStepFields = this.getCurrentStepFields();
    return currentStepFields.every((field) => {
      const control = this.registerForm.get(field);
      return control?.valid;
    });
  }

  getCurrentStepFields(): string[] {
    switch (this.currentStep) {
      case 0:
        return ["country", "accountOrCard"];
      case 1:
        return [
          "names",
          "lastNames",
          "identityNumber",
          "email",
          "telephoneNumber",
          "phoneNumber",
        ];
      case 2:
        return [
          "password",
          "confirmPassword",
          "securityQuestion",
          "securityAnswer",
        ];
      default:
        return [];
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors["required"]) return "Este campo es requerido";
      if (control.errors["email"]) return "Email inválido";
      if (control.errors["minlength"])
        return `Mínimo ${control.errors["minlength"].requiredLength} caracteres`;
    }
    return emptyString;
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }

  navigateToSupport() {
    this.router.navigate(["/support"]);
  }
}
