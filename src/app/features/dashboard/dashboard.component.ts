import { Component, OnInit, OnDestroy, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { TranslationService } from "@app/services/translation.service";

import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from "@app/commons/cards/card.component";
import { ButtonComponent } from "@app/commons/buttons/button.component";
import {
  TopTransactionsComponent,
  TransactionData,
} from "./components/top-transactions.component";
import {
  ActivityListComponent,
  ActivityData,
} from "./components/activity-list.component";
import {
  DollarIconComponent,
  RouteIconComponent,
  UsersIconComponent,
  PackageIconComponent,
  TrendingUpIconComponent,
  TrendingDownIconComponent,
  ShoppingCartIconComponent,
  MapPinIconComponent,
  ClockIconComponent,
  AlertCircleIconComponent,
  CalendarIconComponent,
  ArrowRightIconComponent,
} from "@app/shared/components/icons/icons.component";
import {
  KpiCardComponent,
  KpiData,
} from "@app/commons/cards/kpi-card.component";
import {
  StatCardComponent,
  StatData,
} from "@app/commons/cards/stat-card.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    TopTransactionsComponent,
    ActivityListComponent,
    DollarIconComponent,
    RouteIconComponent,
    UsersIconComponent,
    PackageIconComponent,
    TrendingUpIconComponent,
    TrendingDownIconComponent,
    CalendarIconComponent,
    ArrowRightIconComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentDate: Date = new Date();
  kpis: KpiData[] = [];
  topTransactions: TransactionData[] = [];
  recentActivities: ActivityData[] = [];

  constructor(public translationService: TranslationService) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeData();
    });
  }

  ngOnInit(): void {
    // TODO: La data se inicializa en el effect
  }

  // TODO: Datos de prueba
  private initializeData(): void {
    this.kpis = [
      {
        title: this.translationService.t("dashboard.total_collections_today"),
        value: "Q124,563",
        change: "+12.5%",
        trend: "up",
        subtitle: this.translationService.t("dashboard.vs_last_month"),
      },
      {
        title: this.translationService.t("dashboard.month_total"),
        value: "48",
        change: "+8.2%",
        trend: "up",
        subtitle: `12 ${this.translationService.t("dashboard.in_progress")}`,
      },
      {
        title: this.translationService.t("dashboard.pending_amount"),
        value: "1,284",
        change: "+5.4%",
        trend: "up",
        subtitle: `24 ${this.translationService.t("dashboard.new_this_week")}`,
      },
      {
        title: this.translationService.t("dashboard.active_collectors"),
        value: "8,542",
        change: "-2.1%",
        trend: "down",
        subtitle: this.translationService.t("dashboard.across_all_routes"),
      },
    ];

    this.topTransactions = [
      {
        name: this.translationService.t("dashboard.top_transactions.taxes"),
        sales: "Q12,450",
        orders: 45,
      },
      {
        name: this.translationService.t("dashboard.top_transactions.fines"),
        sales: "Q10,230",
        orders: 38,
      },
      {
        name: this.translationService.t("dashboard.top_transactions.services"),
        sales: "Q9,870",
        orders: 42,
      },
      {
        name: this.translationService.t("dashboard.top_transactions.permits"),
        sales: "Q8,650",
        orders: 35,
      },
      {
        name: this.translationService.t("dashboard.top_transactions.charges"),
        sales: "Q7,450",
        orders: 45,
      },
      {
        name: this.translationService.t("dashboard.top_transactions.fees"),
        sales: "Q6,230",
        orders: 38,
      },
    ];

    this.recentActivities = [
      {
        action: this.translationService.t("dashboard.new_order_placed"),
        entity: this.translationService.t("dashboard.zone_1_central"),
        time: this.translationService
          .t("dashboard.minutes_ago")
          .replace("{{count}}", "5"),
        amount: "Q1,245",
        status: "pending",
      },
      {
        action: this.translationService.t("dashboard.route_completed"),
        entity: `${this.translationService.t("dashboard.receipt")} #10245`,
        time: this.translationService
          .t("dashboard.hours_ago")
          .replace("{{count}}", "1"),
        amount: "Q8,450",
        status: "completed",
      },
      {
        action: this.translationService.t("dashboard.new_customer_added"),
        entity: `${this.translationService.t("dashboard.citizen")} #4582`,
        time: this.translationService
          .t("dashboard.hours_ago")
          .replace("{{count}}", "2"),
        amount: "-",
        status: "new",
      },
      {
        action: this.translationService.t("dashboard.product_restocked"),
        entity: `${this.translationService.t("dashboard.property_record")} #789`,
        time: this.translationService
          .t("dashboard.hours_ago")
          .replace("{{count}}", "3"),
        amount: `1 ${this.translationService.t("dashboard.units")}`,
        status: "completed",
      },
      {
        action: this.translationService.t("dashboard.payment_received"),
        entity: this.translationService.t("dashboard.main_plaza_terminal"),
        time: this.translationService
          .t("dashboard.hours_ago")
          .replace("{{count}}", "4"),
        amount: "Q3,200",
        status: "completed",
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFormattedDate(format: "long" | "short"): string {
    if (format === "long") {
      return this.currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return this.currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  onCreateRoute(): void {
    // TODO: Implementar creación de ruta
    console.log("Create route clicked");
  }
}
