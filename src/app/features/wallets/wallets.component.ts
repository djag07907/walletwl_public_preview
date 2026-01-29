import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
  signal,
  computed,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject, takeUntil, combineLatest } from "rxjs";
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
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { Wallet, mockWalletsData } from "./wallets.mock";
import { WalletsMenuOptionsComponent } from "./components/wallets-menu-options.component";
import { WalletsService } from "./services/wallets.service";
import { UsersService } from "@app/features/users/services/users.service";
import { User } from "@app/features/users/users.mock";

@Component({
  selector: "app-wallets",
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
    WalletsMenuOptionsComponent,
    TableComponent,
    TablePaginationComponent,
    BuildingIconComponent,
    TrendingUpIconComponent,
    TrendingDownIconComponent,
    UsersIconComponent,
    SearchIconComponent,
    DownloadIconComponent,
    TableCellDirective,
  ],
  templateUrl: "./wallets.component.html",
  styleUrls: ["./wallets.component.scss"],
})
export class WalletsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  wallets = signal<Wallet[]>(mockWalletsData);
  filteredWallets = signal<Wallet[]>([]);
  paginatedWallets = signal<Wallet[]>([]);

  searchQuery: string = emptyString;
  statusFilter: string = "all";
  currentPage: number = 1;
  itemsPerPage: number = 5;

  kpis: KpiData[] = [];
  statusOptions: SelectOption[] = [];
  tableColumns: TableColumn[] = [];

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private walletsService: WalletsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      if (this.wallets.length > 0) {
        this.initializeTableColumns();
        this.initializeFilters();
        this.calculateKpis();
      }
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.initializeFilters();
    this.initializeTableColumns();
    this.calculateKpis();
  }

  private initializeData(): void {
    combineLatest([
      this.walletsService.getWallets(),
      this.usersService.getUsers(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([wallets, users]) => {
          const mappedWallets = wallets.map((wallet: any) => {
            const user = users.find((u: any) => u.id === wallet.assignedUserId);
            return {
              ...wallet,
              ownerName: user
                ? `${user.firstName} ${user.lastName}`
                : "Unknown",
            };
          });
          this.wallets.set(mappedWallets);
          this.applyFilters();
          this.calculateKpis();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error fetching data:", err);
        },
      });
  }

  private initializeFilters(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("wallets.all_status"),
        value: "all",
      },
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

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "dpi",
        header: this.translationService.t("wallets.wallet"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "assignedUser",
        header: this.translationService.t("wallets.assigned_user"),
        width: "20%",
        minWidth: "150px",
      },
      {
        key: "balance",
        header: this.translationService.t("wallets.current_balance"),
        width: "15%",
        minWidth: "150px",
      },
      {
        key: "assignedMunicipality",
        header: this.translationService.t("wallets.assigned_municipality"),
        width: "20%",
        minWidth: "150px",
      },
      {
        key: "type",
        header: this.translationService.t("wallets.type"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "lastTransactionDate",
        header: this.translationService.t("wallets.last_transaction_date"),
        width: "10%",
        minWidth: "120px",
      },
      {
        key: "status",
        header: this.translationService.t("wallets.status"),
        width: "5%",
        minWidth: "80px",
      },
      {
        key: "actions",
        header: emptyString,
        width: "5%",
        minWidth: "60px",
        align: "center",
      },
    ];
  }

  private calculateKpis(): void {
    const list = this.wallets();
    const activeCount = list.filter(
      (wallet: any) => wallet.status === "active",
    ).length;
    const suspendedCount = list.filter(
      (wallet: any) => wallet.status === "suspended",
    ).length;

    this.kpis = [
      {
        title: this.translationService.t("wallets.total_wallets"),
        value: list.length.toString(),
        change: "+8.2%",
        trend: "up",
        subtitle: this.translationService.t("wallets.from_last_month"),
      },
      {
        title: this.translationService.t("wallets.active_wallets"),
        value: activeCount.toString(),
        change: "+12.5%",
        trend: "up",
        subtitle: this.translationService.t("wallets.currently_active"),
      },
      {
        title: this.translationService.t("wallets.suspended_wallets"),
        value: suspendedCount.toString(),
        change: "-2.4%",
        trend: "down",
        subtitle: this.translationService.t("wallets.currently_suspended"),
      },
    ];
  }

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    const list = this.wallets();
    this.filteredWallets.set(
      list.filter((wallet: any) => {
        const matchesSearch =
          (wallet.dpi || emptyString)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          (wallet.ownerName || emptyString)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          (wallet.accountId || emptyString)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

        const matchesStatus =
          this.statusFilter === "all" || wallet.status === this.statusFilter;

        return matchesSearch && matchesStatus;
      }),
    );

    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedWallets.set(
      this.filteredWallets().slice(startIndex, endIndex),
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWallets.length / this.itemsPerPage);
  }

  getBadgeVariant(
    status: string,
  ): "default" | "secondary" | "danger" | "warning" {
    switch (status) {
      case "active":
        return "default";
      case "suspended":
        return "danger";
      case "inactive":
        return "secondary";
      default:
        return "secondary";
    }
  }

  onWalletAction(event: { action: string; id: string }): void {
    console.log("Wallet action:", event);

    if (event.action === "edit") {
      this.router.navigate(["home/wallets/edit", event.id]);
    } else if (event.action === "view") {
      // TODO: Implementar ver detalles
      console.log("View wallet:", event.id);
    } else if (event.action === "delete") {
      // TODO: Implementar eliminar
      console.log("Delete wallet:", event.id);
    }
  }

  onAddWallet(): void {
    this.router.navigate(["home/wallets/add"]);
  }

  onExport(): void {
    console.log("Export clicked");
    // TODO: Implementar funcionalidad de exportación
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
