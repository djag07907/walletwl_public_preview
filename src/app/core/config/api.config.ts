import { API_CONFIG as BASE_CONFIG } from "@app/resources/api.constants";

export const AUTH_CONFIG = {
  baseUrl: "/api", // Use proxy to avoid CORS issues in development
  Bundle: "com.nucodiga.DEV_RouteCommerce",
  SecretKey: "34ae556c-e977-4c70-a521-70fbbbd76c5d",
  ApiVersion: "1.0",
  version: "1",
};

export { BASE_CONFIG as API_CONFIG };

export const API_ENDPOINTS = {
  login: `/users/v${AUTH_CONFIG.version}/Auth`,
};
