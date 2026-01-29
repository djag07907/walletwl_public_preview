import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
  {
    path: "home/billing_records/edit/:id",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/billing_records/add",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/collectors/edit/:id",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/collectors/add",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/wallets/edit/:id",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/wallets/add",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/municipalities/edit/:id",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/municipalities/add",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/payments/detail/:id",
    renderMode: RenderMode.Server,
  },
  // TODO: Habilitar cuando se implemente
  // {
  //   path: "home/payments/edit/:id",
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   path: "home/payments/add",
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   path: "home/reports_bi/edit/:id",
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   path: "home/reports_bi/add",
  //   renderMode: RenderMode.Server,
  // },
  {
    path: "home/users/edit/:id",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/users/add",
    renderMode: RenderMode.Server,
  },
  {
    path: "home/profile",
    renderMode: RenderMode.Server,
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
