import { Component, OnInit, OnDestroy, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import { TranslationService } from "@app/services/translation.service";
import { SessionService } from "@app/core/services/session.service";
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { InputComponent } from "@commons/forms/input.component";
import { BadgeComponent } from "@commons/ui/badge.component";
import { TabsComponent, Tab } from "@commons/ui/tabs.component";
import {
  MailIconComponent,
  BuildingIconComponent,
  ShieldIconComponent,
  CalendarIconComponent,
  EyeIconComponent,
  EyeOffIconComponent,
  SaveIconComponent,
  UploadIconComponent,
  CheckCircleIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    TabsComponent,
    MailIconComponent,
    BuildingIconComponent,
    ShieldIconComponent,
    CalendarIconComponent,
    EyeIconComponent,
    EyeOffIconComponent,
    SaveIconComponent,
    UploadIconComponent,
    CheckCircleIconComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // TODO: Datos de prueba
  user = {
    id: "1",
    firstName: emptyString,
    lastName: emptyString,
    email: emptyString,
    role: emptyString,
    status: "active",
    avatar: emptyString,
    memberSince: new Date("2024-01-15"),
  };

  company = {
    name: "TechCorp Solutions",
    currency: "Q",
    timezone: "GMT",
  };

  isEditing = false;
  isSaving = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  successMessage = emptyString;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  activeTab = "personal";
  tabs: Tab[] = [];

  constructor(
    public translationService: TranslationService,
    private fb: FormBuilder,
    private sessionService: SessionService,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.initializeForms();
    this.initializeTabs();
  }

  private loadUserData(): void {
    const fullName = this.sessionService.getUserFullName() || emptyString;
    const email = this.sessionService.getUserEmail() || emptyString;
    const role = this.sessionService.getRole() || emptyString;

    const nameParts = fullName.trim().split(" ");
    if (nameParts.length > 0) {
      this.user.firstName = nameParts[0];
      this.user.lastName = nameParts.slice(1).join(" ");
    }

    this.user.email = email;
    this.user.role = role;

    // Use company name from session if available in the future,
    // for now keeping the mock company as per initial requirement
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [emptyString],
    });

    this.passwordForm = this.fb.group({
      currentPassword: [emptyString, Validators.required],
      newPassword: [
        emptyString,
        [Validators.required, Validators.minLength(8)],
      ],
      confirmPassword: [emptyString, Validators.required],
    });
  }

  private initializeTabs(): void {
    this.tabs = [
      {
        id: "personal",
        label: this.translationService.t("profile.personal_info"),
      },
      {
        id: "security",
        label: this.translationService.t("profile.security"),
      },
    ];
  }

  getUserInitials(): string {
    return `${this.user.firstName[0]}${this.user.lastName[0]}`;
  }

  getMemberSince(): string {
    return this.user.memberSince.toLocaleDateString(
      this.translationService.getCurrentLocale(),
      {
        month: "long",
        year: "numeric",
      },
    );
  }

  onEditProfile(): void {
    this.isEditing = true;
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.profileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: emptyString,
    });
  }

  async onSaveProfile(): Promise<void> {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    // TODO: Simulacion de llamada de API, reemplazar luego
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.successMessage = this.translationService.t("profile.profile_updated");
    this.isEditing = false;
    this.isSaving = false;

    setTimeout(() => {
      this.successMessage = emptyString;
    }, 3000);
  }

  async onChangePassword(): Promise<void> {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      return;
    }

    this.isSaving = true;
    // TODO: Simulacion de llamada de API, reemplazar luego
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.successMessage = this.translationService.t("profile.password_updated");
    this.passwordForm.reset();
    this.isSaving = false;

    setTimeout(() => {
      this.successMessage = emptyString;
    }, 3000);
  }

  onUploadPhoto(): void {
    // TODO: Implementar logica de subida de foto
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }
}
