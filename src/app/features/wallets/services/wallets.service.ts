import { Injectable, inject } from "@angular/core";
import {
  Firestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  setDoc,
  onSnapshot,
  orderBy,
  deleteDoc,
} from "@angular/fire/firestore";
import { from, Observable, map, combineLatest, of, startWith } from "rxjs";
import { Wallet, mockWalletsData } from "../wallets.mock";

@Injectable({
  providedIn: "root",
})
export class WalletsService {
  private firestore = inject(Firestore);

  private readonly WALLETS_COLLECTION = "wallets";

  getWallets(): Observable<Wallet[]> {
    const walletsCollection = collection(
      this.firestore,
      this.WALLETS_COLLECTION,
    );
    const q = query(walletsCollection, orderBy("createdAt", "desc"));

    const firestoreWallets$ = new Observable<Wallet[]>((observer) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const wallets = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Wallet,
          );
          observer.next(wallets);
        },
        (error) => {
          console.error("Error fetching wallets from Firestore:", error);
          observer.next([]);
        },
      );

      return () => unsubscribe();
    });

    return combineLatest([
      firestoreWallets$.pipe(startWith([] as Wallet[])),
      of(mockWalletsData),
    ]).pipe(
      map(([firestoreWallets, mockWallets]) => {
        const combined = [...firestoreWallets];
        mockWallets.forEach((mockWallet) => {
          if (!combined.some((w) => w.accountId === mockWallet.accountId)) {
            combined.push(mockWallet);
          }
        });
        return combined;
      }),
    );
  }

  getWalletById(id: string): Observable<Wallet | undefined> {
    const walletDoc = doc(this.firestore, this.WALLETS_COLLECTION, id);
    return from(getDoc(walletDoc)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Wallet;
        }
        return undefined;
      }),
    );
  }

  async createWallet(walletData: Omit<Wallet, "id">): Promise<void> {
    try {
      const walletsCollection = collection(
        this.firestore,
        this.WALLETS_COLLECTION,
      );
      await addDoc(walletsCollection, {
        ...walletData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  updateWallet(id: string, walletData: Partial<Wallet>): Observable<void> {
    const walletDoc = doc(this.firestore, this.WALLETS_COLLECTION, id);
    return from(updateDoc(walletDoc, walletData));
  }

  deleteWallet(id: string): Observable<void> {
    const walletDoc = doc(this.firestore, this.WALLETS_COLLECTION, id);
    return from(deleteDoc(walletDoc));
  }
}
