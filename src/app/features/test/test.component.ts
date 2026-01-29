import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionService } from "@core/services/session.service";
import { Button, Card, Divider } from "@commons/primeng-ui.module";

@Component({
  selector: "app-test",
  standalone: true,
  imports: [CommonModule, Button, Card, Divider],
  template: `
    <div class="test-container">
      <div class="welcome-section">
        <h1>Welcome to Angular Template!</h1>
        <p class="welcome-subtitle">
          You have successfully logged in as <strong>{{ username }}</strong>
        </p>
      </div>

      <div class="content-grid">
        <p-card header="Getting Started" class="feature-card">
          <p>
            This is a template Angular application with the following features:
          </p>
          <ul>
            <li>Angular 20+ with SSR support</li>
            <li>PrimeNG UI components</li>
            <li>NgRx for state management</li>
            <li>Authentication system with guards</li>
            <li>Modular architecture</li>
            <li>TypeScript configured</li>
          </ul>
        </p-card>

        <p-card header="Navigation" class="feature-card">
          <p>You can navigate through the application:</p>
          <ul>
            <li>This protected test page</li>
            <li>Public login/register pages</li>
            <li>Password recovery functionality</li>
            <li>Secure logout with session cleanup</li>
          </ul>
        </p-card>

        <p-card header="Session Info" class="feature-card">
          <p><strong>Token Age:</strong> {{ getTokenAgeDisplay() }}</p>
          <p>
            <strong>Remaining Time:</strong> {{ getRemainingTimeDisplay() }}
          </p>
          <p>
            <small
              >Session automatically expires after 5 minutes of
              inactivity</small
            >
          </p>

          <p-divider />

          <div class="session-actions">
            <p-button
              label="Refresh Session"
              icon="pi pi-refresh"
              (onClick)="refreshSession()"
              styleClass="p-button-outlined"
            />
            <p-button
              label="Logout"
              icon="pi pi-sign-out"
              (onClick)="logout()"
              severity="secondary"
            />
          </div>
        </p-card>
      </div>

      <div class="footer-section">
        <p>Built with ❤️ using Angular Template</p>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
      }

      .welcome-section {
        text-align: center;
        margin-bottom: 3rem;
      }

      .welcome-section h1 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 2.5rem;
      }

      .welcome-subtitle {
        color: #666;
        font-size: 1.2rem;
        margin-bottom: 0;
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .feature-card {
        height: fit-content;
      }

      .feature-card ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }

      .feature-card li {
        margin-bottom: 0.5rem;
        color: #555;
      }

      .session-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }

      .footer-section {
        text-align: center;
        padding: 2rem 0;
        border-top: 1px solid #eee;
        color: #999;
      }

      @media (max-width: 768px) {
        .test-container {
          padding: 1rem;
        }

        .welcome-section h1 {
          font-size: 2rem;
        }

        .content-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .session-actions {
          justify-content: center;
        }
      }
    `,
  ],
})
export class TestComponent {
  private sessionService = inject(SessionService);

  get username(): string {
    return this.sessionService.getUsername() || "User";
  }

  getTokenAgeDisplay(): string {
    const age = this.sessionService.getTokenAge();
    const minutes = Math.floor(age / (1000 * 60));
    const seconds = Math.floor((age % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  getRemainingTimeDisplay(): string {
    const remaining = this.sessionService.getRemainingTime();
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return remaining > 0 ? `${minutes}m ${seconds}s` : "Expired";
  }

  refreshSession(): void {
    this.sessionService.refreshToken();
  }

  logout(): void {
    this.sessionService.logout();
  }
}
