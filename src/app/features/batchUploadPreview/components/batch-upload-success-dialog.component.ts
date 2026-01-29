import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CheckCircleIconComponent,
  AlertCircleIconComponent,
  DatabaseIconComponent,
  EyeIconComponent,
  CloudUploadIconComponent,
  InfoCircleIconComponent,
  TrendingUpIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-batch-upload-success-dialog",
  standalone: true,
  imports: [
    CommonModule,
    CheckCircleIconComponent,
    AlertCircleIconComponent,
    DatabaseIconComponent,
    EyeIconComponent,
    CloudUploadIconComponent,
    InfoCircleIconComponent,
    TrendingUpIconComponent,
  ],
  template: `
    <div class="dialog-overlay" *ngIf="isVisible">
      <div class="dialog-container">
        <div class="success-icon-wrapper">
          <div class="success-icon-bg">
            <icon-check-circle
              size="2.5rem"
              color="#10b981"
            ></icon-check-circle>
          </div>
        </div>

        <h2 class="dialog-title">Batch Process Completed</h2>
        <p class="dialog-subtitle">
          Your file <span class="filename">{{ filename }}</span> was processed
          successfully. All records are now available in the system.
        </p>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <icon-check-circle
                size="0.875rem"
                color="#64748b"
              ></icon-check-circle>
              <span class="kpi-label">Successfully Created</span>
            </div>
            <div class="kpi-value">{{ successCount }}</div>
            <div class="kpi-footer success">
              <icon-trending-up size="0.875rem"></icon-trending-up>
              <span>{{ successPercentage }}% SUCCESS</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <icon-alert-circle
                size="0.875rem"
                color="#64748b"
              ></icon-alert-circle>
              <span class="kpi-label">Failures</span>
            </div>
            <div class="kpi-value">{{ failureCount }}</div>
            <div class="kpi-footer neutral">
              <span>{{ errorRate }}% ERROR RATE</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <icon-database size="0.875rem" color="#64748b"></icon-database>
              <span class="kpi-label">Batch Identifier</span>
            </div>
            <div class="kpi-value identifier">{{ batchId }}</div>
            <div class="kpi-footer neutral">
              <span>Processed at {{ processedAt }}</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" (click)="onViewRecords.emit()">
            <icon-eye size="1.125rem" color="#fff"></icon-eye>
            View Uploaded Records
          </button>
          <button class="btn-ghost" (click)="onNewUpload.emit()">
            <icon-cloud-upload
              size="1.125rem"
              color="#2563eb"
            ></icon-cloud-upload>
            Perform Another Upload
          </button>
        </div>

        <div class="system-alert">
          <div class="alert-icon">
            <icon-info-circle size="1.25rem" color="#2563eb"></icon-info-circle>
          </div>
          <div class="alert-content">
            Notifications have been sent to the auditing department regarding
            this batch. You can download the full execution report from the
            <a href="#" class="alert-link" (click)="$event.preventDefault()"
              >Reports</a
            >
            section.
          </div>
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
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        padding: 1.5rem;
      }

      .dialog-container {
        background: white;
        width: 100%;
        max-width: 800px;
        border-radius: 1rem;
        padding: 3.5rem 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        font-family: var(--font-family-primary);
      }

      .success-icon-wrapper {
        margin-bottom: 2rem;
      }

      .success-icon-bg {
        width: 5rem;
        height: 5rem;
        background: #ecfdf5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dialog-title {
        font-size: 2.25rem;
        font-weight: 800;
        color: #1e293b;
        margin: 0 0 1rem 0;
        text-align: center;
      }

      .dialog-subtitle {
        font-size: 1.125rem;
        color: #64748b;
        text-align: center;
        max-width: 500px;
        line-height: 1.6;
        margin: 0 0 3rem 0;

        .filename {
          font-weight: 700;
          font-style: italic;
          color: #1e293b;
        }
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        width: 100%;
        margin-bottom: 3rem;
      }

      .kpi-card {
        background: #ffffff;
        border: 1px solid #f1f5f9;
        border-radius: 0.75rem;
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;

          .kpi-label {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 600;
          }
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.75rem;

          &.identifier {
            font-size: 1.25rem;
            margin-top: 0.5rem;
          }
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          width: fit-content;

          &.success {
            background: #ecfdf5;
            color: #059669;
          }

          &.neutral {
            background: #f1f5f9;
            color: #64748b;
          }
        }
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        width: 100%;
        margin-bottom: 3rem;

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          width: 100%;
          max-width: 300px;
          transition: all 0.2s;
          font-family: var(--font-family-primary);
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);

          &:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
          }
        }

        .btn-ghost {
          background: transparent;
          color: #2563eb;
          border: none;

          &:hover {
            color: #1d4ed8;
            text-decoration: underline;
          }
        }
      }

      .system-alert {
        width: 100%;
        background: #eff6ff;
        border: 1px solid #dbeafe;
        border-radius: 0.5rem;
        padding: 1.25rem;
        display: flex;
        gap: 1rem;
        align-items: center;

        .alert-icon {
          flex-shrink: 0;
        }

        .alert-content {
          font-size: 0.875rem;
          color: #2563eb;
          line-height: 1.5;
          font-weight: 500;
        }

        .alert-link {
          color: #2563eb;
          font-weight: 700;
          text-decoration: underline;
        }
      }
    `,
  ],
})
export class BatchUploadSuccessDialogComponent {
  @Input() isVisible = false;
  @Input() filename = "";
  @Input() successCount = 0;
  @Input() failureCount = 0;
  @Input() batchId = "";
  @Input() processedAt = "";

  @Output() onViewRecords = new EventEmitter<void>();
  @Output() onNewUpload = new EventEmitter<void>();

  get successPercentage(): string {
    const total = this.successCount + this.failureCount;
    if (total === 0) return "0";
    return Math.round((this.successCount / total) * 100).toString();
  }

  get errorRate(): string {
    const total = this.successCount + this.failureCount;
    if (total === 0) return "0";
    return Math.round((this.failureCount / total) * 100).toString();
  }
}
