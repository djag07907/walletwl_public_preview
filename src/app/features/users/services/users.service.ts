import { Injectable, inject } from "@angular/core";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  setDoc,
  onSnapshot,
  orderBy,
} from "@angular/fire/firestore";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
} from "@angular/fire/auth";
import { initializeApp } from "firebase/app";
import {
  from,
  Observable,
  map,
  switchMap,
  of,
  combineLatest,
  startWith,
} from "rxjs";
import { User, mockUsersData } from "../users.mock";
import { FIREBASE_CONFIG } from "@app/core/config/firebase.config";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private firestore = inject(Firestore);
  private mainAuth = inject(Auth);

  private secondaryApp = initializeApp(
    FIREBASE_CONFIG,
    "SecondaryUserCreation",
  );
  private secondaryAuth = getAuth(this.secondaryApp);

  private readonly USERS_COLLECTION = "users";

  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, this.USERS_COLLECTION);
    // Removed orderBy - sorting in memory instead

    const firestoreUsers$ = new Observable<User[]>((observer) => {
      const unsubscribe = onSnapshot(
        usersCollection,
        (snapshot) => {
          const users = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as User,
          );
          // Sort by email in memory
          users.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
          observer.next(users);
        },
        (error) => {
          console.error("Error fetching users from Firestore:", error);
          observer.next([]); // Emit empty array on error to prevent hang
        },
      );

      return () => unsubscribe();
    });

    return combineLatest([
      firestoreUsers$.pipe(startWith([] as User[])),
      of(mockUsersData),
    ]).pipe(
      map(([firestoreUsers, mockUsers]) => {
        // Clean duplicates if any (by email)
        const combined = [...firestoreUsers];
        mockUsers.forEach((mockUser) => {
          if (!combined.some((u) => u.email === mockUser.email)) {
            combined.push(mockUser);
          }
        });
        return combined;
      }),
    );
  }

  getUserById(id: string): Observable<User | undefined> {
    const userDoc = doc(this.firestore, this.USERS_COLLECTION, id);
    return from(getDoc(userDoc)).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as User;
        }
        return undefined;
      }),
    );
  }

  async createUser(userData: any): Promise<void> {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      municipalityId,
      status,
    } = userData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.secondaryAuth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      const userRef = doc(this.firestore, this.USERS_COLLECTION, uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        role,
        municipalityId,
        status,
        createdAt: new Date().toISOString(),
      });

      await this.secondaryAuth.signOut();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  updateUser(id: string, userData: Partial<User>): Observable<void> {
    const userDoc = doc(this.firestore, this.USERS_COLLECTION, id);
    return from(updateDoc(userDoc, userData));
  }
}
