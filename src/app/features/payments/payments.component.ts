import {
  Component,
  OnInit,
  OnDestroy,
  effect,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { TranslationService } from "@app/services/translation.service";
import { PaymentsService } from "./services/payments.service";
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
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from "@commons/tables/table.component";
import { TablePaginationComponent } from "@commons/tables/pagination.component";
import {
  SearchIconComponent,
  DownloadIconComponent,
  TrendingUpIconComponent,
  TrendingDownIconComponent,
  DollarIconComponent,
  UsersIconComponent,
  BillingIconComponent,
  DollarSignIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { Payment, mockPaymentsData } from "./payments.mock";
import {
  PaymentCellComponent,
  StatusCellComponent,
  ActionsCellComponent,
} from "./components/payments-table-cells.component";

@Component({
  selector: "app-payments",
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
    TableComponent,
    TableCellDirective,
    TablePaginationComponent,
    SearchIconComponent,
    DownloadIconComponent,
    TrendingUpIconComponent,
    TrendingDownIconComponent,
    DollarIconComponent,
    UsersIconComponent,
    PaymentCellComponent,
    StatusCellComponent,
    ActionsCellComponent,
    BillingIconComponent,
  ],
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  payments = signal<Payment[]>(mockPaymentsData);
  searchQuery = signal<string>(emptyString);
  statusFilter = signal<string>("all");
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);
  startDate = signal<string>(emptyString);
  endDate = signal<string>(emptyString);

  filteredPayments = computed(() => {
    const list = this.payments();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const startStr = this.startDate();
    const endStr = this.endDate();

    return list.filter((payment) => {
      const matchesSearch =
        (payment.referenceNumber || emptyString)
          .toLowerCase()
          .includes(query) ||
        (payment.billingRecordNumber || emptyString)
          .toLowerCase()
          .includes(query) ||
        (payment.payer.citizenName || emptyString)
          .toLowerCase()
          .includes(query) ||
        (payment.payer.taxId || emptyString).toLowerCase().includes(query);

      const matchesStatus = status === "all" || payment.status === status;

      let matchesDate = true;
      if (startStr || endStr) {
        const paymentDate = new Date(payment.paymentDate);
        paymentDate.setHours(0, 0, 0, 0);

        if (startStr) {
          const start = new Date(startStr);
          start.setHours(0, 0, 0, 0);
          if (paymentDate < start) matchesDate = false;
        }

        if (endStr) {
          const end = new Date(endStr);
          end.setHours(0, 0, 0, 0);
          if (paymentDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  paginatedPayments = computed(() => {
    const filtered = this.filteredPayments();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return filtered.slice(startIndex, endIndex);
  });

  kpis = computed<KpiData[]>(() => {
    const list = this.payments();
    const paidCount = list.filter((p) => p.status === "paid").length;
    const totalAmount = list
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedCount = list.filter((p) => p.status === "refunded").length;

    return [
      {
        title: this.translationService.t("payments.total_payments"),
        value: list.length.toString(),
        change: "+5.2%",
        trend: "up",
        subtitle: `${paidCount} ${this.translationService.t("payments.paid")}`,
      },
      {
        title: this.translationService.t("payments.total_amount"),
        value: `Q. ${totalAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        change: "+10.1%",
        trend: "up",
        subtitle: this.translationService.t("billing_records.from_last_month"),
      },
      {
        title: this.translationService.t("payments.total_refunds"),
        value: refundedCount.toString(),
        change: "-2.4%",
        trend: "down",
        subtitle: "vs last month",
      },
    ];
  });

  statusOptions: SelectOption[] = [];
  tableColumns: TableColumn[] = [];

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private paymentsService: PaymentsService,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeTableColumns();
      this.initializeFilters();
    });
  }

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeTableColumns();
    this.loadPayments();
  }

  private loadPayments(): void {
    this.paymentsService
      .getPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payments) => {
          this.payments.set(payments);
        },
        error: (error) => {
          console.error("Error loading payments:", error);
        },
      });
  }

  private initializeFilters(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("payments.all_status"),
        value: "all",
      },
      {
        label: this.translationService.t("payments.paid"),
        value: "paid",
      },
      {
        label: this.translationService.t("payments.refunded"),
        value: "refunded",
      },
    ];
  }

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "payer",
        header: this.translationService.t("payments.payer"),
        width: "25%",
        minWidth: "220px",
      },
      {
        key: "reference",
        header: this.translationService.t("payments.reference"),
        width: "20%",
        minWidth: "180px",
      },
      {
        key: "chargeType",
        header: this.translationService.t("payments.charge_type"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "amount",
        header: this.translationService.t("payments.amount"),
        width: "15%",
        minWidth: "100px",
      },
      {
        key: "date",
        header: this.translationService.t("payments.date"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "status",
        header: this.translationService.t("payments.status"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "actions",
        header: emptyString,
        width: "5%",
        minWidth: "50px",
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

  onStartDateChange(value: string): void {
    this.startDate.set(value);
    this.currentPage.set(1);
  }

  onEndDateChange(value: string): void {
    this.endDate.set(value);
    this.currentPage.set(1);
  }

  onClearFilters(): void {
    this.searchQuery.set(emptyString);
    this.statusFilter.set("all");
    this.startDate.set(emptyString);
    this.endDate.set(emptyString);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayments().length / this.itemsPerPage());
  }

  getPaymentAmountFormatted(amount: number): string {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getBadgeVariant(status: string): "default" | "danger" | "secondary" {
    return status === "paid" ? "default" : "danger";
  }

  onPaymentAction(event: { action: string; id: string }): void {
    if (event.action === "edit") {
      this.router.navigate(["home/payments/edit", event.id]);
    } else if (event.action === "view") {
      this.router.navigate(["home/payments/detail", event.id]);
    } else if (event.action === "delete") {
      // TODO: Implementar eliminar
    }
  }

  onAddPayment(): void {
    this.router.navigate(["home/payments/add"]);
  }

  onExport(): void {
    // TODO: Implementar funcionalidad de exportación
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
