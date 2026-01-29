import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  effect,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Wallet } from "../wallets.mock";
import { TranslationService } from "@app/services/translation.service";
import { emptyString } from "@app/resources/constants";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { SelectOption, SelectComponent } from "@commons/forms/select.component";
import { LabelInputComponent } from "@commons/forms/label-input.component";
import { LabelSelectorComponent } from "@commons/forms/label-selector.component";
import {
  BuildingIconComponent,
  ArrowLeftIconComponent,
  SaveIconComponent,
} from "@app/shared/components/icons/icons.component";
import { WalletsService } from "../services/wallets.service";
import { UsersService } from "@app/features/users/services/users.service";
import { map } from "rxjs/operators";
import { UserRole } from "@app/commons/enum/user_role";

@Component({
  selector: "app-wallet-form",
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
    BuildingIconComponent,
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

      <form
        [formGroup]="walletForm"
        (ngSubmit)="onSubmit()"
        class="wallet-form"
      >
        <app-card>
          <app-card-header>
            <div class="section-header">
              <icon-building size="1.25rem"></icon-building>
              <div>
                <h3 class="section-title">
                  {{ translationService.t("wallets.wallet_information") }}
                </h3>
                <p class="section-description">
                  {{ translationService.t("wallets.wallet_information_desc") }}
                </p>
              </div>
            </div>
          </app-card-header>
          <app-card-content>
            <div class="form-fields">
              <div class="form-grid">
                <app-label-input
                  [label]="translationService.t('wallets.dpi')"
                  fieldId="dpi"
                  type="text"
                  [placeholder]="
                    translationService.t('wallets.dpi_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('dpi')"
                  formControlName="dpi"
                >
                </app-label-input>

                <app-label-selector
                  [label]="translationService.t('wallets.assigned_user')"
                  fieldId="assignedUserId"
                  [options]="userOptions"
                  [required]="true"
                  formControlName="assignedUserId"
                  [placeholder]="
                    translationService.t('wallets.assigned_user_placeholder')
                  "
                >
                </app-label-selector>

                <app-label-input
                  [label]="translationService.t('wallets.account_id')"
                  fieldId="accountId"
                  type="text"
                  [placeholder]="
                    translationService.t('wallets.account_id_placeholder')
                  "
                  [required]="true"
                  [error]="getFieldError('accountId')"
                  formControlName="accountId"
                >
                </app-label-input>

                <app-label-input
                  [label]="translationService.t('wallets.wallet_type')"
                  fieldId="walletTypeDisplay"
                  type="text"
                  [required]="true"
                  formControlName="walletType"
                >
                </app-label-input>

                <app-label-selector
                  [label]="
                    translationService.t('wallets.assigned_municipality')
                  "
                  fieldId="assignedMunicipalityId"
                  [options]="municipalityOptions"
                  [required]="true"
                  formControlName="assignedMunicipalityId"
                  [placeholder]="
                    translationService.t(
                      'wallets.assigned_municipality_id_placeholder'
                    )
                  "
                >
                </app-label-selector>

                <app-label-selector
                  [label]="translationService.t('wallets.wallet_status')"
                  fieldId="status"
                  [options]="statusOptions"
                  [required]="true"
                  formControlName="status"
                >
                </app-label-selector>
              </div>
            </div>
          </app-card-content>
        </app-card>

        <div class="form-actions">
          <app-button
            type="button"
            variant="outline"
            (clicked)="onCancel()"
            [disabled]="isSubmitting"
          >
            {{ translationService.t("wallets.cancel") }}
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
        min-height: 100%;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @media (max-width: 768px) {
          padding: 1rem;
        }

        @media (max-width: 480px) {
          padding: 0.75rem;
        }
      }

      .form-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .back-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        border: none;
        background: transparent;
        color: var(--text-color, #1a1a1a);
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f3f4f6;
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

        @media (min-width: 640px) {
          font-size: 2.25rem;
        }

        @media (max-width: 480px) {
          font-size: 1.5rem;
        }
      }

      .form-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0.25rem 0 0 0;

        @media (min-width: 640px) {
          font-size: 1rem;
        }
      }

      .wallet-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
      }

      .section-header {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        color: var(--primary-color, #3b82f6);
      }

      .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color, #1a1a1a);
        margin: 0;
      }

      .section-description {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0.25rem 0 0 0;
      }

      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;

        gap: 0.75rem;
        padding-top: 0.5rem;

        ::ng-deep .submit-btn,
        ::ng-deep .cancel-btn {
          @media (max-width: 640px) {
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          flex-direction: column-reverse;

          app-button {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class WalletFormComponent implements OnInit {
  @Input() wallet?: Wallet;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  walletForm!: FormGroup;
  isSubmitting: boolean = false;
  id?: string;

  statusOptions: SelectOption[] = [];
  userOptions: SelectOption[] = [];

  private walletsService = inject(WalletsService);
  private usersService = inject(UsersService);

  municipalityOptions: SelectOption[] = [];

  // TODO: Municipalidades de prueba
  private mockMunicipalities = [
    { id: "MUNI-001", name: "Guatemala City" },
    { id: "MUNI-002", name: "Mixco" },
    { id: "MUNI-003", name: "Villa Nueva" },
  ];

  constructor(
    private fb: FormBuilder,
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeOptions();
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id") || undefined;
      this.isEdit = !!this.id;

      if (this.isEdit && this.id) {
        this.loadWallet(this.id);
      } else {
        this.initializeForm();
      }
    });

    this.initializeOptions();
    this.loadUsers();
    this.loadMunicipalities();
  }

  private loadWallet(id: string): void {
    this.walletsService.getWalletById(id).subscribe((wallet) => {
      this.wallet = wallet;
      this.initializeForm();
    });
  }

  private loadUsers(): void {
    this.usersService
      .getUsers()
      .pipe(map((users) => users.filter((u) => u.role === UserRole.USER)))
      .subscribe((users) => {
        this.userOptions = users.map((user) => ({
          label: `${user.firstName} ${user.lastName} (${user.email})`,
          value: user.id,
        }));
      });
  }

  private loadMunicipalities(): void {
    this.municipalityOptions = this.mockMunicipalities.map((muni) => ({
      label: muni.name,
      value: muni.id,
    }));
  }

  private generateAccountId(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ACT-${randomNum}`;
  }

  private initializeForm(): void {
    const accountId = this.isEdit
      ? this.wallet?.accountId
      : this.generateAccountId();

    this.walletForm = this.fb.group({
      dpi: [this.wallet?.dpi || emptyString, [Validators.required]],
      assignedUserId: [
        this.wallet?.assignedUserId || emptyString,
        [Validators.required],
      ],
      accountId: [{ value: accountId, disabled: true }, [Validators.required]],
      assignedMunicipalityId: [
        this.wallet?.assignedMunicipalityId || emptyString,
        [Validators.required],
      ],
      walletType: [
        { value: "Personal", disabled: true },
        [Validators.required],
      ],
      status: [this.wallet?.status || "active", [Validators.required]],
    });
  }

  private initializeOptions(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("wallets.active"),
        value: "active",
      },
      {
        label: this.translationService.t("wallets.inactive"),
        value: "inactive",
      },
      {
        label: this.translationService.t("wallets.suspended"),
        value: "suspended",
      },
    ];
  }

  onSubmit(): void {
    if (this.walletForm.valid) {
      this.isSubmitting = true;

      const formValue = this.walletForm.getRawValue();

      if (this.isEdit && this.id) {
        this.walletsService.updateWallet(this.id, formValue).subscribe({
          next: () => {
            this.router.navigate(["home/wallets"]);
          },
          error: (err) => {
            console.error(err);
            this.isSubmitting = false;
          },
        });
      } else {
        const submission = {
          ...formValue,
          walletType: formValue.walletType.toLowerCase(),
          currentBalance: 0.0,
          initialBalance: 0.0,
          lastTransactionDate: new Date().toISOString(),
          taxId: "N/A",
          notes: [],
        };

        this.walletsService
          .createWallet(submission)
          .then(() => {
            this.router.navigate(["home/wallets"]);
          })
          .catch((err) => {
            console.error(err);
            this.isSubmitting = false;
          });
      }
    } else {
      Object.keys(this.walletForm.controls).forEach((key) => {
        this.walletForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.router.navigate(["home/wallets"]);
  }

  getFieldError(fieldName: string): string {
    const control = this.walletForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.["required"]) {
        return "This field is required";
      }
    }
    return emptyString;
  }

  get formTitle(): string {
    return this.isEdit
      ? this.translationService.t("wallets.edit_wallet")
      : this.translationService.t("wallets.create_wallet");
  }

  get formSubtitle(): string {
    return this.isEdit
      ? this.translationService.t("wallets.edit_wallet_subtitle")
      : this.translationService.t("wallets.create_wallet_subtitle");
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEdit
        ? this.translationService.t("wallets.saving")
        : this.translationService.t("wallets.creating");
    }
    return this.isEdit
      ? this.translationService.t("wallets.save")
      : this.translationService.t("wallets.save");
  }
}
