import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface ActivityData {
  action: string;
  entity: string;
  time: string;
  amount: string;
  status: "pending" | "completed" | "new";
}

@Component({
  selector: "app-activity-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activity-container">
      <div *ngFor="let activity of activities" class="activity-item">
        <div class="activity-content">
          <div
            class="status-dot"
            [class.pending]="activity.status === 'pending'"
            [class.new]="activity.status === 'new'"
            [class.completed]="activity.status === 'completed'"
          ></div>
          <div class="activity-info">
            <p class="activity-action">{{ activity.action }}</p>
            <p class="activity-entity">{{ activity.entity }}</p>
          </div>
        </div>
        <div class="activity-meta">
          <p class="activity-amount">{{ activity.amount }}</p>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      * {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .activity-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .activity-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem 0.75rem;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.2s ease;
        margin: 0 -0.75rem;
        border-radius: 0.5rem;
      }

      .activity-item:last-child {
        border-bottom: none;
      }

      .activity-item:hover {
        background-color: rgba(249, 250, 251, 0.5);
      }

      .activity-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
        min-width: 0;
      }

      .status-dot {
        height: 0.5rem;
        width: 0.5rem;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-dot.pending {
        background-color: #f97316;
      }

      .status-dot.new {
        background-color: #3b82f6;
      }

      .status-dot.completed {
        background-color: #10b981;
      }

      .activity-info {
        flex: 1;
        min-width: 0;
      }

      .activity-action {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        line-height: 1.4;
      }

      .activity-entity {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .activity-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding-left: 1.25rem;
      }

      .activity-amount {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-color, #1a1a1a);
        margin: 0;
      }

      .activity-time {
        font-size: 0.75rem;
        color: #6b7280;
        white-space: nowrap;
      }

      @media (min-width: 640px) {
        .activity-item {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .activity-content {
          gap: 1rem;
        }

        .activity-meta {
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          padding-left: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .activity-item {
          transition: none;
        }
      }
    `,
  ],
})
export class ActivityListComponent {
  @Input() activities: ActivityData[] = [];
}
