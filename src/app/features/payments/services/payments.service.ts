import { Injectable, inject } from "@angular/core";
import {
  Firestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
} from "@angular/fire/firestore";
import { from, Observable, map, combineLatest, of, startWith } from "rxjs";
import { Payment, mockPaymentsData } from "../payments.mock";

@Injectable({
  providedIn: "root",
})
export class PaymentsService {
  private firestore = inject(Firestore);
  private readonly COLLECTION_NAME = "payments";

  getPayments(): Observable<Payment[]> {
    const paymentsCollection = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(paymentsCollection, orderBy("paymentDate", "desc"));

    const firestorePayments$ = new Observable<Payment[]>((observer) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const payments = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              amount: Number(data["amount"] || 0),
            } as Payment;
          });
          observer.next(payments);
        },
        (error) => {
          console.error("Error fetching payments from Firestore:", error);
          observer.next([]);
        },
      );
      return () => unsubscribe();
    });

    return combineLatest([
      firestorePayments$.pipe(startWith([] as Payment[])),
      of(mockPaymentsData),
    ]).pipe(
      map(([firestorePayments, mockPayments]) => {
        return [...firestorePayments, ...mockPayments];
      }),
    );
  }

  getPaymentById(id: string): Observable<Payment | undefined> {
    const mockPayment = mockPaymentsData.find((p) => p.id === id);
    if (mockPayment) {
      return of(mockPayment);
    }
    const paymentDoc = doc(this.firestore, this.COLLECTION_NAME, id);
    return from(getDoc(paymentDoc)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as Payment;
        }
        return undefined;
      }),
    );
  }

  async createPayment(paymentData: Omit<Payment, "id">): Promise<void> {
    try {
      const paymentsCollection = collection(
        this.firestore,
        this.COLLECTION_NAME,
      );
      await addDoc(paymentsCollection, {
        ...paymentData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  async updatePayment(
    id: string,
    paymentData: Partial<Payment>,
  ): Promise<void> {
    try {
      if (mockPaymentsData.some((p) => p.id === id)) {
        console.warn(
          "Attempted to update a mock payment in Firestore. Mock updates are currently UI-only.",
        );
        return;
      }

      const paymentDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      await updateDoc(paymentDoc, {
        ...paymentData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  }

  async deletePayment(id: string): Promise<void> {
    try {
      if (mockPaymentsData.some((p) => p.id === id)) {
        console.warn(
          "Attempted to delete a mock payment. Mock deletions are not supported.",
        );
        return;
      }

      const paymentDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      await deleteDoc(paymentDoc);
    } catch (error) {
      console.error("Error deleting payment:", error);
      throw error;
    }
  }
}
