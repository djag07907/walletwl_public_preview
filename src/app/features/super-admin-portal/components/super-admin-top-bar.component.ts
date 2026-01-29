import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  LucideAngularModule,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Shield,
  Activity,
  Database,
  Globe,
} from "lucide-angular";
import { emptyString } from "@app/resources/constants";
import { TranslationService } from "@app/services/translation.service";
import { TokenRepositoryService } from "@app/core/services/token-repository.service";

@Component({
  selector: "app-super-admin-top-bar",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <header class="super-admin-top-bar">
      <div class="container">
        <div class="left-section">
          <div class="logo-section">
            <div class="logo-icon">
              <lucide-icon [img]="ShieldIcon" [size]="20"></lucide-icon>
            </div>
            <div class="logo-content">
              <span class="logo-text">WalletWL</span>
              <span class="badge">Super Admin</span>
            </div>
          </div>
        </div>

        <div *ngIf="!isMobile" class="search-section">
          <div class="search-box">
            <lucide-icon
              [img]="SearchIcon"
              [size]="16"
              class="search-icon"
            ></lucide-icon>
            <input
              type="search"
              [placeholder]="translationService.t('topbar.search_placeholder')"
              class="search-input"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            />
          </div>
        </div>

        <div class="right-section">
          <button *ngIf="isMobile" class="icon-btn">
            <lucide-icon [img]="SearchIcon" [size]="20"></lucide-icon>
          </button>

          <div class="language-selector">
            <button
              class="icon-btn lang-trigger"
              (click)="toggleLanguageMenu()"
            >
              <lucide-icon [img]="GlobeIcon" [size]="20"></lucide-icon>
              <span *ngIf="!isMobile" class="lang-code">{{
                getCurrentLanguageCode()
              }}</span>
            </button>
            <div *ngIf="isLanguageMenuOpen" class="lang-dropdown">
              <button
                class="lang-option"
                [class.active]="getCurrentLocale() === 'en'"
                (click)="switchLanguage('en')"
              >
                <span class="lang-flag">🇺🇸</span>
                <span class="lang-label">{{
                  translationService.t("topbar.english")
                }}</span>
                <span *ngIf="getCurrentLocale() === 'en'" class="check-mark"
                  >✓</span
                >
              </button>
              <button
                class="lang-option"
                [class.active]="getCurrentLocale() === 'es'"
                (click)="switchLanguage('es')"
              >
                <span class="lang-flag">🇪🇸</span>
                <span class="lang-label">{{
                  translationService.t("topbar.spanish")
                }}</span>
                <span *ngIf="getCurrentLocale() === 'es'" class="check-mark"
                  >✓</span
                >
              </button>
            </div>
          </div>

          <button class="icon-btn system-status-btn" title="System Health">
            <lucide-icon [img]="ActivityIcon" [size]="20"></lucide-icon>
            <span class="status-indicator"></span>
          </button>

          <button
            class="icon-btn notification-btn"
            (click)="toggleNotifications()"
          >
            <lucide-icon [img]="BellIcon" [size]="20"></lucide-icon>
            <span *ngIf="notificationCount > 0" class="notification-badge">{{
              notificationCount
            }}</span>
          </button>

          <div class="user-menu-trigger" (click)="toggleUserMenu()">
            <div class="user-avatar super-admin">
              {{ getInitials() }}
            </div>
            <div *ngIf="!isMobile" class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">
                <lucide-icon [img]="ShieldIcon" [size]="12"></lucide-icon>
                System Administrator
              </span>
            </div>
            <lucide-icon
              *ngIf="!isMobile"
              [img]="ChevronDownIcon"
              [size]="16"
              class="chevron-icon"
            ></lucide-icon>
          </div>
        </div>
      </div>

      <div *ngIf="isUserMenuOpen" class="user-dropdown">
        <div class="dropdown-header">
          <p class="dropdown-user-name">{{ userName }}</p>
          <p class="dropdown-user-email">{{ userEmail }}</p>
          <p class="dropdown-role">
            <lucide-icon [img]="ShieldIcon" [size]="12"></lucide-icon>
            Super Administrator
          </p>
        </div>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" (click)="viewProfile()">
          <lucide-icon [img]="UserIcon" [size]="16"></lucide-icon>
          {{ translationService.t("topbar.profile_settings") }}
        </button>
        <button class="dropdown-item" (click)="openGlobalSettings()">
          <lucide-icon [img]="SettingsIcon" [size]="16"></lucide-icon>
          Global System Settings
        </button>
        <button class="dropdown-item" (click)="openAuditLogs()">
          <lucide-icon [img]="DatabaseIcon" [size]="16"></lucide-icon>
          Audit Logs
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item logout-item" (click)="logout()">
          <lucide-icon [img]="LogOutIcon" [size]="16"></lucide-icon>
          {{ translationService.t("topbar.log_out") }}
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .super-admin-top-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4rem;
        background: white;
        border-bottom: 1px solid #e5e7eb;
        z-index: 50;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
      }

      @media (min-width: 1024px) {
        .container {
          padding: 0 1.5rem;
        }
      }

      .left-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.375rem;
        transition: all 0.2s;
        position: relative;
      }

      .icon-btn:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        background: #2563eb;
        border-radius: 0.5rem;
        color: white;
      }

      .logo-content {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .logo-text {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
      }

      .badge {
        font-size: 0.625rem;
        font-weight: 600;
        color: #2563eb;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      @media (max-width: 640px) {
        .logo-content {
          display: none;
        }
      }

      .search-section {
        flex: 1;
        max-width: 32rem;
        margin: 0 2rem;
      }

      @media (max-width: 768px) {
        .search-section {
          margin: 0 1rem;
        }
      }

      .search-box {
        position: relative;
      }

      .search-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }

      .search-input {
        width: 100%;
        height: 2.5rem;
        padding-left: 2.5rem;
        padding-right: 0.75rem;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        transition: all 0.2s;
      }

      .search-input:focus {
        outline: none;
        border-color: #2563eb;
        background: white;
      }

      .right-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      @media (min-width: 1024px) {
        .right-section {
          gap: 1rem;
        }
      }

      .language-selector {
        position: relative;
      }

      .lang-trigger {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }

      .lang-code {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
      }

      .lang-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        min-width: 10rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 100;
        padding: 0.25rem;
      }

      .lang-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.625rem 0.75rem;
        background: none;
        border: none;
        border-radius: 0.375rem;
        color: #374151;
        font-size: 0.875rem;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
      }

      .lang-option:hover {
        background: #f3f4f6;
      }

      .lang-option.active {
        background: #eff6ff;
        color: #2563eb;
      }

      .lang-flag {
        font-size: 1.25rem;
        line-height: 1;
      }

      .lang-label {
        flex: 1;
        font-weight: 500;
      }

      .check-mark {
        color: #2563eb;
        font-weight: 700;
        font-size: 1rem;
      }

      .system-status-btn {
        position: relative;
      }

      .status-indicator {
        position: absolute;
        top: 0.375rem;
        right: 0.375rem;
        width: 0.5rem;
        height: 0.5rem;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .notification-btn {
        position: relative;
      }

      .notification-badge {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        min-width: 1.125rem;
        height: 1.125rem;
        padding: 0 0.25rem;
        background: #ef4444;
        border: 2px solid white;
        border-radius: 0.625rem;
        font-size: 0.625rem;
        font-weight: 600;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-menu-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 0.2s;
      }

      .user-menu-trigger:hover {
        background: #f3f4f6;
      }

      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: #6b7280;
        color: white;
        border-radius: 50%;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .user-avatar.super-admin {
        background: #2563eb;
      }

      .user-info {
        display: flex;
        flex-direction: column;
      }

      .user-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: #1f2937;
        line-height: 1.25;
      }

      .user-role {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #2563eb;
        line-height: 1.25;
      }

      .chevron-icon {
        color: #9ca3af;
      }

      .user-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 1rem;
        width: 16rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 100;
        padding: 0.5rem;
      }

      .dropdown-header {
        padding: 0.75rem 1rem;
      }

      .dropdown-user-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
      }

      .dropdown-user-email {
        font-size: 0.75rem;
        color: #6b7280;
        margin: 0;
      }

      .dropdown-role {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #2563eb;
        margin: 0.25rem 0 0 0;
        font-weight: 500;
      }

      .dropdown-divider {
        height: 1px;
        background: #e5e7eb;
        margin: 0.5rem 0;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        border-radius: 0.5rem;
        color: #374151;
        font-size: 0.875rem;
        font-weight: 400;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
      }

      .dropdown-item:hover {
        background: #f3f4f6;
      }

      .logout-item {
        color: #dc2626;
      }

      .logout-item:hover {
        background: #fef2f2;
      }

      @media (prefers-reduced-motion: reduce) {
        .icon-btn,
        .user-menu-trigger,
        .dropdown-item {
          transition: none;
        }

        .status-indicator {
          animation: none;
        }
      }
    `,
  ],
})
export class SuperAdminTopBarComponent implements OnInit, OnDestroy {
  BellIcon = Bell;
  SearchIcon = Search;
  ChevronDownIcon = ChevronDown;
  LogOutIcon = LogOut;
  UserIcon = User;
  SettingsIcon = Settings;
  ShieldIcon = Shield;
  ActivityIcon = Activity;
  DatabaseIcon = Database;
  GlobeIcon = Globe;

  userName = "";
  userEmail = "";
  notificationCount = 0;
  isUserMenuOpen = false;
  isLanguageMenuOpen = false;
  searchQuery: string = emptyString;
  isMobile = false;

  constructor(
    private router: Router,
    public translationService: TranslationService,
    private tokenRepository: TokenRepositoryService,
  ) {}

  ngOnInit() {
    this.userName = this.tokenRepository.getUserFullName() || "Admin User";
    this.userEmail = this.tokenRepository.getUserEmail() || "";
    this.checkScreenSize();
  }

  ngOnDestroy() {}

  @HostListener("window:resize")
  onResize() {
    this.checkScreenSize();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (
      !target.closest(".user-menu-trigger") &&
      !target.closest(".user-dropdown")
    ) {
      this.isUserMenuOpen = false;
    }

    if (!target.closest(".language-selector")) {
      this.isLanguageMenuOpen = false;
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleNotifications() {
    // TODO: Implementar lógica de notificaciones
  }

  toggleLanguageMenu() {
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
    if (this.isLanguageMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.isLanguageMenuOpen = false;
    }
  }

  getCurrentLocale(): string {
    return this.translationService.getCurrentLocale();
  }

  getCurrentLanguageCode(): string {
    return this.getCurrentLocale().toUpperCase();
  }

  switchLanguage(locale: "en" | "es") {
    this.translationService.setLocale(locale);
    this.isLanguageMenuOpen = false;
  }

  viewProfile() {
    this.isUserMenuOpen = false;
    this.router.navigate(["/super-admin-portal/profile"]);
  }

  openGlobalSettings() {
    this.isUserMenuOpen = false;
    this.router.navigate(["/super-admin-portal/settings"]);
  }

  openAuditLogs() {
    this.isUserMenuOpen = false;
    this.router.navigate(["/super-admin-portal/audit-logs"]);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implementar lógica de búsqueda
    }
  }

  logout() {
    this.isUserMenuOpen = false;
    this.tokenRepository.clearAuthData();
    this.router.navigate(["/login"]);
  }

  getInitials(): string {
    if (!this.userName) return "SA";
    const parts = this.userName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return this.userName.substring(0, 2).toUpperCase();
  }
}
