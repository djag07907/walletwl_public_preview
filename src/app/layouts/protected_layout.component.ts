import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: "protected-layout",
  template: `
    <div class="protected-layout">
      <div class="protected-content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .protected-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
      }

      .protected-content {
        flex: 1;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }
    `,
  ],
})
export class ProtectedLayoutComponent {}
