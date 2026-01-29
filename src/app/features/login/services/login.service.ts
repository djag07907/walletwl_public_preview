import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, doc, getDoc } from "@angular/fire/firestore";
import { LoginRequest } from "@features/login/models/login-request.model";
import { LoginResponse } from "@features/login/models/login-response.model";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      ),
    ).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;
        const token = await user.getIdToken();

        let role = undefined;
        let municipalityId = undefined;
        let name = user.displayName || user.email?.split("@")[0];

        try {
          const userDocRef = doc(this.firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            role = userData["role"];
            municipalityId = userData["municipalityId"];
            if (userData["firstName"] && userData["lastName"]) {
              name = `${userData["firstName"]} ${userData["lastName"]}`;
            }
          }
        } catch (error) {
          console.error("Error fetching user details from Firestore:", error);
        }

        const response: LoginResponse = {
          data: {
            email: user.email || credentials.email,
            token: token,
            expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
            name: name,
            role: role,
            municipalityId: municipalityId,
          },
          code: 200,
          lang: "en",
          message: "Login successful",
        };

        return response;
      }),
    );
  }
}
