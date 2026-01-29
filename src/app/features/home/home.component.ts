import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { LeftMenuComponent } from "@features/home/components/left-menu.component";
import { TopBarComponent } from "@features/home/components/top-bar.component";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeftMenuComponent, TopBarComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isMobileMenuOpen = false;
  isCollapsed = false;
  isMobile = false;
  isTablet = false;
  isDesktop = true;

  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const width = window.innerWidth;

    this.isMobile = width < this.MOBILE_BREAKPOINT;
    this.isTablet =
      width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;
    this.isDesktop = width >= this.TABLET_BREAKPOINT;

    if (this.isDesktop && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  onMenuItemClick() {
    if (this.isMobile || this.isTablet) {
      this.closeMobileMenu();
    }
  }
}
