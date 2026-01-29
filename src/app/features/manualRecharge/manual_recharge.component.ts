import { Component, OnInit, OnDestroy, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { TranslationService } from "@app/services/translation.service";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from "@commons/tables/table.component";
import {
  PlusIconComponent,
  MinusIconComponent,
  AlertTriangleIconComponent,
  ExternalLinkIconComponent,
  CheckCircleIconComponent,
  DatabaseIconComponent,
  UsersIconComponent,
} from "@app/shared/components/icons/icons.component";
import {
  ManualRechargeService,
  Adjustment,
  EnrichedWallet,
} from "./services/manual-recharge.service";
import { ManualRechargeStatusDialogComponent } from "./components/manual-recharge-status-dialog.component";
import { effect } from "@angular/core";

@Component({
  selector: "app-manual-recharge",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    TableComponent,
    PlusIconComponent,
    MinusIconComponent,
    AlertTriangleIconComponent,
    ExternalLinkIconComponent,
    CheckCircleIconComponent,
    DatabaseIconComponent,
    UsersIconComponent,
    TableCellDirective,
    ManualRechargeStatusDialogComponent,
  ],

  templateUrl: "./manual_recharge.component.html",
  styleUrls: ["./manual_recharge.component.scss"],
})
export class ManualRechargeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchQuery = signal<string>("");
  showSearchResults = signal<boolean>(false);
  selectedWallet = signal<EnrichedWallet | null>(null);
  adjustmentType = signal<"ADD" | "SUBTRACT">("ADD");
  amount = signal<number | null>(null);
  reason = signal<string>("");

  isApplying = signal<boolean>(false);

  isStatusVisible = signal<boolean>(false);
  statusType = signal<"success" | "error">("success");
  lastAppliedAdjustment = signal<Adjustment | null>(null);
  enrichedWallets = signal<EnrichedWallet[]>([]);
  adjustments = signal<Adjustment[]>([]);

  searchResults = computed(() => {
    return this.rechargeService.searchWallets(
      this.enrichedWallets(),
      this.searchQuery(),
    );
  });

  columns: TableColumn[] = [];

  constructor(
    public translationService: TranslationService,
    private rechargeService: ManualRechargeService,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.updateColumns();
    });
  }

  private updateColumns(): void {
    this.columns = [
      {
        key: "walletAccountId",
        header: this.translationService.t("manual_recharge.column_account"),
        width: "20%",
      },
      {
        key: "type",
        header: this.translationService.t("manual_recharge.column_type"),
        width: "15%",
      },
      {
        key: "amount",
        header: this.translationService.t("manual_recharge.column_amount"),
        width: "20%",
      },
      {
        key: "operator",
        header: this.translationService.t("manual_recharge.column_operator"),
        width: "25%",
      },
      {
        key: "date",
        header: this.translationService.t("manual_recharge.column_date"),
        width: "20%",
      },
    ];
  }

  ngOnInit(): void {
    // Start enriched wallets listener first (combines users + wallets)
    this.rechargeService
      .getEnrichedWallets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wallets) => {
          this.enrichedWallets.set(wallets);
        },
        error: (err) => {
          console.error("Error fetching wallets:", err);
        },
      });

    // Delay adjustments listener to prevent WebSocket session overload
    // This fixes the "Unknown SID" 400 error by preventing too many
    // concurrent listeners from overwhelming the Firestore session
    setTimeout(() => {
      this.rechargeService
        .getAdjustments()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (adjustments) => {
            this.adjustments.set(adjustments);
          },
          error: (err) => {
            console.error("Error fetching adjustments:", err);
          },
        });
    }, 1000);
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.showSearchResults.set(query.length > 0);
  }

  selectWallet(wallet: EnrichedWallet): void {
    this.selectedWallet.set(wallet);
    this.searchQuery.set(`${wallet.accountId} - ${wallet.ownerName}`);
    this.showSearchResults.set(false);
  }

  setAdjustmentType(type: "ADD" | "SUBTRACT"): void {
    this.adjustmentType.set(type);
  }

  clearForm(): void {
    this.selectedWallet.set(null);
    this.searchQuery.set("");
    this.adjustmentType.set("ADD");
    this.amount.set(null);
    this.reason.set("");
    this.showSearchResults.set(false);
  }

  async applyAdjustment(): Promise<void> {
    const wallet = this.selectedWallet();
    const amt = this.amount();

    if (!wallet || !amt || amt <= 0 || !this.reason()) {
      return;
    }

    this.isApplying.set(true);

    try {
      // TODO: Obtener el usuario actual desde AuthService
      const currentUser = {
        id: "current-user-id",
        name: "Admin User",
      };

      await this.rechargeService.applyAdjustment(
        wallet.id!,
        this.adjustmentType(),
        amt,
        this.reason(),
        currentUser,
      );

      this.statusType.set("success");
      this.isStatusVisible.set(true);

      const latestAdjustments = this.adjustments();
      if (latestAdjustments.length > 0) {
        this.lastAppliedAdjustment.set(latestAdjustments[0]);
      }

      this.clearForm();
    } catch (error) {
      console.error("Error applying adjustment:", error);
      this.statusType.set("error");
      this.isStatusVisible.set(true);
    } finally {
      this.isApplying.set(false);
    }
  }

  closeStatusDialog(): void {
    this.isStatusVisible.set(false);
  }

  scrollToHistory(): void {
    this.isStatusVisible.set(false);
    const element = document.querySelector(".history-section");
    element?.scrollIntoView({ behavior: "smooth" });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
