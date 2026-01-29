import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { signal, computed } from "@angular/core";
import { BillingRecord } from "../billing_records.mock";
import { BillingRecordsService } from "../services/billing-records.service";
import { mockChargeTypesData } from "../../chargesTypes/charges_types.mock";
import { mockCollectorsData } from "../../collectors/collectors.mock";
import {
  ManualRechargeService,
  EnrichedWallet,
} from "../../manualRecharge/services/manual-recharge.service";
import { TranslationService } from "@app/services/translation.service";
import { emptyString } from "@app/resources/constants";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { SelectOption } from "@commons/forms/select.component";
import { LabelInputComponent } from "@commons/forms/label-input.component";
import { LabelSelectorComponent } from "@commons/forms/label-selector.component";
import { LabelTextareaComponent } from "@commons/forms/label-textarea.component";
import {
  BuildingIconComponent,
  DollarIconComponent,
  ArrowLeftIconComponent,
  SaveIconComponent,
  SearchIconComponent,
  UsersIconComponent,
  DatabaseIconComponent,
  CheckCircleIconComponent,
  XIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-billing-record-form",
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
    DollarIconComponent,
    ArrowLeftIconComponent,
    SaveIconComponent,
    SearchIconComponent,
    UsersIconComponent,
    DatabaseIconComponent,
    XIconComponent,
  ],
  // TODO: Actualizar componentes acordes al diseño de sistema
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
        [formGroup]="billingRecordForm"
        (ngSubmit)="onSubmit()"
        class="billing-record-form"
      >
        <div class="form-grid-layout">
          <div class="main-content">
            <app-card>
              <app-card-header>
                <div class="section-header">
                  <icon-building size="1.25rem"></icon-building>
                  <div>
                    <h3 class="section-title">
                      {{
                        translationService.t(
                          "billing_records.billing_record_information"
                        )
                      }}
                    </h3>
                    <p class="section-description">
                      {{
                        translationService.t(
                          "billing_records.billing_record_information_desc"
                        )
                      }}
                    </p>
                  </div>
                </div>
              </app-card-header>
              <app-card-content>
                <div class="form-fields">
                  <div class="form-grid">
                    <app-label-input
                      [label]="
                        translationService.t('billing_records.record_id')
                      "
                      fieldId="recordId"
                      type="text"
                      placeholder="Ex. TC-001"
                      [required]="true"
                      [error]="getFieldError('recordId')"
                      formControlName="recordId"
                      [readonly]="true"
                    >
                    </app-label-input>

                    <div class="search-field-wrapper">
                      <label class="field-label"
                        >{{
                          translationService.t("billing_records.wallet_citizen")
                        }}
                        *</label
                      >
                      <div class="search-input-container">
                        <icon-search
                          size="1rem"
                          class="search-icon"
                        ></icon-search>
                        <input
                          type="text"
                          [value]="walletSearchQuery()"
                          (input)="
                            onWalletSearchChange($any($event.target).value)
                          "
                          [placeholder]="
                            translationService.t(
                              'billing_records.search_placeholder'
                            )
                          "
                          class="search-input"
                          [readonly]="isEdit"
                        />
                      </div>
                      <div
                        class="search-results-dropdown"
                        *ngIf="
                          showWalletResults() &&
                          walletSearchResults().length > 0
                        "
                      >
                        <div
                          *ngFor="let wallet of walletSearchResults()"
                          class="result-item"
                          (click)="selectWallet(wallet)"
                        >
                          <div class="item-icon">
                            <icon-database size="1rem"></icon-database>
                          </div>
                          <div class="item-info">
                            <span class="item-id">{{ wallet.accountId }}</span>
                            <span class="item-name">{{
                              wallet.ownerName
                            }}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        class="error-text"
                        *ngIf="getFieldError('accountId')"
                        >{{ getFieldError("accountId") }}</span
                      >
                    </div>

                    <app-label-selector
                      [label]="
                        translationService.t('billing_records.charge_type')
                      "
                      fieldId="chargeType"
                      [options]="chargeTypeOptions"
                      [required]="true"
                      [error]="getFieldError('chargeType')"
                      formControlName="chargeType"
                    >
                    </app-label-selector>

                    <app-label-input
                      [label]="translationService.t('billing_records.amount')"
                      fieldId="amount"
                      type="number"
                      placeholder="0.00"
                      [required]="true"
                      [error]="getFieldError('amount')"
                      formControlName="amount"
                      prefix="Q. "
                    >
                    </app-label-input>
                  </div>

                  <div class="form-grid-full">
                    <div class="multi-select-wrapper">
                      <label class="field-label"
                        >{{
                          translationService.t(
                            "billing_records.assigned_collectors"
                          )
                        }}
                        *</label
                      >
                      <div class="search-input-container">
                        <icon-users
                          size="1rem"
                          class="search-icon"
                        ></icon-users>
                        <input
                          type="text"
                          [value]="collectorSearchQuery()"
                          (input)="
                            onCollectorSearchChange($any($event.target).value)
                          "
                          [placeholder]="
                            translationService.t(
                              'collectors.search_placeholder'
                            )
                          "
                          class="search-input"
                        />
                      </div>
                      <div
                        class="search-results-dropdown"
                        *ngIf="
                          showCollectorResults() &&
                          collectorSearchResults().length > 0
                        "
                      >
                        <div
                          *ngFor="let collector of collectorSearchResults()"
                          class="result-item"
                          (click)="selectCollector(collector)"
                        >
                          <div class="item-icon">
                            <icon-users size="1rem"></icon-users>
                          </div>
                          <div class="item-info">
                            <span class="item-id">{{ collector.id }}</span>
                            <span class="item-name">{{ collector.name }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="selected-items-tags">
                        <div
                          *ngFor="let collector of selectedCollectors()"
                          class="item-tag"
                        >
                          <span>{{ collector.name }}</span>
                          <button
                            type="button"
                            (click)="removeCollector(collector.id)"
                          >
                            <icon-x size="0.75rem"></icon-x>
                          </button>
                        </div>
                      </div>
                      <span
                        class="error-text"
                        *ngIf="getFieldError('assignedCollectors')"
                        >{{ getFieldError("assignedCollectors") }}</span
                      >
                    </div>
                  </div>
                </div>
              </app-card-content>
            </app-card>
          </div>

          <div class="side-content">
            <app-card>
              <app-card-header>
                <div class="section-header">
                  <icon-dollar size="1.25rem"></icon-dollar>
                  <div>
                    <h3 class="section-title">
                      {{ translationService.t("billing_records.details") }}
                    </h3>
                  </div>
                </div>
              </app-card-header>
              <app-card-content>
                <div class="form-fields">
                  <div class="status-field-readonly">
                    <label class="field-label">{{
                      translationService.t("billing_records.status")
                    }}</label>
                    <div class="readonly-value-box">
                      <span
                        class="status-dot"
                        [class]="billingRecordForm.get('status')?.value"
                      ></span>
                      {{
                        translationService.t(
                          "billing_records." +
                            billingRecordForm.get("status")?.value
                        )
                      }}
                    </div>
                    <p class="field-hint" *ngIf="!isEdit">
                      {{
                        translationService.t("billing_records.pending_default")
                      }}
                    </p>
                  </div>

                  <div
                    class="reference-field"
                    *ngIf="billingRecordForm.get('status')?.value === 'paid'"
                  >
                    <app-label-input
                      [label]="
                        translationService.t('billing_records.reference_number')
                      "
                      fieldId="referenceNumber"
                      type="text"
                      [readonly]="true"
                      formControlName="referenceNumber"
                    >
                    </app-label-input>
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
                customClass="cancel-btn"
              >
                {{ translationService.t("billing_records.cancel") }}
              </app-button>
              <app-button
                type="submit"
                [disabled]="isSubmitting"
                customClass="submit-btn"
              >
                <icon-save size="1rem"></icon-save>
                {{ submitButtonText }}
              </app-button>
            </div>
          </div>
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

      .billing-record-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
      }

      .form-grid-layout {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 1.5rem;
        align-items: start;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }

      .main-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .side-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        position: sticky;
        top: 1.5rem;
      }

      .status-field-readonly {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .readonly-value-box {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        font-weight: 500;
        color: #374151;
      }

      .status-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: #9ca3af;

        &.paid {
          background: #10b981;
        }
        &.pending {
          background: #f59e0b;
        }
        &.overdue {
          background: #ef4444;
        }
        &.cancelled {
          background: #6b7280;
        }
      }

      .field-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
      }

      .field-hint {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
      }

      .search-field-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .search-input-container {
        position: relative;
        display: flex;
        align-items: center;

        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: #9ca3af;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 0.75rem 0.625rem 2.25rem;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;

          &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          &[readonly] {
            background-color: #f3f4f6;
            cursor: not-allowed;
          }
        }
      }

      .search-results-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 50;
        margin-top: 0.25rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
      }

      .result-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f3f4f6;
        }

        .item-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .item-info {
          display: flex;
          flex-direction: column;
        }

        .item-id {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1e293b;
        }

        .item-name {
          font-size: 0.75rem;
          color: #64748b;
        }
      }

      .multi-select-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        position: relative;
      }

      .selected-items-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .item-tag {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #1d4ed8;
          cursor: pointer;
          padding: 0;
          opacity: 0.7;

          &:hover {
            opacity: 1;
          }
        }
      }

      .error-text {
        font-size: 0.75rem;
        color: #ef4444;
        margin-top: 0.25rem;
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

      .form-grid-3 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .form-grid-full {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
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

      @media (prefers-reduced-motion: reduce) {
        * {
          transition: none !important;
          animation: none !important;
        }
      }
    `,
  ],
})
export class BillingRecordFormComponent implements OnInit {
  @Input() billingRecord?: BillingRecord;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  billingRecordForm!: FormGroup;
  isSubmitting: boolean = false;
  billingRecordId?: string;

  chargeTypeOptions: SelectOption[] = [];

  walletSearchQuery = signal<string>("");
  showWalletResults = signal<boolean>(false);
  enrichedWallets = signal<EnrichedWallet[]>([]);
  walletSearchResults = computed(() => {
    const query = this.walletSearchQuery().toLowerCase();
    if (!query || this.isEdit) return [];
    return this.enrichedWallets().filter(
      (w) =>
        w.accountId.toLowerCase().includes(query) ||
        w.ownerName.toLowerCase().includes(query),
    );
  });

  collectorSearchQuery = signal<string>("");
  showCollectorResults = signal<boolean>(false);
  selectedCollectors = signal<any[]>([]);
  collectorSearchResults = computed(() => {
    const query = this.collectorSearchQuery().toLowerCase();
    if (!query) return [];
    const selectedIds = this.selectedCollectors().map((c) => c.id);
    return mockCollectorsData.filter(
      (c) =>
        !selectedIds.includes(c.id) &&
        (c.name.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)),
    );
  });

  constructor(
    private fb: FormBuilder,
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
    private rechargeService: ManualRechargeService,
    private billingRecordsService: BillingRecordsService,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeOptions();
    });
  }

  ngOnInit(): void {
    this.rechargeService.getEnrichedWallets().subscribe({
      next: (wallets) => {
        this.enrichedWallets.set(wallets);
      },
      error: (err) => {
        console.error(
          "BillingRecordForm: Error fetching enriched wallets",
          err,
        );
      },
    });

    this.route.paramMap.subscribe((params) => {
      this.billingRecordId = params.get("id") || undefined;
      this.isEdit = !!this.billingRecordId;

      if (this.isEdit && this.billingRecordId) {
        this.billingRecordsService
          .getBillingRecordById(this.billingRecordId)
          .subscribe({
            next: (record) => {
              if (record) {
                this.billingRecord = record;
                this.walletSearchQuery.set(
                  `${this.billingRecord.accountId} - ${this.billingRecord.citizenName}`,
                );
                const collectors = mockCollectorsData.filter((c) =>
                  this.billingRecord?.assignedCollectors?.includes(c.name),
                );
                this.selectedCollectors.set(collectors);
                this.initializeForm();
              }
            },
            error: (err) => {
              console.error(
                "BillingRecordForm: Error fetching record by ID",
                err,
              );
              this.initializeForm(); // At least initialize empty form
            },
          });
      } else {
        this.initializeForm();
      }

      this.initializeOptions();
    });
  }

  private initializeForm(): void {
    const generatedId = this.isEdit
      ? this.billingRecord?.recordId
      : this.generateRecordId();

    this.billingRecordForm = this.fb.group({
      recordId: [{ value: generatedId, disabled: true }, [Validators.required]],
      accountId: [
        this.billingRecord?.accountId || emptyString,
        [Validators.required],
      ],
      citizenName: [
        this.billingRecord?.citizenName || emptyString,
        [Validators.required],
      ],
      chargeType: [
        this.billingRecord?.chargeType || emptyString,
        [Validators.required],
      ],
      assignedCollectors: [
        this.billingRecord?.assignedCollectors || [],
        [Validators.minLength(1)],
      ],
      amount: [this.billingRecord?.amount || 0, [Validators.required]],
      status: [this.billingRecord?.status || "pending", [Validators.required]],
      referenceNumber: [this.billingRecord?.referenceNumber || emptyString],
    });
  }

  private generateRecordId(): string {
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `#INV-${random}`;
  }

  private initializeOptions(): void {
    this.chargeTypeOptions = mockChargeTypesData.map((ct) => ({
      label: this.translationService.t(ct.description),
      value: ct.description,
    }));
  }

  onWalletSearchChange(query: string): void {
    this.walletSearchQuery.set(query);
    this.showWalletResults.set(query.length > 0);
  }

  selectWallet(wallet: EnrichedWallet): void {
    this.billingRecordForm.patchValue({
      accountId: wallet.accountId,
      citizenName: wallet.ownerName,
    });
    this.walletSearchQuery.set(`${wallet.accountId} - ${wallet.ownerName}`);
    this.showWalletResults.set(false);
  }

  onCollectorSearchChange(query: string): void {
    this.collectorSearchQuery.set(query);
    this.showCollectorResults.set(query.length > 0);
  }

  selectCollector(collector: any): void {
    const current = this.selectedCollectors();
    this.selectedCollectors.set([...current, collector]);
    this.updateCollectorsFormControl();
    this.collectorSearchQuery.set("");
    this.showCollectorResults.set(false);
  }

  removeCollector(id: string): void {
    const updated = this.selectedCollectors().filter((c) => c.id !== id);
    this.selectedCollectors.set(updated);
    this.updateCollectorsFormControl();
  }

  private updateCollectorsFormControl(): void {
    const names = this.selectedCollectors().map((c) => c.name);
    this.billingRecordForm.get("assignedCollectors")?.setValue(names);
    this.billingRecordForm.get("assignedCollectors")?.markAsTouched();
  }

  async onSubmit(): Promise<void> {
    if (this.billingRecordForm.valid) {
      this.isSubmitting = true;

      const formData = {
        ...this.billingRecordForm.getRawValue(),
        amount: Number(this.billingRecordForm.get("amount")?.value || 0),
        assignedCollectors: this.selectedCollectors().map((c) => c.name),
      };

      try {
        if (this.isEdit && this.billingRecordId) {
          await this.billingRecordsService.updateBillingRecord(
            this.billingRecordId,
            formData,
          );
        } else {
          await this.billingRecordsService.createBillingRecord(formData);
        }
        this.router.navigate(["home/billing_records"]);
      } catch (error) {
        console.error("Error saving billing record:", error);
        this.isSubmitting = false;
        // TODO: Mostrar mensaje de error al usuario
      }
    } else {
      Object.keys(this.billingRecordForm.controls).forEach((key) => {
        this.billingRecordForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.router.navigate(["home/billing_records"]);
  }

  getFieldError(fieldName: string): string {
    const control = this.billingRecordForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.["required"]) {
        return this.translationService.t("form.required");
      }
      if (control.errors?.["email"]) {
        return this.translationService.t("form.email_invalid");
      }
    }
    return emptyString;
  }

  get formTitle(): string {
    return this.isEdit
      ? this.translationService.t("billing_records.edit_billing_record")
      : this.translationService.t("billing_records.create_billing_record");
  }

  get formSubtitle(): string {
    return this.isEdit
      ? this.translationService.t(
          "billing_records.edit_billing_record_subtitle",
        )
      : this.translationService.t(
          "billing_records.create_billing_record_subtitle",
        );
  }

  get submitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEdit
        ? this.translationService.t("billing_records.saving")
        : this.translationService.t("billing_records.creating");
    }
    return this.isEdit
      ? this.translationService.t("billing_records.save")
      : this.translationService.t("billing_records.save");
  }
}
