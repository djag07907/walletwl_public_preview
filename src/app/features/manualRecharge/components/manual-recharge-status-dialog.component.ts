import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslationService } from "@app/services/translation.service";
import {
  CheckCircleIconComponent,
  AlertCircleIconComponent,
  HistoryIconComponent,
  XIconComponent,
} from "@app/shared/components/icons/icons.component";
import { Adjustment } from "../services/manual-recharge.service";

@Component({
  selector: "app-manual-recharge-status-dialog",
  standalone: true,
  imports: [
    CommonModule,
    CheckCircleIconComponent,
    AlertCircleIconComponent,
    HistoryIconComponent,
    XIconComponent,
  ],
  template: `
    <div class="dialog-overlay" *ngIf="isVisible">
      <div class="dialog-container" [class.error]="type === 'error'">
        <button class="close-btn" (click)="onClose.emit()">
          <icon-x size="1.25rem" color="#64748b"></icon-x>
        </button>

        <div class="status-icon-wrapper">
          <div class="status-icon-bg">
            <icon-check-circle
              *ngIf="type === 'success'"
              size="2.5rem"
              color="#10b981"
            ></icon-check-circle>
            <icon-alert-circle
              *ngIf="type === 'error'"
              size="2.5rem"
              color="#ef4444"
            ></icon-alert-circle>
          </div>
        </div>

        <h2 class="dialog-title">
          {{
            type === "success"
              ? translationService.t(
                  "manual_recharge.status_dialog.applied_title"
                )
              : translationService.t(
                  "manual_recharge.status_dialog.failed_title"
                )
          }}
        </h2>
        <p class="dialog-subtitle">
          {{
            type === "success"
              ? translationService.t(
                  "manual_recharge.status_dialog.applied_desc"
                )
              : translationService.t(
                  "manual_recharge.status_dialog.failed_desc"
                )
          }}
        </p>

        <div class="details-card" *ngIf="adjustment">
          <div class="detail-item">
            <span class="detail-label">{{
              translationService.t("manual_recharge.status_dialog.wallet_id")
            }}</span>
            <span class="detail-value highlight">{{
              adjustment.walletId
            }}</span>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-item">
            <span class="detail-label">{{
              translationService.t(
                "manual_recharge.status_dialog.adjustment_type"
              )
            }}</span>
            <span class="detail-badge" [class]="adjustment.type.toLowerCase()">
              {{
                translationService.t(
                  "manual_recharge." +
                    (adjustment.type === "ADD" ? "add_funds" : "subtract")
                )
              }}
            </span>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-item">
            <span class="detail-label">{{
              translationService.t("manual_recharge.status_dialog.amount")
            }}</span>
            <span
              class="detail-value amount"
              [class]="adjustment.type.toLowerCase()"
            >
              {{ adjustment.type === "ADD" ? "+" : "-" }}Q.
              {{ adjustment.amount | number: "1.2-2" }}
            </span>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-item">
            <span class="detail-label">{{
              translationService.t("manual_recharge.status_dialog.timestamp")
            }}</span>
            <span class="detail-value">{{ adjustment.createdAt }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" (click)="onClose.emit()">
            {{
              type === "success"
                ? translationService.t(
                    "manual_recharge.status_dialog.understood"
                  )
                : translationService.t(
                    "manual_recharge.status_dialog.try_again"
                  )
            }}
          </button>
          <button
            *ngIf="type === 'success'"
            class="btn-ghost"
            (click)="onViewHistory.emit()"
          >
            <icon-history size="1rem"></icon-history>
            {{
              translationService.t("manual_recharge.status_dialog.view_history")
            }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1.5rem;
      }

      .dialog-container {
        background: white;
        width: 100%;
        max-width: 440px;
        border-radius: 1.25rem;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: dialog-appear 0.3s ease-out;

        &.error {
          .status-icon-bg {
            background: #fef2f2;
          }
          .btn-primary {
            background: #ef4444;
            &:hover {
              background: #dc2626;
            }
          }
        }
      }

      @keyframes dialog-appear {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .close-btn {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: background 0.2s;
        &:hover {
          background: #f1f5f9;
        }
      }

      .status-icon-wrapper {
        margin-bottom: 1.5rem;
      }

      .status-icon-bg {
        width: 4.5rem;
        height: 4.5rem;
        background: #ecfdf5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dialog-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
        text-align: center;
      }

      .dialog-subtitle {
        font-size: 0.9375rem;
        color: #64748b;
        text-align: center;
        line-height: 1.5;
        margin: 0 0 2rem 0;
      }

      .details-card {
        width: 100%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        margin-bottom: 2rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;

        .detail-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .detail-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;

          &.highlight {
            color: #2563eb;
          }

          &.amount {
            &.add {
              color: #059669;
            }
            &.subtract {
              color: #dc2626;
            }
          }
        }

        .detail-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 2rem;

          &.add {
            background: #d1fae5;
            color: #065f46;
          }
          &.subtract {
            background: #fee2e2;
            color: #991b1b;
          }
        }
      }

      .detail-divider {
        height: 1px;
        background: #e2e8f0;
        width: 100%;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 0.75rem;

        button {
          padding: 0.875rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: inherit;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          border: none;
          &:hover {
            background: #1d4ed8;
          }
        }

        .btn-ghost {
          background: transparent;
          color: #64748b;
          border: none;
          &:hover {
            background: #f1f5f9;
            color: #1e293b;
          }
        }
      }
    `,
  ],
})
export class ManualRechargeStatusDialogComponent {
  @Input() isVisible = false;
  @Input() type: "success" | "error" = "success";
  @Input() adjustment: Adjustment | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onViewHistory = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}
}
