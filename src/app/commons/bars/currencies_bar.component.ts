import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-currencies-bar",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="currency-container">
      <span class="label">Dólares:</span>
      <span>Compra: L.26.1641</span>
      <span>Venta: L.26.2949</span>
      <div class="divider"></div>
      <span class="label">Euros:</span>
      <span>Compra: L.28.7805</span>
      <span>Venta: L.32.8423</span>
    </div>
  `,
  styles: [
    `
      .currency-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        background-color: #ffffff;
        font-size: 0.875rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #e0e0e0;
      }
      .label {
        font-weight: 500;
        color: #555;
      }
      .divider {
        width: 1px;
        height: 1rem;
        background: #ccc;
        margin: 0 0.5rem;
      }
    `,
  ],
})
export class CurrenciesBarComponent {}
