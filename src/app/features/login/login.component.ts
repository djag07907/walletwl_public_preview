import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, filter, map } from "rxjs/operators";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { LoginHeroComponent } from "./components/login-hero.component";
import { LoginFormComponent } from "./components/login-form.component";
import { LanguageSwitcherComponent } from "@app/commons/language-switcher.component";
import { TranslationService } from "@app/services/translation.service";
import * as LoginActions from "./store/login.actions";
import {
  selectIsLoading,
  selectError,
  selectSuccessMessage,
} from "./store/login.selectors";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    LoginHeroComponent,
    LoginFormComponent,
    LanguageSwitcherComponent,
  ],
  providers: [MessageService],
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private translationService: TranslationService,
    private store: Store
  ) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.store
      .select(selectSuccessMessage)
      .pipe(
        takeUntil(this.destroy$),
        filter((message) => !!message)
      )
      .subscribe((message) => {
        this.messageService.add({
          severity: "success",
          summary: "Login exitoso",
          detail: message || "Bienvenido",
        });
      });

    this.error$
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => !!error),
        map((error) => {
          if (error && error.startsWith("login.error_")) {
            return this.translationService.t(error);
          }
          return error || this.translationService.t("login.error_generic");
        })
      )
      .subscribe((translatedError) => {
        this.messageService.add({
          severity: "error",
          summary: this.translationService.t("login.error_title"),
          detail: translatedError,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLoginSubmit(formData: {
    userEmail: string;
    password: string;
    rememberUser: boolean;
  }): void {
    this.store.dispatch(
      LoginActions.loginRequest({
        email: formData.userEmail,
        password: formData.password,
        rememberUser: formData.rememberUser,
      })
    );
  }

  onForgotPassword(): void {
    this.router.navigate(["/forgotPassword"]);
  }
}
