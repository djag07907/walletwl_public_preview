import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { TranslationService } from "@app/services/translation.service";
import { AppVersionComponent } from "@app/shared/components/app-version/app-version.component";
import { TokenRepositoryService } from "@app/core/services/token-repository.service";
import {
  LucideAngularModule,
  LayoutDashboard,
  Building2,
  Package,
  Route,
  Users,
  UserCircle,
  Settings,
  Warehouse,
  X,
  Database,
  Tags,
  LayoutGrid,
} from "lucide-angular";
import { UserRole } from "@app/commons/enum/user_role";

const PackageIcon = Package;

@Component({
  selector: "app-left-menu",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    AppVersionComponent,
  ],
  template: `
    <aside
      class="sidebar"
      [class.collapsed]="isCollapsed && isDesktop"
      [class.mobile-open]="isMobileMenuOpen"
      [class.mobile]="isMobile"
      [class.tablet]="isTablet"
      [class.desktop]="isDesktop"
    >
      <div *ngIf="isMobile || isTablet" class="mobile-header">
        <div class="logo-section">
          <div class="logo-icon">
            <lucide-icon [img]="PackageIcon" [size]="20"></lucide-icon>
          </div>
          <span class="logo-text">WalletWL</span>
        </div>
        <button class="mobile-close-btn" (click)="onCloseMobileMenu()">
          <lucide-icon [img]="XIcon" [size]="20"></lucide-icon>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="menu-list">
          <li *ngFor="let item of visibleMenuItems">
            <div *ngIf="item.isHeader && !isCollapsed" class="menu-header">
              {{ translationService.t(item.labelKey) }}
            </div>
            <a
              *ngIf="!item.isHeader"
              [routerLink]="item.href"
              routerLinkActive="active"
              class="menu-link"
              [title]="
                isCollapsed ? translationService.t(item.labelKey) : undefined
              "
              (click)="onMenuItemClick()"
            >
              <lucide-icon
                [img]="item.icon!"
                [size]="20"
                class="menu-icon"
              ></lucide-icon>
              <span *ngIf="!isCollapsed" class="menu-label">{{
                translationService.t(item.labelKey)
              }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-version">
        <app-version></app-version>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        left: 0;
        background: white;
        border-right: 1px solid #e5e7eb;
        z-index: 1000;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
      }

      .sidebar.desktop {
        top: 4rem;
        height: calc(100vh - 4rem);
        width: 280px;
        transform: translateX(0);
      }

      .sidebar.desktop.collapsed {
        width: 64px;
      }

      .sidebar.tablet,
      .sidebar.mobile {
        top: 0;
        height: 100vh;
        width: 280px;
        transform: translateX(-100%);
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4rem;
        padding: 0 1rem;
        border-bottom: 1px solid #e5e7eb;
        flex-shrink: 0;
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

      .logo-text {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
      }

      .mobile-close-btn {
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
      }

      .mobile-close-btn:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .sidebar-nav {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1rem 0;
      }

      .sidebar-version {
        flex-shrink: 0;
        border-top: 1px solid #e5e7eb;
        padding: 0.75rem 0;
      }

      .menu-list {
        list-style: none;
        margin: 0;
        padding: 0 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .menu-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        color: #6b7280;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s;
        cursor: pointer;
      }

      .menu-link:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .menu-link.active {
        background: #2563eb;
        color: white;
      }

      .sidebar.collapsed .menu-link {
        justify-content: center;
      }

      .menu-icon {
        flex-shrink: 0;
      }

      .menu-label {
        white-space: nowrap;
      }

      .sidebar-nav::-webkit-scrollbar {
        width: 4px;
      }

      .sidebar-nav::-webkit-scrollbar-track {
        background: transparent;
      }

      .sidebar-nav::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }

      .sidebar-nav::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      .menu-header {
        font-size: 0.625rem;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 1.5rem 1rem 0.5rem 1rem;
        margin-top: 0.5rem;
      }

      .menu-list li:first-child .menu-header {
        margin-top: 0;
        padding-top: 0.5rem;
      }

      @media (prefers-reduced-motion: reduce) {
        .sidebar,
        .menu-link,
        .mobile-close-btn {
          transition: none;
        }
      }
    `,
  ],
})
export class LeftMenuComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Input() isDesktop = true;
  @Input() isMobileMenuOpen = false;
  @Input() isCollapsed = false;

  @Output() menuItemClick = new EventEmitter<void>();
  @Output() closeMobileMenu = new EventEmitter<void>();

  XIcon = X;
  PackageIcon = PackageIcon;

  userRole: UserRole | null = null;

  menuItems: {
    labelKey: string;
    icon?: any;
    href?: string;
    roles: UserRole[];
    isHeader?: boolean;
  }[] = [
    {
      labelKey: "navigation.dashboard",
      icon: LayoutDashboard,
      href: "/home/dashboard",
      roles: [UserRole.MUNICIPALITY_ADMIN, UserRole.MANAGER],
    },
    {
      labelKey: "navigation.billing_records",
      icon: Building2,
      href: "/home/billing_records",
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
    {
      labelKey: "navigation.collectors",
      icon: Warehouse,
      href: "/home/collectors",
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
    {
      labelKey: "navigation.wallets",
      icon: Package,
      href: "/home/wallets",
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
    // {
    //   labelKey: "navigation.municipalities",
    //   icon: Building2,
    //   href: "/home/municipalities",
    //   roles: [UserRole.MUNICIPALITY_ADMIN],
    // },
    {
      labelKey: "navigation.payments",
      icon: Route,
      href: "/home/payments",
      roles: [UserRole.MUNICIPALITY_ADMIN, UserRole.MANAGER],
    },
    {
      labelKey: "navigation.charge_types",
      icon: Tags,
      href: "/home/charge-types",
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
    {
      labelKey: "navigation.charge_categories",
      icon: LayoutGrid,
      href: "/home/charge-categories",
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
    {
      labelKey: "navigation.users",
      icon: UserCircle,
      href: "/home/users",
      roles: [UserRole.MUNICIPALITY_ADMIN, UserRole.SUPER_ADMIN],
    },
    {
      labelKey: "navigation.settings",
      icon: Settings,
      href: "/home/settings",
      roles: [UserRole.MUNICIPALITY_ADMIN, UserRole.SUPER_ADMIN],
    },

    {
      labelKey: "navigation.development_tools",
      isHeader: true,
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
    {
      labelKey: "navigation.manual_recharge",
      icon: Database,
      href: "/home/manual-recharge",
      roles: [UserRole.MUNICIPALITY_ADMIN],
    },
  ];

  get visibleMenuItems() {
    if (!this.userRole) return [];
    return this.menuItems.filter((item) => item.roles.includes(this.userRole!));
  }

  constructor(
    private router: Router,
    public translationService: TranslationService,
    private tokenRepository: TokenRepositoryService,
  ) {}

  ngOnInit() {
    this.userRole = this.tokenRepository.getUserRole() as UserRole | null;
  }

  ngOnDestroy() {}

  onMenuItemClick() {
    this.menuItemClick.emit();
  }

  onCloseMobileMenu() {
    this.closeMobileMenu.emit();
  }
}
