import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { APP_NAME_PREFIX, APP_VERSION } from "@app/resources/constants";

@Component({
  selector: "app-version",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-version">
      <span class="version-text">{{ appNamePrefix }}{{ appVersion }}</span>
    </div>
  `,
  styles: [
    `
      .app-version {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
      }

      .version-text {
        font-size: 0.75rem;
        color: #9ca3af;
        font-weight: 500;
        text-align: center;
      }
    `,
  ],
})
export class AppVersionComponent {
  appNamePrefix = APP_NAME_PREFIX;
  appVersion = APP_VERSION;
}
