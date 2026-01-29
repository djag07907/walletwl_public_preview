import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  LockIconComponent,
  ClockIconComponent,
  DatabaseIconComponent,
  AlertTriangleIconComponent,
  ArrowRightIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-batch-processing-dialog",
  standalone: true,
  imports: [
    CommonModule,
    LockIconComponent,
    ClockIconComponent,
    DatabaseIconComponent,
    AlertTriangleIconComponent,
    ArrowRightIconComponent,
  ],
  template: `
    <div class="dialog-overlay" *ngIf="isVisible">
      <div class="dialog-container">
        <div class="secure-badge">
          <icon-lock size="0.75rem" color="#3b82f6"></icon-lock>
          <span>SECURE PROCESSING</span>
        </div>

        <h2 class="dialog-title">Batch Upload in Progress</h2>
        <p class="dialog-subtitle">Batch ID: {{ batchId }}</p>

        <div class="critical-alert">
          <div class="alert-icon-wrapper">
            <icon-alert-triangle
              size="1.25rem"
              color="#fff"
            ></icon-alert-triangle>
          </div>
          <div class="alert-content">
            <h4 class="alert-title">CRITICAL: DO NOT CLOSE THIS WINDOW</h4>
            <p class="alert-desc">
              Closing this window or refreshing the page may result in duplicate
              entries or corrupted financial data.
            </p>
          </div>
        </div>

        <div class="progress-section">
          <div class="status-header">
            <span class="current-status">
              Processing Record {{ currentRecord() }} of {{ totalRecords }}...
            </span>
            <span class="percentage">{{ progress() }}%</span>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar-fill" [style.width.%]="progress()"></div>
          </div>

          <div class="status-footer">
            <div class="footer-item">
              <icon-clock size="0.875rem" color="#64748b"></icon-clock>
              <span>Estimated time remaining: ~{{ estimatedTime() }}</span>
            </div>
            <div class="footer-item">
              <icon-database size="0.875rem" color="#64748b"></icon-database>
              <span>Validation: <span class="active-text">Active</span></span>
            </div>
          </div>
        </div>

        <div class="logs-container" #logScroll>
          <div class="log-entry" *ngFor="let log of logs()">
            <span class="log-timestamp">[{{ log.time }}]</span>
            <span class="log-message" [ngClass]="log.type">{{
              log.message
            }}</span>
          </div>
          <div class="log-cursor" *ngIf="progress() < 100">_</div>
        </div>

        <div class="dialog-footer">
          <div class="secure-info">
            <div class="indicator"></div>
            <span>System encrypted & secure</span>
          </div>
          <a href="#" class="support-link" (click)="$event.preventDefault()">
            Contact Support
            <icon-arrow-right
              size="0.875rem"
              color="#3b82f6"
            ></icon-arrow-right>
          </a>
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
        max-width: 600px;
        border-radius: 1.5rem;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        font-family: var(--font-family-primary);
      }

      .secure-badge {
        background: #eff6ff;
        padding: 0.375rem 0.75rem;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;

        span {
          font-size: 0.625rem;
          font-weight: 800;
          color: #1e40af;
          letter-spacing: 0.05em;
        }
      }

      .dialog-title {
        font-size: 1.875rem;
        font-weight: 800;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
        text-align: center;
      }

      .dialog-subtitle {
        font-size: 0.9375rem;
        color: #64748b;
        margin: 0 0 2rem 0;
        font-weight: 500;
      }

      .critical-alert {
        width: 100%;
        background: #f59e0b;
        border-radius: 0.75rem;
        padding: 1.25rem;
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        color: white;

        .alert-icon-wrapper {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-title {
          font-size: 0.9375rem;
          font-weight: 800;
          margin: 0 0 0.25rem 0;
          letter-spacing: 0.025em;
        }

        .alert-desc {
          font-size: 0.8125rem;
          opacity: 0.95;
          margin: 0;
          line-height: 1.4;
        }
      }

      .progress-section {
        width: 100%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;

          .current-status {
            font-size: 0.9375rem;
            font-weight: 700;
            color: #1e293b;
          }

          .percentage {
            font-size: 1.5rem;
            font-weight: 800;
            color: #2563eb;
          }
        }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1.25rem;

          .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
            transition: width 0.3s ease-out;
            border-radius: 4px;
          }
        }

        .status-footer {
          display: flex;
          justify-content: space-between;

          .footer-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8125rem;
            color: #64748b;
            font-weight: 600;

            .active-text {
              color: #10b981;
            }
          }
        }
      }

      .logs-container {
        width: 100%;
        height: 150px;
        background: #0f172a;
        border-radius: 0.75rem;
        padding: 1rem;
        overflow-y: auto;
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-track {
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }

        .log-entry {
          font-family: "Courier New", Courier, monospace;
          font-size: 0.75rem;
          line-height: 1.4;

          .log-timestamp {
            color: #10b981;
            margin-right: 0.75rem;
          }

          .log-message {
            color: #cbd5e1;

            &.success {
              color: #10b981;
            }
            &.info {
              color: #3b82f6;
            }
            &.warning {
              color: #f59e0b;
            }
          }
        }

        .log-cursor {
          color: #cbd5e1;
          animation: blink 1s infinite;
        }
      }

      .dialog-footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1.5rem;
        border-top: 1px solid #f1f5f9;

        .secure-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: #64748b;
          font-weight: 500;

          .indicator {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          }
        }

        .support-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
    `,
  ],
})
export class BatchProcessingDialogComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() isVisible: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() batchId: string =
    "MUNI-" +
    new Date().getFullYear() +
    "-10-24-X" +
    Math.floor(Math.random() * 100);
  @Output() onComplete = new EventEmitter<void>();

  currentRecord = signal(0);
  progress = signal(0);
  logs = signal<{ time: string; message: string; type: string }[]>([]);
  estimatedTime = signal("~3 minutes");

  private simulationInterval: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes["isVisible"]) {
      if (this.isVisible) {
        this.resetSimulation();
        this.startSimulation();
      } else {
        this.stopSimulation();
      }
    }
  }

  ngOnInit() {
    if (this.isVisible) {
      this.startSimulation();
    }
  }

  ngOnDestroy() {
    this.stopSimulation();
  }

  resetSimulation() {
    this.currentRecord.set(0);
    this.progress.set(0);
    this.logs.set([]);
    this.estimatedTime.set("~3 minutes");
  }

  startSimulation() {
    this.stopSimulation();

    const duration = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
    const steps = Math.min(this.totalRecords, 50);
    const intervalTime = duration / steps;

    let step = 0;
    this.addLog("Initializing batch secure connection...", "info");

    this.simulationInterval = setInterval(() => {
      step++;
      const currentRec = Math.min(
        Math.floor((step / steps) * this.totalRecords),
        this.totalRecords,
      );
      this.currentRecord.set(currentRec);

      const currentProgress = Math.floor((step / steps) * 100);
      this.progress.set(currentProgress);

      if (currentProgress < 30) this.estimatedTime.set("~2 minutes");
      else if (currentProgress < 70) this.estimatedTime.set("~45 seconds");
      else if (currentProgress < 100) this.estimatedTime.set("~10 seconds");

      if (step % 5 === 0) {
        this.addLog(
          `Record ${currentRec}: Processing municipal fee allocation...`,
          "info",
        );
      } else if (step % 8 === 0) {
        this.addLog(
          `Record ${currentRec}: Property tax record synchronized.`,
          "success",
        );
      } else if (step % 12 === 0) {
        this.addLog(
          `Record ${currentRec}: Payment validated successfully.`,
          "success",
        );
      }

      if (step >= steps) {
        this.stopSimulation();
        this.addLog("Batch processing completed successfully.", "success");
        this.addLog("Synchronizing local database...", "info");

        setTimeout(() => {
          this.onComplete.emit();
        }, 1000);
      }
    }, intervalTime);
  }

  private stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private addLog(message: string, type: "info" | "success" | "warning") {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    this.logs.update((current) => [
      ...current,
      { time: timeStr, message, type },
    ]);
  }
}
