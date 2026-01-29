import {
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TranslationService } from "@app/services/translation.service";
import { BatchUploadService } from "@app/services/batch-upload.service";
import { ButtonComponent } from "@commons/buttons/button.component";
import { BatchKpiCardComponent } from "./components/kpi-card.component";
import { BatchProcessingDialogComponent } from "./components/batch-processing-dialog.component";
import { BatchUploadSuccessDialogComponent } from "./components/batch-upload-success-dialog.component";
import {
  CheckCircleIconComponent,
  ChartBarIconComponent,
  AlertTriangleIconComponent,
  FileTextIconComponent,
  InfoCircleIconComponent,
  ArrowRightIconComponent,
  ArrowLeftIconComponent,
  TrashIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-batch-upload-preview",
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    BatchKpiCardComponent,
    CheckCircleIconComponent,
    ChartBarIconComponent,
    AlertTriangleIconComponent,
    FileTextIconComponent,
    InfoCircleIconComponent,
    ArrowRightIconComponent,
    ArrowLeftIconComponent,
    TrashIconComponent,
    BatchProcessingDialogComponent,
    BatchUploadSuccessDialogComponent,
  ],
  templateUrl: "./batch-upload-preview.component.html",
  styleUrls: ["./batch-upload-preview.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BatchUploadPreviewComponent implements OnInit {
  filterMode = signal<"all" | "errors">("all");
  currentPage = signal(0);
  pageSize = signal(10);
  isProcessing = signal(false);
  isSuccessView = signal(false);
  batchId = signal<string>("");
  processedAt = signal<string>("");

  filteredRecords = computed(() => {
    const records = this.batchUploadService.records();
    const mode = this.filterMode();
    if (mode === "all") return records;
    return records.filter((r) => r.status !== "valid");
  });

  paginatedRecords = computed(() => {
    const records = this.filteredRecords();
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    return records.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredRecords().length / this.pageSize());
  });

  pagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  });

  summary = computed(() => this.batchUploadService.summary());

  Math = Math;

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private batchUploadService: BatchUploadService,
  ) {}

  ngOnInit(): void {
    // Regresar si no hay datos (e.g. al recargar)
    if (!this.batchUploadService.summary()) {
      this.router.navigate(["home/billing_records/batch-upload"]);
    }
  }

  setFilter(mode: "all" | "errors"): void {
    this.filterMode.set(mode);
    this.currentPage.set(0);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
    }
  }

  onDiscard(): void {
    this.batchUploadService.clearData();
    this.router.navigate(["home/billing_records/batch-upload"]);
  }

  onConfirm(): void {
    const now = new Date();
    this.batchId.set(
      "BTCH-" +
        now.getFullYear() +
        "-" +
        Math.floor(Math.random() * 1000) +
        "A",
    );
    this.isProcessing.set(true);
  }

  handleProcessingComplete(): void {
    this.isProcessing.set(false);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    this.processedAt.set(`${formattedTime} ${formattedDate}`);
    this.isSuccessView.set(true);
  }

  onSuccessViewClose(): void {
    this.isSuccessView.set(false);
    this.batchUploadService.clearData();
    this.router.navigate(["home/billing_records"]);
  }

  onPerformAnotherUpload(): void {
    this.isSuccessView.set(false);
    this.batchUploadService.clearData();
    this.router.navigate(["home/billing_records/batch-upload"]);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "valid":
        return "Valid";
      case "invalid_dpi":
        return "Invalid DPI";
      case "invalid_value":
        return "Invalid Value";
      case "missing_data":
        return "Missing Data";
      default:
        return "Unknown";
    }
  }

  formatDPI(dpi: string): string {
    const normalized = dpi.replace(/\s/g, "");
    if (normalized.length !== 13) return dpi;
    return `${normalized.substring(0, 4)} ${normalized.substring(4, 9)} ${normalized.substring(9, 13)}`;
  }
}
