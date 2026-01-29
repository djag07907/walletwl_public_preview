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
import { Municipality, mockMunicipalitiesData } from "./municipalities.mock";
import { MunicipalitiesMenuOptionsComponent } from "./components/municipalities-menu-options.component";

@Component({
  selector: "app-municipalities",
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
    MunicipalitiesMenuOptionsComponent,
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
  templateUrl: "./municipalities.component.html",
  styleUrls: ["./municipalities.component.scss"],
})
export class MunicipalitiesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  municipalities: Municipality[] = [];
  filteredMunicipalities: Municipality[] = [];
  paginatedMunicipalities: Municipality[] = [];

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
      if (this.municipalities.length > 0) {
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
    this.municipalities = mockMunicipalitiesData;
  }

  private initializeFilters(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("municipalities.all_status"),
        value: "all",
      },
      {
        label: this.translationService.t("municipalities.active"),
        value: "active",
      },
      {
        label: this.translationService.t("municipalities.inactive"),
        value: "inactive",
      },
    ];
  }

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "municipality",
        header: this.translationService.t("municipalities.municipality"),
        width: "25%",
        minWidth: "200px",
      },
      {
        key: "region",
        header: this.translationService.t("municipalities.region"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "contact",
        header: this.translationService.t("municipalities.contact"),
        width: "25%",
        minWidth: "200px",
      },
      {
        key: "taxId",
        header: this.translationService.t("municipalities.tax_id"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "status",
        header: this.translationService.t("municipalities.status"),
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
    const activeCount = this.municipalities.filter(
      (municipality) => municipality.status === "active",
    ).length;

    this.kpis = [
      {
        title: this.translationService.t("municipalities.total_municipalities"),
        value: this.municipalities.length.toString(),
        change: null,
        trend: null,
        subtitle: null,
      },
      {
        title: this.translationService.t(
          "municipalities.active_municipalities",
        ),
        value: activeCount.toString(),
        change: null,
        trend: null,
        subtitle: null,
      },
      {
        title: this.translationService.t(
          "municipalities.inactive_municipalities",
        ),
        value: this.municipalities
          .filter((m) => m.status === "inactive")
          .length.toString(),
        change: null,
        trend: null,
        subtitle: null,
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
    this.filteredMunicipalities = this.municipalities.filter((municipality) => {
      const matchesSearch =
        (municipality.municipalityName || emptyString)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        (municipality.id || emptyString)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        (municipality.contactEmail || emptyString)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.statusFilter === "all" ||
        municipality.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMunicipalities = this.filteredMunicipalities.slice(
      startIndex,
      endIndex,
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMunicipalities.length / this.itemsPerPage);
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

  onMunicipalityAction(event: { action: string; id: string }): void {
    if (event.action === "edit") {
      this.router.navigate(["home/municipalities/edit", event.id]);
    } else if (event.action === "view") {
      // TODO: Implementar ver detalles
    } else if (event.action === "delete") {
      // TODO: Implementar eliminar
    }
  }

  onAddMunicipality(): void {
    this.router.navigate(["home/municipalities/add"]);
  }

  onExport(): void {
    // TODO: Implementar funcionalidad de exportación
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
