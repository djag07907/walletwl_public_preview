import {
  Component,
  OnInit,
  OnDestroy,
  effect,
  ChangeDetectorRef,
  signal,
  computed,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject, takeUntil, tap } from "rxjs";
import { TranslationService } from "@app/services/translation.service";
import { User, mockUsersData } from "./users.mock";
import { UsersService } from "./services/users.service";
import { mockMunicipalitiesData } from "@app/features/municipalities/municipalities.mock";
import { KpiCardComponent, KpiData } from "@commons/cards/kpi-card.component";
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { InputComponent } from "@commons/forms/input.component";
import { SelectComponent, SelectOption } from "@commons/forms/select.component";
import { ActionMenuComponent } from "@commons/ui/action-menu.component";
import { BadgeComponent } from "@commons/ui/badge.component";
import { UsersMenuOptionsComponent } from "./components/users-menu-options.component";
import {
  TableComponent,
  TableColumn,
  TableCellDirective,
} from "@commons/tables/table.component";
import { TablePaginationComponent } from "@commons/tables/pagination.component";
import { TabsComponent, Tab } from "@commons/ui/tabs.component";
import { WalletsService } from "../wallets/services/wallets.service";
import { Wallet } from "../wallets/wallets.mock";
import {
  UsersIconComponent,
  TrendingUpIconComponent,
  TrendingDownIconComponent,
  SearchIconComponent,
  DownloadIconComponent,
  ShieldIconComponent,
} from "@app/shared/components/icons/icons.component";
import { emptyString } from "@app/resources/constants";
import { UserRole } from "@app/commons/enum/user_role";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    BadgeComponent,
    UsersMenuOptionsComponent,
    TableComponent,
    TableCellDirective,
    TablePaginationComponent,
    TabsComponent,
    UsersIconComponent,
    TrendingUpIconComponent,
    TrendingDownIconComponent,
    SearchIconComponent,
    DownloadIconComponent,
    ShieldIconComponent,
  ],
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  users = signal<User[]>(mockUsersData);
  wallets = signal<Wallet[]>([]);

  searchQuery = signal<string>(emptyString);
  roleFilter = signal<string>("all");
  statusFilter = signal<string>("all");
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(5);

  activeTab = signal<string>("regular");
  tabs: Tab[] = [];

  kpis = computed<KpiData[]>(() => {
    const list = this.users();
    const activeCount = list.filter((u) => u.status === "active").length;
    const adminCount = list.filter(
      (u) =>
        u.role === UserRole.SUPER_ADMIN ||
        u.role === UserRole.MUNICIPALITY_ADMIN,
    ).length;
    const inactiveCount = list.filter((u) => u.status === "inactive").length;

    return [
      {
        title: this.translationService.t("users.total_users"),
        value: list.length.toString(),
        change: "+5",
        trend: "up",
        subtitle: this.translationService.t("users.across_all_companies"),
      },
      {
        title: this.translationService.t("users.active_users"),
        value: activeCount.toString(),
        change: "+2",
        trend: "up",
        subtitle: this.translationService.t("users.currently_active"),
      },
      {
        title: this.translationService.t("users.administrators"),
        value: adminCount.toString(),
        change: "0",
        trend: "up",
        subtitle: this.translationService.t("users.with_full_access"),
      },
      {
        title: this.translationService.t("users.inactive_users"),
        value: inactiveCount.toString(),
        change: "-1",
        trend: "down",
        subtitle: this.translationService.t("users.require_attention"),
      },
    ];
  });

  filteredUsers = computed(() => {
    const list = this.users();
    const query = this.searchQuery().toLowerCase();

    return list.filter((u: any) => {
      const matchesSearch =
        (u.firstName || emptyString).toLowerCase().includes(query) ||
        (u.lastName || emptyString).toLowerCase().includes(query) ||
        (u.email || emptyString).toLowerCase().includes(query);

      const matchesRoleFilter =
        this.roleFilter() === "all" || u.role === this.roleFilter();

      const matchesStatus =
        this.statusFilter() === "all" || u.status === this.statusFilter();

      const matchesTab =
        this.activeTab() === "regular"
          ? u.role === UserRole.USER
          : u.role !== UserRole.USER;

      return matchesSearch && matchesRoleFilter && matchesStatus && matchesTab;
    });
  });

  paginatedUsers = computed(() => {
    const filtered = this.filteredUsers();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return filtered.slice(startIndex, endIndex);
  });

  roleOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  tableColumns: TableColumn[] = [];

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private usersService: UsersService,
    private walletsService: WalletsService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      this.translationService.getCurrentLocale();
      this.initializeTabs();
      this.initializeTableColumns();
      this.initializeFilters();
    });
  }

  ngOnInit(): void {
    this.initializeTabs();
    this.initializeData();
    this.initializeFilters();
    this.initializeTableColumns();
  }

  private initializeTabs(): void {
    this.tabs = [
      {
        id: "regular",
        label: this.translationService.t("users.regular_users"),
      },
      {
        id: "backoffice",
        label: this.translationService.t("users.backoffice_users"),
      },
    ];
  }

  private initializeData(): void {
    // Fetch users
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users.set(users);
        },
        error: (err) => {
          console.error("UsersComponent: Error fetching users", err);
        },
      });

    // Fetch wallets for regular users
    this.walletsService
      .getWallets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wallets) => {
          this.wallets.set(wallets);
        },
        error: (err) => {
          console.error("UsersComponent: Error fetching wallets", err);
        },
      });
  }

  private initializeFilters(): void {
    this.statusOptions = [
      {
        label: this.translationService.t("users.all_status"),
        value: "all",
      },
      {
        label: this.translationService.t("users.active"),
        value: "active",
      },
      {
        label: this.translationService.t("users.inactive"),
        value: "inactive",
      },
    ];

    this.roleOptions = [
      {
        label: this.translationService.t("users.all_roles"),
        value: "all",
      },
      {
        label: "Super Admin",
        value: UserRole.SUPER_ADMIN,
      },
      {
        label: "Municipality Admin",
        value: UserRole.MUNICIPALITY_ADMIN,
      },
      {
        label: "Manager",
        value: UserRole.MANAGER,
      },
      {
        label: "Regular User",
        value: UserRole.USER,
      },
    ];
  }

  private initializeTableColumns(): void {
    const columns: TableColumn[] = [
      {
        key: "user",
        header: this.translationService.t("users.user"),
        width: "25%",
        minWidth: "200px",
      },
      {
        key: "email",
        header: this.translationService.t("users.email"),
        width: "20%",
        minWidth: "150px",
      },
    ];

    if (this.activeTab() === "regular") {
      columns.push({
        key: "wallet",
        header: this.translationService.t("users.wallet_status"),
        width: "15%",
        minWidth: "120px",
      });
    } else {
      columns.push({
        key: "role",
        header: this.translationService.t("users.role"),
        width: "15%",
        minWidth: "120px",
      });
    }

    columns.push(
      {
        key: "municipalityId",
        header: this.translationService.t("users.municipality"),
        width: "20%",
        minWidth: "150px",
      },
      {
        key: "status",
        header: this.translationService.t("users.status"),
        width: "10%",
        minWidth: "100px",
      },
      {
        key: "actions",
        header: emptyString,
        width: "10%",
        minWidth: "80px",
        align: "center",
      },
    );

    this.tableColumns = columns;
  }

  get backofficeUsersCount(): number {
    return this.users().filter((u: any) => u.role !== UserRole.USER).length;
  }

  get regularUsersCount(): number {
    return this.users().filter((u: any) => u.role === UserRole.USER).length;
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onRoleFilterChange(value: string): void {
    this.roleFilter.set(value);
    this.currentPage.set(1);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  onTabChange(tabId: string): void {
    this.activeTab.set(tabId);
    this.currentPage.set(1);
    this.initializeTableColumns();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage());
  }

  getMunicipalityName(municipalityId?: string): string {
    if (!municipalityId) return "N/A";
    return (
      mockMunicipalitiesData.find((m) => m.id === municipalityId)
        ?.municipalityName || "Unknown"
    );
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  hasWallet(userId: string): boolean {
    return this.wallets().some((w: any) => w.assignedUserId === userId);
  }

  getBadgeVariant(
    role: string,
  ): "default" | "secondary" | "success" | "warning" | "danger" {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "danger";
      case UserRole.MUNICIPALITY_ADMIN:
        return "warning";
      case UserRole.MANAGER:
        return "success";
      case UserRole.USER:
        return "secondary";
      default:
        return "secondary";
    }
  }

  getStatusBadgeVariant(status: string): "success" | "secondary" {
    return status === "active" ? "success" : "secondary";
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Super Admin";
      case UserRole.MUNICIPALITY_ADMIN:
        return "Municipality Admin";
      case UserRole.MANAGER:
        return "Manager";
      case UserRole.USER:
        return "Regular User";
      default:
        return role;
    }
  }

  onUserAction(event: { action: string; userId: string }): void {
    switch (event.action) {
      case "edit":
        this.router.navigate([`home/users/edit/${event.userId}`]);
        break;
      case "delete":
        // TODO: Implementar eliminación
        break;
      case "view":
        // TODO: Implementar vista de perfil
        break;
    }
  }

  onAddUser(): void {
    this.router.navigate(["home/users/add"]);
  }

  onExport(): void {
    // TODO: Implementar exportación
    console.log("Exporting users...");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
