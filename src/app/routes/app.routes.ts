import { Routes } from "@angular/router";

import { HomeComponent } from "@app/features/home/home.component";
import { DashboardComponent } from "@app/features/dashboard/dashboard.component";
import { UsersComponent } from "@app/features/users/users.component";
import { SettingsComponent } from "@app/features/settings/settings.component";
import { ProfileComponent } from "@app/features/profile/profile.component";
import { authGuard } from "@app/core/guards/auth.guard";
import {
  superAdminGuard,
  municipalityGuard,
} from "@app/core/guards/role.guard";
import { PublicLayoutComponent } from "@app/layouts/public_layout.component";
import { LoginComponent } from "@app/features/login/login.component";
import { ProtectedLayoutComponent } from "@app/layouts/protected_layout.component";
import { TestComponent } from "@app/features/test/test.component";
import { ForgotPasswordComponent } from "@app/features/forgotPassword/forgot-password.component";
import { CreatePasswordComponent } from "@app/features/createPassword/create-password.component";
import { UserFormComponent } from "@app/features/users/components/user-form.component";
import { BillingRecordsComponent } from "@app/features/billingRecords/billing_records.component";
import { BillingRecordFormComponent } from "@app/features/billingRecords/components/billing_record-form.component";
import { BatchUploadComponent } from "@app/features/batchUpload/batch-upload.component";
import { CollectorsComponent } from "@app/features/collectors/collectors.component";
import { CollectorFormComponent } from "@app/features/collectors/components/collectors-form.component";
import { WalletsComponent } from "@app/features/wallets/wallets.component";
import { WalletFormComponent } from "@app/features/wallets/components/wallets-form.component";
import { MunicipalitiesComponent } from "@app/features/municipalities/municipalities.component";
import { MunicipalityFormComponent } from "@app/features/municipalities/components/municipalities-form.component";
import { PaymentsComponent } from "@app/features/payments/payments.component";
import { PaymentsDetailComponent } from "@app/features/paymentsDetail/payments-detail.component";
import { SuperAdminPortalComponent } from "@app/features/super-admin-portal/super-admin-portal.component";
import { BatchUploadPreviewComponent } from "@app/features/batchUploadPreview/batch-upload-preview.component";
import { ManualRechargeComponent } from "@app/features/manualRecharge/manual_recharge.component";
import { ChargesTypesComponent } from "@app/features/chargesTypes/charges_types.component";
import { ChargeCategoriesComponent } from "@app/features/chargeCategories/charge_categories.component";
import { ChargeTypesFormComponent } from "@app/features/chargesTypes/components/charge-types-form.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      {
        path: "login",
        loadComponent: () => LoginComponent,
      },
      {
        path: "forgotPassword",
        loadComponent: () => ForgotPasswordComponent,
      },
      {
        path: "createPassword",
        loadComponent: () => CreatePasswordComponent,
      },
    ],
  },
  {
    path: "super-admin-portal",
    component: ProtectedLayoutComponent,
    canActivate: [authGuard, superAdminGuard],
    children: [
      {
        path: "",
        loadComponent: () => SuperAdminPortalComponent,
      },
    ],
  },
  {
    path: "home",
    component: ProtectedLayoutComponent,
    canActivate: [authGuard, municipalityGuard],
    children: [
      {
        path: "",
        loadComponent: () => HomeComponent,
        children: [
          {
            path: "",
            redirectTo: "dashboard",
            pathMatch: "full",
          },
          {
            path: "dashboard",
            loadComponent: () => DashboardComponent,
          },
          {
            path: "billing_records",
            loadComponent: () => BillingRecordsComponent,
          },
          {
            path: "billing_records/add",
            loadComponent: () => BillingRecordFormComponent,
          },
          {
            path: "billing_records/batch-upload",
            loadComponent: () => BatchUploadComponent,
          },
          {
            path: "billing_records/batch-upload/preview",
            loadComponent: () => BatchUploadPreviewComponent,
          },
          {
            path: "billing_records/edit/:id",
            loadComponent: () => BillingRecordFormComponent,
          },
          {
            path: "collectors",
            loadComponent: () => CollectorsComponent,
          },
          {
            path: "collectors/add",
            loadComponent: () => CollectorFormComponent,
          },
          {
            path: "collectors/edit/:id",
            loadComponent: () => CollectorFormComponent,
          },
          {
            path: "wallets",
            loadComponent: () => WalletsComponent,
          },
          {
            path: "wallets/add",
            loadComponent: () => WalletFormComponent,
          },
          {
            path: "wallets/edit/:id",
            loadComponent: () => WalletFormComponent,
          },
          {
            path: "municipalities",
            loadComponent: () => MunicipalitiesComponent,
          },
          {
            path: "municipalities/add",
            loadComponent: () => MunicipalityFormComponent,
          },
          {
            path: "municipalities/edit/:id",
            loadComponent: () => MunicipalityFormComponent,
          },
          {
            path: "manual-recharge",
            loadComponent: () => ManualRechargeComponent,
          },
          {
            path: "charge-types",
            loadComponent: () => ChargesTypesComponent,
          },
          {
            path: "charge-types/add",
            loadComponent: () => ChargeTypesFormComponent,
          },
          // TODO: Habilitar cuando se implemente
          // {
          //   path: "charge-types/edit/:id",
          //   loadComponent: () =>ChargeTypesFormComponent,
          // },
          {
            path: "charge-categories",
            loadComponent: () => ChargeCategoriesComponent,
          },

          {
            path: "payments",
            loadComponent: () => PaymentsComponent,
          },
          {
            path: "payments/detail/:id",
            loadComponent: () => PaymentsDetailComponent,
          },
          // TODO: Habilitar cuando se implemente
          // {
          //   path: "payments/add",
          //   loadComponent: () => PaymentFormComponent,
          // },
          // {
          //   path: "payments/edit/:id",
          //   loadComponent: () => PaymentFormComponent,
          // },
          // {
          //   path: "reports_bi",
          //   loadComponent: () => ReportsBiComponent,
          // },
          // {
          //   path: "reports_bi/add",
          //   loadComponent: () => ReportsBiFormComponent,
          // },
          // {
          //   path: "reports_bi/edit/:id",
          //   loadComponent: () => ReportsBiFormComponent,
          // },
          {
            path: "users",
            loadComponent: () => UsersComponent,
          },
          {
            path: "users/add",
            loadComponent: () => UserFormComponent,
          },
          {
            path: "users/edit/:id",
            loadComponent: () => UserFormComponent,
          },
          {
            path: "settings",
            loadComponent: () => SettingsComponent,
          },
          {
            path: "profile",
            loadComponent: () => ProfileComponent,
          },
        ],
      },
    ],
  },
  {
    path: "test",
    component: ProtectedLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "",
        loadComponent: () => TestComponent,
        children: [
          {
            path: "",
            redirectTo: "dashboard",
            pathMatch: "full",
          },
        ],
      },
    ],
  },
  {
    path: "**",
    redirectTo: "login",
  },
];
export default routes;
