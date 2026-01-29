import { Injectable } from "@angular/core";
import { PrimeNG } from "primeng/config";

@Injectable({
  providedIn: "root",
})
export class PrimeNgConfigService {
  constructor(private primengConfig: PrimeNG) {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    // TODO: Agregar configuración específica de PrimeNG si es necesario
  }

  switchTheme(theme: string): void {
    const themeElement = document.getElementById("theme-css");
    if (themeElement) {
      themeElement.setAttribute(
        "href",
        `node_modules/primeng/resources/themes/${theme}/theme.css`
      );
    }
  }

  setInputVariant(variant: "outlined" | "filled"): void {
    this.primengConfig.inputVariant.set(variant);
  }

  setInputStyle(style: "outlined" | "filled"): void {
    this.primengConfig.inputStyle.set(style);
  }

  toggleRipple(enable: boolean): void {
    this.primengConfig.ripple.set(enable);
  }
}
