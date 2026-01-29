import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { TranslationService } from "@app/services/translation.service";
import { KpiCardComponent, KpiData } from "@commons/cards/kpi-card.component";
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { InputComponent } from "@commons/forms/input.component";
import { SelectComponent, SelectOption } from "@commons/forms/select.component";
import { BadgeComponent } from "@commons/ui/badge.component";
import { BillingRecordsMenuOptionsComponent } from "./components/billing_records-menu-options.component";
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from "@commons/tables/table.component";
import { TablePaginationComponent } from "@commons/tables/pagination.component";
import {
  BuildingIconComponent,
  TrendingUpIconComponent,
  TrendingDownIconComponent,
  UsersIconComponent,
  WarehouseIconComponent,
  SearchIconComponent,
  DownloadIconComponent,
  DollarIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { BillingRecord, mockBillingRecordsData } from "./billing_records.mock";
import { BillingRecordsService } from "./services/billing-records.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-billing-records",
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    BadgeComponent,
    BillingRecordsMenuOptionsComponent,
    TableComponent,
    TablePaginationComponent,
    BuildingIconComponent,
    TrendingUpIconComponent,
    TrendingDownIconComponent,
    UsersIconComponent,
    SearchIconComponent,
    DownloadIconComponent,
    DollarIconComponent,
    TableCellDirective,
  ],
  templateUrl: "./billing_records.component.html",
  styleUrls: ["./billing_records.component.scss"],
})
export class BillingRecordsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  billingRecords = signal<BillingRecord[]>(mockBillingRecordsData);
  searchQuery = signal<string>(emptyString);
  statusFilter = signal<string>("all");
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);

  filteredBillingRecords = computed(() => {
    const records = this.billingRecords();
    const query = this.searchQuery().toLowerCase();
    const filter = this.statusFilter();

    return records.filter((billing_record) => {
      const matchesSearch =
        (billing_record.citizenName || emptyString)
          .toLowerCase()
          .includes(query) ||
        (billing_record.accountId || emptyString)
          .toLowerCase()
          .includes(query) ||
        (billing_record.assignedCollectors &&
        billing_record.assignedCollectors.length > 0
          ? billing_record.assignedCollectors.join(", ")
          : emptyString
        )
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        filter === "all" || billing_record.status === filter;

      return matchesSearch && matchesStatus;
    });
  });

  paginatedBillingRecords = computed(() => {
    const filtered = this.filteredBillingRecords();
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return filtered.slice(start, end);
  });

  kpis = computed<KpiData[]>(() => {
    const records = this.billingRecords();
    const paidCount = records.filter((r) => r.status === "paid").length;
    const totalAmount = records.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0,
    );

    return [
      {
        title: this.translationService.t(
          "billing_records.total_billing_records",
        ),
        value: records.length.toString(),
        change: "+8.2%",
        trend: "up",
        subtitle: `${paidCount} ${this.translationService.t("billing_records.paid")}`,
      },
      {
        title: this.translationService.t("billing_records.total_amount"),
        value: `Q. ${totalAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        change: "+12.5%",
        trend: "up",
        subtitle: this.translationService.t("billing_records.from_last_month"),
      },
      {
        title: this.translationService.t("billing_records.avg_amount"),
        value: `Q. ${(records.length > 0
          ? totalAmount / records.length
          : 0
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        change: "+5.4%",
        trend: "up",
        subtitle: "Per record",
      },
    ];
  });

  statusOptions: SelectOption[] = [];
  tableColumns: TableColumn[] = [];

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private billingRecordsService: BillingRecordsService,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeTableColumns();
      this.initializeFilters();
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.initializeFilters();
    this.initializeTableColumns();
  }

  private initializeData(): void {
    this.billingRecordsService
      .getBillingRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (records) => {
          this.billingRecords.set(records);
        },
        error: (err) => {
          console.error("BillingRecordsComponent: Error fetching records", err);
        },
      });
  }

  private initializeFilters(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("billing_records.all_status"),
        value: "all",
      },
      {
        label:
          this.translationService.t("billing_records.status") +
          " - " +
          this.translationService.t("billing_records.paid"),
        value: "paid",
      },
      {
        label:
          this.translationService.t("billing_records.status") +
          " - " +
          this.translationService.t("billing_records.pending"),
        value: "pending",
      },
      {
        label:
          this.translationService.t("billing_records.status") +
          " - " +
          this.translationService.t("billing_records.overdue"),
        value: "overdue",
      },
      {
        label:
          this.translationService.t("billing_records.status") +
          " - " +
          this.translationService.t("billing_records.cancelled"),
        value: "cancelled",
      },
    ];
  }

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "billing_record",
        header: this.translationService.t("billing_records.billing_record"),
        width: "20%",
        minWidth: "180px",
      },
      {
        key: "wallet_citizen",
        header: this.translationService.t("billing_records.wallet_citizen"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "chargeType",
        header: this.translationService.t("billing_records.charge_type"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "assignedCollectors",
        header: this.translationService.t(
          "billing_records.assigned_collectors",
        ),
        width: "15%",
        minWidth: "150px",
      },
      {
        key: "amount",
        header: this.translationService.t("billing_records.amount"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "status",
        header: this.translationService.t("billing_records.status"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "actions",
        header: emptyString,
        width: "5%",
        minWidth: "80px",
        align: "center",
      },
    ];
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  get totalPages(): number {
    return Math.ceil(
      this.filteredBillingRecords().length / this.itemsPerPage(),
    );
  }

  get paidBillingRecordsCount(): number {
    return this.billingRecords().filter(
      (billing_record) => billing_record.status === "paid",
    ).length;
  }

  get totalAmount(): number {
    return this.billingRecords().reduce(
      (sum, billing_record) => sum + billing_record.amount,
      0,
    );
  }

  getBillingRecordAmountFormatted(amount: number): string {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getBadgeVariant(status: string): "default" | "secondary" {
    return status === "paid" ? "default" : "secondary";
  }

  onBillingRecordAction(event: {
    action: string;
    billingRecordId: string;
  }): void {
    if (event.action === "edit") {
      this.router.navigate([
        "home/billing_records/edit",
        event.billingRecordId,
      ]);
    } else if (event.action === "view") {
      // TODO: Implementar ver detalles
    } else if (event.action === "delete") {
      // TODO: Implementar eliminar
    }
  }

  onAddBillingRecord(): void {
    this.router.navigate(["home/billing_records/add"]);
  }

  onBatchUpload(): void {
    this.router.navigate(["home/billing_records/batch-upload"]);
  }

  onExport(): void {
    // TODO: Implementar funcionalidad de exportación
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
