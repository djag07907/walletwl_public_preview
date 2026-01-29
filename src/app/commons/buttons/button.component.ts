import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      * {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
        outline: none;
        white-space: nowrap;
      }

      button:focus-visible {
        outline: 2px solid var(--primary-color, #3b82f6);
        outline-offset: 2px;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-primary {
        background: var(--primary-color, #3b82f6);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: var(--primary-hover, #2563eb);
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #e5e7eb;
        color: var(--text-color, #1a1a1a);
      }

      .btn-outline:hover:not(:disabled) {
        background: #f9fafb;
      }

      .btn-ghost {
        background: transparent;
        color: var(--text-color, #1a1a1a);
      }

      .btn-ghost:hover:not(:disabled) {
        background: #f9fafb;
      }

      .btn-sm {
        padding: 0.5rem 0.875rem;
        font-size: 0.875rem;
      }

      .btn-md {
        padding: 0.625rem 1rem;
        font-size: 0.9375rem;
      }

      .btn-lg {
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
      }

      @media (max-width: 768px) {
        .btn-md {
          padding: 0.5rem 0.875rem;
          font-size: 0.875rem;
        }

        .btn-lg {
          padding: 0.625rem 1rem;
          font-size: 0.9375rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        button {
          transition: none;
        }
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() variant: "primary" | "outline" | "ghost" = "primary";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() disabled: boolean = false;
  @Input() customClass: string = emptyString;
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.customClass,
    ];
    return classes.filter((c) => c).join(" ");
  }

  handleClick(event: Event): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
