import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslationService } from "@app/services/translation.service";
import { LANGUAGE_LABELS } from "@app/resources/constants";

@Component({
  selector: "app-language-switcher",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button
        (click)="switchLanguage('en')"
        [class.active]="t.getCurrentLocale() === 'en'"
        class="lang-btn"
      >
        {{ LANGUAGE_LABELS.EN }}
      </button>
      <button
        (click)="switchLanguage('es')"
        [class.active]="t.getCurrentLocale() === 'es'"
        class="lang-btn"
      >
        {{ LANGUAGE_LABELS.ES }}
      </button>
    </div>
  `,
  styles: [
    `
      .language-switcher {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        gap: 4px;
      }
      .lang-btn {
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s;
      }
      .lang-btn:hover {
        background: #f5f5f5;
      }
      .lang-btn.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
      }
    `,
  ],
})
export class LanguageSwitcherComponent {
  readonly LANGUAGE_LABELS = LANGUAGE_LABELS;
  constructor(public t: TranslationService) {}

  switchLanguage(locale: "en" | "es") {
    this.t.setLocale(locale);
  }
}
