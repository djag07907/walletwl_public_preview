import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "icon-package",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-box"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class PackageIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-eye",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-eye"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class EyeIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-eye-off",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-eye-slash"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class EyeOffIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-lock",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-lock"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class LockIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-shield",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-shield"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ShieldIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-trending-up",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-chart-line"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class TrendingUpIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-users",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-users"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class UsersIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-alert-circle",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-exclamation-triangle"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class AlertCircleIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-mail",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-envelope"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class MailIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-check-circle",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-check-circle"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class CheckCircleIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-arrow-left",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-arrow-left"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ArrowLeftIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-dollar",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-dollar"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class DollarIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-route",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-map"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class RouteIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-trending-down",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-arrow-down"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class TrendingDownIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-map-pin",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-map-marker"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class MapPinIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-shopping-cart",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-shopping-cart"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ShoppingCartIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-clock",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-clock"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ClockIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-arrow-right",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-arrow-right"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ArrowRightIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-calendar",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-calendar"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class CalendarIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-building",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-building"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class BuildingIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-search",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-search"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class SearchIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-more-vertical",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-ellipsis-v"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class MoreVerticalIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-download",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-download"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class DownloadIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-warehouse",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-home"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class WarehouseIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-save",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-save"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class SaveIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-dollar-sign",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-dollar"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class DollarSignIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-alert-triangle",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-exclamation-triangle"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class AlertTriangleIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-folder-tree",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-folder"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class FolderTreeIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-plus",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-plus"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class PlusIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-edit",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-pencil"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class EditIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-trash",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-trash"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class TrashIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-layout-grid",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-th-large"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class LayoutGridIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-layout-list",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-list"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class LayoutListIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-truck",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-car"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class TruckIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-globe",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-globe"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class GlobeIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-bell",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-bell"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class BellIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-database",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-database"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class DatabaseIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-upload",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-upload"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class UploadIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-billing",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-file-invoice-dollar"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class BillingIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-cloud-upload",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-cloud-upload"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class CloudUploadIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-info-circle",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-info-circle"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class InfoCircleIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}
@Component({
  selector: "icon-chart-bar",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-chart-bar"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ChartBarIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-file-text",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-file"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class FileTextIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}
@Component({
  selector: "icon-minus",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-minus"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class MinusIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-external-link",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-external-link"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class ExternalLinkIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-history",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-history"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class HistoryIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-x",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-times"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class XIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}

@Component({
  selector: "icon-tags",
  standalone: true,
  imports: [CommonModule],
  template: `<i
    class="pi pi-tags"
    [ngStyle]="{ fontSize: size || '1rem', color: color || 'inherit' }"
  ></i>`,
})
export class TagsIconComponent {
  @Input() size?: string;
  @Input() color?: string;
}
