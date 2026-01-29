import { Injectable, inject } from "@angular/core";
import { Observable, combineLatest, of } from "rxjs";
import { map, catchError, startWith } from "rxjs/operators";
import {
  Firestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "@angular/fire/firestore";
import { WalletsService } from "@app/features/wallets/services/wallets.service";
import { UsersService } from "@app/features/users/services/users.service";
import { Wallet } from "@app/features/wallets/wallets.mock";
import { User } from "@app/features/users/users.mock";

export interface Adjustment {
  id?: string;
  walletId: string;
  walletAccountId: string;
  type: "ADD" | "SUBTRACT";
  amount: number;
  operator: string;
  operatorId: string;
  reason: string;
  createdAt: string;
  previousBalance: number;
  newBalance: number;
}

export interface EnrichedWallet extends Wallet {
  ownerName: string;
  ownerEmail: string;
}

@Injectable({
  providedIn: "root",
})
export class ManualRechargeService {
  private firestore = inject(Firestore);
  private walletsService = inject(WalletsService);
  private usersService = inject(UsersService);

  private readonly ADJUSTMENTS_COLLECTION = "adjustments";

  /**
   * Get enriched wallets (with owner name and email from users)
   */
  getEnrichedWallets(): Observable<EnrichedWallet[]> {
    return combineLatest([
      this.walletsService.getWallets(),
      this.usersService.getUsers(),
    ]).pipe(
      map(([wallets, users]) => {
        return wallets.map((wallet) => {
          const user = users.find((u) => u.id === wallet.assignedUserId);
          return {
            ...wallet,
            ownerName: user
              ? `${user.firstName} ${user.lastName}`
              : "manual_recharge.unknown_owner",
            ownerEmail: user?.email || "manual_recharge.not_available",
          };
        });
      }),
      catchError((error) => {
        console.error("Error in getEnrichedWallets:", error);
        return of([]); // Return empty array to keep component alive
      }),
    );
  }

  /**
   * Search wallets by owner name, email, account ID, or DPI
   */
  searchWallets(
    enrichedWallets: EnrichedWallet[],
    query: string,
  ): EnrichedWallet[] {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return enrichedWallets.filter(
      (w) =>
        w.ownerName.toLowerCase().includes(lowerQuery) ||
        w.ownerEmail.toLowerCase().includes(lowerQuery) ||
        w.accountId.toLowerCase().includes(lowerQuery) ||
        w.dpi.toLowerCase().includes(lowerQuery) ||
        w.id.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Apply balance adjustment and create audit log
   */
  async applyAdjustment(
    walletId: string,
    type: "ADD" | "SUBTRACT",
    amount: number,
    reason: string,
    currentUser: { id: string; name: string },
  ): Promise<void> {
    try {
      const wallet = await new Promise<Wallet | undefined>((resolve) => {
        this.walletsService.getWalletById(walletId).subscribe((w) => {
          resolve(w);
        });
      });

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const previousBalance = wallet.currentBalance;
      const newBalance =
        type === "ADD" ? previousBalance + amount : previousBalance - amount;

      await this.walletsService.updateWallet(walletId, {
        currentBalance: newBalance,
      });

      const adjustmentsCollection = collection(
        this.firestore,
        this.ADJUSTMENTS_COLLECTION,
      );

      const adjustment: Omit<Adjustment, "id"> = {
        walletId,
        walletAccountId: wallet.accountId,
        type,
        amount,
        operator: currentUser.name,
        operatorId: currentUser.id,
        reason,
        createdAt: new Date().toISOString(),
        previousBalance,
        newBalance,
      };

      await addDoc(adjustmentsCollection, adjustment);
    } catch (error) {
      console.error("Error applying adjustment:", error);
      throw error;
    }
  }

  /**
   * Get adjustment history in real-time
   */
  getAdjustments(): Observable<Adjustment[]> {
    const adjustmentsCollection = collection(
      this.firestore,
      this.ADJUSTMENTS_COLLECTION,
    );
    // TEMPORARILY REMOVED orderBy to diagnose 400 error
    // const q = query(adjustmentsCollection, orderBy("createdAt", "desc"));

    return new Observable<Adjustment[]>((observer) => {
      const unsubscribe = onSnapshot(
        adjustmentsCollection, // Query the collection directly without orderBy
        (snapshot) => {
          const adjustments = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Adjustment,
          );
          // Sort in memory as workaround
          adjustments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          observer.next(adjustments);
        },
        (error) => {
          console.error("Error fetching adjustments from Firestore:", error);
          observer.next([]); // Fallback to empty array
        },
      );

      return () => unsubscribe();
    }).pipe(startWith([] as Adjustment[]));
  }
}
