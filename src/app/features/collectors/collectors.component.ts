import { Component, OnInit, OnDestroy, effect } from "@angular/core";
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
import { Collector, mockCollectorsData } from "./collectors.mock";
import { CollectorsMenuOptionsComponent } from "./components/collectors-menu-options.component";

@Component({
  selector: "app-collectors",
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
    CollectorsMenuOptionsComponent,
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
  templateUrl: "./collectors.component.html",
  styleUrls: ["./collectors.component.scss"],
})
export class CollectorsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  collectors: Collector[] = [];
  filteredCollectors: Collector[] = [];
  paginatedCollectors: Collector[] = [];

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
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      if (this.collectors.length > 0) {
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
    this.applyFilters();
  }

  private initializeData(): void {
    this.collectors = mockCollectorsData;
  }

  private initializeFilters(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("collectors.all_status"),
        value: "all",
      },
      {
        label: this.translationService.t("collectors.active"),
        value: "active",
      },
      {
        label: this.translationService.t("collectors.inactive"),
        value: "inactive",
      },
      {
        label: this.translationService.t("collectors.suspended"),
        value: "suspended",
      },
    ];
  }

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "collector",
        header: this.translationService.t("collectors.collector"),
        width: "25%",
        minWidth: "200px",
      },
      {
        key: "contact",
        header: this.translationService.t("collectors.contact"),
        width: "20%",
        minWidth: "180px",
      },
      {
        key: "assignedMunicipalities",
        header: this.translationService.t("collectors.assigned_municipalities"),
        width: "20%",
        minWidth: "150px",
      },
      {
        key: "role",
        header: this.translationService.t("collectors.role"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "status",
        header: this.translationService.t("collectors.status"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "actions",
        header: emptyString,
        width: "10%",
        minWidth: "80px",
        align: "center",
      },
    ];
  }

  private calculateKpis(): void {
    const activeCount = this.collectors.filter(
      (collector) => collector.status === "active",
    ).length;
    const suspendedCount = this.collectors.filter(
      (collector) => collector.status === "suspended",
    ).length;

    this.kpis = [
      {
        title: this.translationService.t("collectors.total_collectors"),
        value: this.collectors.length.toString(),
        change: "+8.2%",
        trend: "up",
        subtitle: this.translationService.t("collectors.from_last_month"),
      },
      {
        title: this.translationService.t("collectors.active_collectors"),
        value: activeCount.toString(),
        change: "+12.5%",
        trend: "up",
        subtitle: this.translationService.t("collectors.currently_active"),
      },
      {
        title: this.translationService.t("collectors.suspended_collectors"),
        value: suspendedCount.toString(),
        change: "-2.4%",
        trend: "down",
        subtitle: this.translationService.t("collectors.currently_suspended"),
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
    this.filteredCollectors = this.collectors.filter((collector) => {
      const matchesSearch =
        (collector.name || emptyString)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        (collector.id || emptyString)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        (collector.email || emptyString)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.statusFilter === "all" || collector.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCollectors = this.filteredCollectors.slice(
      startIndex,
      endIndex,
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCollectors.length / this.itemsPerPage);
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

  onCollectorAction(event: { action: string; id: string }): void {
    console.log("Collector action:", event);

    if (event.action === "edit") {
      this.router.navigate(["home/collectors/edit", event.id]);
    } else if (event.action === "view") {
      // TODO: Implementar ver detalles
      console.log("View collector:", event.id);
    } else if (event.action === "delete") {
      // TODO: Implementar eliminar
      console.log("Delete collector:", event.id);
    }
  }

  onAddCollector(): void {
    this.router.navigate(["home/collectors/add"]);
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
