import { Component, OnInit, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslationService } from "@app/services/translation.service";
import {
  CardComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { BadgeComponent } from "@commons/ui/badge.component";
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from "@commons/tables/table.component";
import {
  PlusIconComponent,
  LayoutGridIconComponent,
} from "@app/shared/components/icons/icons.component";
import {
  ChargeType,
  mockChargeTypesData,
} from "../chargesTypes/charges_types.mock";

@Component({
  selector: "app-charge-categories",
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardContentComponent,
    ButtonComponent,
    BadgeComponent,
    TableComponent,
    TableCellDirective,
    PlusIconComponent,
    LayoutGridIconComponent,
  ],
  template: `
    <div class="categories-container">
      <div class="categories-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="categories-title">
              {{ translationService.t("charge_categories.title") }}
            </h1>
            <p class="categories-subtitle">
              {{ translationService.t("charge_categories.subtitle") }}
            </p>
          </div>
          <app-button (clicked)="onAddCategory()" customClass="add-btn">
            <icon-plus size="1.1rem"></icon-plus>
            {{ translationService.t("charge_categories.add_category") }}
          </app-button>
        </div>
      </div>

      <app-card>
        <app-card-content customClass="table-content">
          <app-table [columns]="tableColumns" [data]="categories">
            <ng-template appTableCell="name" let-category>
              <div class="category-info">
                <div
                  class="category-icon"
                  [style.background]="getCategoryColor(category.name, true)"
                  [style.color]="getCategoryColor(category.name)"
                >
                  <icon-layout-grid size="1.25rem"></icon-layout-grid>
                </div>
                <span class="category-name">{{
                  translationService.t(category.name)
                }}</span>
              </div>
            </ng-template>
            <ng-template appTableCell="count" let-category>
              <app-badge variant="secondary">
                {{ category.count }}
                {{ translationService.t("charge_types.orders") }}
              </app-badge>
            </ng-template>
            <ng-template appTableCell="actions" let-category>
              <div class="actions-cell">
                <button class="action-btn" title="Edit">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </ng-template>
          </app-table>
        </app-card-content>
      </app-card>
    </div>
  `,
  styles: [
    `
      .categories-container {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .categories-header .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .categories-title {
        font-size: 2.25rem;
        font-weight: 700;
        margin: 0;
      }
      .categories-subtitle {
        color: #6b7280;
        margin: 0.25rem 0 0 0;
      }
      .category-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .category-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .category-name {
        font-weight: 500;
        color: #111827;
      }
      .actions-cell {
        display: flex;
        justify-content: center;
      }
      .action-btn {
        width: 2rem;
        height: 2rem;
        border-radius: 0.375rem;
        border: 1px solid #e5e7eb;
        background: white;
        color: #6b7280;
        cursor: pointer;
      }
      ::ng-deep .table-content {
        padding: 0 !important;
      }
    `,
  ],
})
export class ChargeCategoriesComponent implements OnInit {
  categories: { name: string; count: number }[] = [];
  tableColumns: TableColumn[] = [];

  constructor(public translationService: TranslationService) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeTableColumns();
    });
  }

  ngOnInit(): void {
    const categoryCounts = mockChargeTypesData.reduce(
      (acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    this.categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));

    this.initializeTableColumns();
  }

  private initializeTableColumns(): void {
    this.tableColumns = [
      {
        key: "name",
        header: this.translationService.t("charge_types.category"),
        width: "60%",
      },
      {
        key: "count",
        header: this.translationService.t("charge_types.orders"),
        width: "30%",
        align: "center",
      },
      { key: "actions", header: "", width: "10%", align: "center" },
    ];
  }

  getCategoryColor(category: string, light = false): string {
    const colors: Record<string, string> = {
      "dashboard.top_transactions.taxes": "#2563eb",
      "dashboard.top_transactions.services": "#059669",
      "dashboard.top_transactions.fines": "#dc2626",
      "dashboard.top_transactions.permits": "#d97706",
    };
    const lightColors: Record<string, string> = {
      "dashboard.top_transactions.taxes": "#eff6ff",
      "dashboard.top_transactions.services": "#ecfdf5",
      "dashboard.top_transactions.fines": "#fef2f2",
      "dashboard.top_transactions.permits": "#fffbeb",
    };

    return light
      ? lightColors[category] || "#f3f4f6"
      : colors[category] || "#6b7280";
  }

  onAddCategory(): void {
    console.log("Add category");
  }
}
