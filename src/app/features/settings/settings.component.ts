import { Component, OnInit, OnDestroy, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { TranslationService } from "@app/services/translation.service";
import { TabsComponent, Tab } from "@commons/ui/tabs.component";
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { InputComponent } from "@commons/forms/input.component";
import { LabelInputComponent } from "@commons/forms/label-input.component";
import { LabelSelectorComponent } from "@commons/forms/label-selector.component";
import { LabelTextareaComponent } from "@commons/forms/label-textarea.component";
import { SelectOption } from "@commons/forms/select.component";
import { SwitchComponent } from "@commons/forms/switch.component";
import {
  GlobeIconComponent,
  BellIconComponent,
  ShieldIconComponent,
  DatabaseIconComponent,
  BuildingIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabsComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    ButtonComponent,
    LabelInputComponent,
    LabelSelectorComponent,
    LabelTextareaComponent,
    SwitchComponent,
    GlobeIconComponent,
    BellIconComponent,
    ShieldIconComponent,
    DatabaseIconComponent,
    BuildingIconComponent,
  ],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tabs: Tab[] = [];
  activeTab: string = "general";

  generalForm!: FormGroup;
  platformForm!: FormGroup;
  notificationsForm!: FormGroup;
  securityForm!: FormGroup;

  languageOptions: SelectOption[] = [];
  timezoneOptions: SelectOption[] = [];
  currencyOptions: SelectOption[] = [];
  dateFormatOptions: SelectOption[] = [];
  passwordPolicyOptions: SelectOption[] = [];

  constructor(
    public translationService: TranslationService,
    private fb: FormBuilder,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeTabs();
      this.initializeOptions();
    });
  }

  ngOnInit(): void {
    this.initializeTabs();
    this.initializeOptions();
    this.initializeForms();
  }

  private initializeTabs(): void {
    this.tabs = [
      {
        id: "general",
        label: this.translationService.t("settings.tab_general"),
      },
      {
        id: "platform",
        label: this.translationService.t("settings.tab_platform"),
      },
      {
        id: "notifications",
        label: this.translationService.t("settings.tab_notifications"),
      },
      {
        id: "security",
        label: this.translationService.t("settings.tab_security"),
      },
      {
        id: "integrations",
        label: this.translationService.t("settings.tab_integrations"),
      },
    ];
  }

  private initializeOptions(): void {
    this.languageOptions = [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "French", value: "fr" },
      { label: "German", value: "de" },
    ];

    this.timezoneOptions = [{ label: "GMT", value: "gmt" }];

    this.currencyOptions = [
      { label: "Quetzales (Q)", value: "q" },
      { label: "USD ($)", value: "usd" },
    ];

    this.dateFormatOptions = [
      { label: "MM/DD/YYYY", value: "mdy" },
      { label: "DD/MM/YYYY", value: "dmy" },
      { label: "YYYY-MM-DD", value: "ymd" },
    ];

    this.passwordPolicyOptions = [
      {
        label: this.translationService.t("settings.password_policy_low"),
        value: "low",
      },
      {
        label: this.translationService.t("settings.password_policy_medium"),
        value: "medium",
      },
      {
        label: this.translationService.t("settings.password_policy_high"),
        value: "high",
      },
    ];
  }

  private initializeForms(): void {
    this.generalForm = this.fb.group({
      language: ["en"],
      timezone: ["utc"],
      currency: ["usd"],
      dateFormat: ["mdy"],
    });

    this.platformForm = this.fb.group({
      platformName: ["Municipalidad de Francisco Morazan"],
      taxId: ["08011999000000"],
      email: ["contact@acmedist.com"],
      phone: ["+1 (555) 123-4567"],
      address: ["123 Business Ave, New York, NY 10001, United States"],
    });

    this.notificationsForm = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [false],
      lowStockAlerts: [true],
      routeUpdates: [true],
    });

    this.securityForm = this.fb.group({
      sessionTimeout: [30],
      passwordPolicy: ["medium"],
      twoFactorAuth: [false],
    });
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  saveGeneralSettings(): void {
    console.log("Saving general settings:", this.generalForm.value);
    // TODO: Implementar logica de guardado
  }

  savePlatformInfo(): void {
    console.log("Saving platform info:", this.platformForm.value);
    // TODO: Implementar logica de guardado
  }

  saveNotificationPreferences(): void {
    console.log(
      "Saving notification preferences:",
      this.notificationsForm.value,
    );
    // TODO: Implementar logica de guardado
  }

  saveSecuritySettings(): void {
    console.log("Saving security settings:", this.securityForm.value);
    // TODO: Implementar logica de guardado
  }

  configureIntegration(integration: string): void {
    console.log("Configuring integration:", integration);
    // TODO: Implementar configuracion de integracion
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
