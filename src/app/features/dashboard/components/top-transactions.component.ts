import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface TransactionData {
  name: string;
  sales: string;
  orders: number;
}

@Component({
  selector: "app-top-transactions",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-container">
      <div
        *ngFor="let transaction of transactions; let item = index"
        class="transaction-item"
      >
        <div class="transaction-header">
          <div class="transaction-info">
            <div class="transaction-badge">{{ item + 1 }}</div>
            <div class="transaction-details">
              <p class="transaction-name">{{ transaction.name }}</p>
              <p class="transaction-orders">
                {{ transaction.orders }} {{ ordersLabel }}
              </p>
            </div>
          </div>
          <p class="transaction-sales">{{ transaction.sales }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      * {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .transactions-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .transaction-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .transaction-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .transaction-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 0;
      }

      .transaction-badge {
        height: 2rem;
        width: 2rem;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--primary-color, #3b82f6);
        flex-shrink: 0;
      }

      .transaction-details {
        flex: 1;
        min-width: 0;
      }

      .transaction-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .transaction-orders {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
      }

      .transaction-sales {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        white-space: nowrap;
        margin-left: 0.5rem;
        flex-shrink: 0;
      }
    `,
  ],
})
export class TopTransactionsComponent {
  @Input() transactions: TransactionData[] = [];
  @Input() ordersLabel: string = "orders";
}
