import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { emptyString } from "@app/resources/constants";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="card"
      [class.hover-shadow]="hoverEffect"
      [ngClass]="customClass"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .card.hover-shadow:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
})
export class CardComponent {
  @Input() hoverEffect: boolean = false;
  @Input() customClass: string = emptyString;
}

@Component({
  selector: "app-card-header",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-header" [ngClass]="customClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .card-header {
        padding: 1.5rem;
        padding-bottom: 1rem;
      }

      @media (max-width: 768px) {
        .card-header {
          padding: 1.25rem;
          padding-bottom: 0.875rem;
        }
      }

      @media (max-width: 480px) {
        .card-header {
          padding: 1rem;
          padding-bottom: 0.75rem;
        }
      }
    `,
  ],
})
export class CardHeaderComponent {
  @Input() customClass: string = emptyString;
}

@Component({
  selector: "app-card-title",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="card-title" [ngClass]="customClass">
      <ng-content></ng-content>
    </h3>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .card-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-color, #1a1a1a);
        margin: 0;
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      h3.card-title {
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      :host ::ng-deep h3 {
        font-family: var(
          --font-family-primary,
          "Poppins",
          sans-serif
        ) !important;
      }

      @media (max-width: 768px) {
        .card-title {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class CardTitleComponent {
  @Input() customClass: string = emptyString;
}

@Component({
  selector: "app-card-content",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-content" [ngClass]="customClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      *:not(i):not([class*="pi-"]):not([class*="fa-"]) {
        font-family: var(--font-family-primary, "Poppins", sans-serif);
      }

      .card-content {
        padding: 0 1.5rem 1.5rem 1.5rem;
      }

      @media (max-width: 768px) {
        .card-content {
          padding: 0 1.25rem 1.25rem 1.25rem;
        }
      }

      @media (max-width: 480px) {
        .card-content {
          padding: 0 1rem 1rem 1rem;
        }
      }
    `,
  ],
})
export class CardContentComponent {
  @Input() customClass: string = emptyString;
}
