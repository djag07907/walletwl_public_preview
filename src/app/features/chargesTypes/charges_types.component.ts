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
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from "@commons/tables/table.component";
import { TablePaginationComponent } from "@commons/tables/pagination.component";
import {
  SearchIconComponent,
  DownloadIconComponent,
  PlusIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { ChargeType, mockChargeTypesData } from "./charges_types.mock";
import {
  ChargeTypeCellComponent,
  CategoryCellComponent,
  TaxableCellComponent,
  ChargeStatusCellComponent,
  ChargeActionsCellComponent,
} from "./components/charge-types-table-cells.component";

@Component({
  selector: "app-charge-types",
  standalone: true,
  imports: [
    CommonModule,
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
    PlusIconComponent,
    ChargeTypeCellComponent,
    CategoryCellComponent,
    TaxableCellComponent,
    ChargeStatusCellComponent,
    ChargeActionsCellComponent,
  ],
  templateUrl: "./charges_types.component.html",
  styleUrls: ["./charges_types.component.scss"],
})
export class ChargesTypesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  chargeTypes: ChargeType[] = [];
  filteredTypes: ChargeType[] = [];
  paginatedTypes: ChargeType[] = [];

  searchQuery: string = emptyString;
  categoryFilter: string = "all";
  currentPage: number = 1;
  itemsPerPage: number = 10;

  kpis: KpiData[] = [];
  categoryOptions: SelectOption[] = [];
  tableColumns: TableColumn[] = [];

  constructor(
    public translationService: TranslationService,
    private router: Router,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      if (this.chargeTypes.length > 0) {
        this.initializeTableColumns();
        this.initializeFilters();
      }
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.initializeFilters();
    this.initializeTableColumns();
    this.applyFilters();
  }

  private initializeData(): void {
    this.chargeTypes = mockChargeTypesData;
  }

  private initializeFilters(): void {
    const categories = Array.from(
      new Set(this.chargeTypes.map((t) => t.category)),
    );
    this.categoryOptions = [
      {
        label: this.translationService.t("billing_records.all_status"),
        value: "all",
      },
      ...categories.map((cat) => ({
        label: this.translationService.t(cat),
        value: cat,
      })),
    ];
  }

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "code",
        header: this.translationService.t("charge_types.code"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "description",
        header: this.translationService.t("charge_types.description"),
        width: "25%",
        minWidth: "200px",
      },
      {
        key: "category",
        header: this.translationService.t("charge_types.category"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "defaultAmount",
        header: this.translationService.t("charge_types.default_amount"),
        width: "15%",
        minWidth: "120px",
      },
      {
        key: "taxable",
        header: this.translationService.t("charge_types.taxable"),
        width: "10%",
        minWidth: "100px",
        align: "center",
      },
      {
        key: "status",
        header: this.translationService.t("charge_types.status"),
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

  onSearchChange(value: string): void {
    this.searchQuery = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryFilterChange(value: string): void {
    this.categoryFilter = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredTypes = this.chargeTypes.filter((type) => {
      const matchesSearch =
        type.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        type.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        this.categoryFilter === "all" || type.category === this.categoryFilter;

      return matchesSearch && matchesCategory;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTypes = this.filteredTypes.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTypes.length / this.itemsPerPage);
  }

  onChargeAction(event: { action: string; id: string }): void {
    if (event.action === "edit") {
      this.router.navigate(["home/charge-types/edit", event.id]);
    } else if (event.action === "view") {
      console.log("View:", event.id);
    } else if (event.action === "delete") {
      console.log("Delete:", event.id);
    }
  }

  onAddChargeType(): void {
    this.router.navigate(["home/charge-types/add"]);
  }

  onExport(): void {
    console.log("Export clicked");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
