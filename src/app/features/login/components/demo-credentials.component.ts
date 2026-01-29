import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-demo-credentials",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-credentials">
      <p class="demo-title">Demo Credentials:</p>
      <div class="demo-list">
        <p>Admin: admin&#64;company.com / Admin123!</p>
        <p>Manager: manager&#64;company.com / Manager123&#64;</p>
        <p>Supervisor: supervisor&#64;company.com / Super123#</p>
        <p>Dispatcher: dispatcher&#64;company.com / Dispatch123$</p>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-credentials {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: #f1f5f9;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }

      .demo-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        margin: 0 0 0.5rem 0;
        letter-spacing: 0.025em;
      }

      .demo-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .demo-list p {
        margin: 0;
        font-size: 0.75rem;
        color: #64748b;
        line-height: 1.2;
        font-family: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      }
    `,
  ],
})
export class DemoCredentialsComponent {}
