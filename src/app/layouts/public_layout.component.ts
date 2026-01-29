import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: "public-layout",
  template: `
    <div class="public-layout">
      <div class="public-content">
        <router-outlet />
      </div>
    </div>
  `,
})
export class PublicLayoutComponent {}
