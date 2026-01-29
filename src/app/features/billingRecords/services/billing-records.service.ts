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
  setDoc,
} from "@angular/fire/firestore";
import { from, Observable, map, combineLatest, of, startWith } from "rxjs";
import { BillingRecord, mockBillingRecordsData } from "../billing_records.mock";

@Injectable({
  providedIn: "root",
})
export class BillingRecordsService {
  private firestore = inject(Firestore);
  private readonly COLLECTION_NAME = "billing_records";

  /**
   * Returns an observable that combines real-time Firestore data with mock data.
   */
  getBillingRecords(): Observable<BillingRecord[]> {
    const billingCollection = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(billingCollection, orderBy("createdAt", "desc"));

    const firestoreRecords$ = new Observable<BillingRecord[]>((observer) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const records = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: doc.id,
              amount: Number(data["amount"] || 0),
            } as BillingRecord;
          });
          observer.next(records);
        },
        (error) => {
          console.error(
            "Error fetching billing records from Firestore:",
            error,
          );
          observer.next([]); // Retorna un array vacío en caso de error
        },
      );
      return () => unsubscribe();
    });

    return combineLatest([
      firestoreRecords$.pipe(startWith([] as BillingRecord[])),
      of(mockBillingRecordsData),
    ]).pipe(
      map(([firestoreRecords, mockRecords]) => {
        // TODO: Combina los registros, manteniendo los registros de mock como base.
        // TODO: Eliminar mocks post integración completa
        return [...firestoreRecords, ...mockRecords];
      }),
    );
  }

  getBillingRecordById(id: string): Observable<BillingRecord | undefined> {
    const mockRecord = mockBillingRecordsData.find((r) => r.id === id);
    if (mockRecord) {
      return of(mockRecord);
    }
    const recordDoc = doc(this.firestore, this.COLLECTION_NAME, id);
    return from(getDoc(recordDoc)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as BillingRecord;
        }
        return undefined;
      }),
    );
  }

  async createBillingRecord(
    recordData: Omit<BillingRecord, "id">,
  ): Promise<void> {
    try {
      const billingCollection = collection(
        this.firestore,
        this.COLLECTION_NAME,
      );
      await addDoc(billingCollection, {
        ...recordData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating billing record:", error);
      throw error;
    }
  }

  async updateBillingRecord(
    id: string,
    recordData: Partial<BillingRecord>,
  ): Promise<void> {
    try {
      if (mockBillingRecordsData.some((r) => r.id === id)) {
        console.warn(
          "Attempted to update a mock record in Firestore. Mock updates are currently UI-only.",
        );
        return;
      }

      const recordDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      await updateDoc(recordDoc, {
        ...recordData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating billing record:", error);
      throw error;
    }
  }

  async deleteBillingRecord(id: string): Promise<void> {
    try {
      if (mockBillingRecordsData.some((r) => r.id === id)) {
        console.warn(
          "Attempted to delete a mock record. Mock deletions are not supported.",
        );
        return;
      }

      const recordDoc = doc(this.firestore, this.COLLECTION_NAME, id);
      await deleteDoc(recordDoc);
    } catch (error) {
      console.error("Error deleting billing record:", error);
      throw error;
    }
  }
}
