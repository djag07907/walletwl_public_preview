import { Component, ViewEncapsulation, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TranslationService } from "@app/services/translation.service";
import { BatchUploadService } from "@app/services/batch-upload.service";
import { ButtonComponent } from "@commons/buttons/button.component";
import { CardComponent } from "@commons/cards/card.component";
import {
  DownloadIconComponent,
  InfoCircleIconComponent,
  ArrowRightIconComponent,
  CloudUploadIconComponent,
  FolderTreeIconComponent,
  CheckCircleIconComponent,
  ClockIconComponent,
  LockIconComponent,
  ArrowLeftIconComponent,
} from "@app/shared/components/icons/icons.component";

@Component({
  selector: "app-batch-upload",
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    DownloadIconComponent,
    InfoCircleIconComponent,
    ArrowRightIconComponent,
    CloudUploadIconComponent,
    FolderTreeIconComponent,
    CheckCircleIconComponent,
    ClockIconComponent,
    LockIconComponent,
    ArrowLeftIconComponent,
  ],
  templateUrl: "./batch-upload.component.html",
  styleUrls: ["./batch-upload.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BatchUploadComponent {
  selectedFile: File | null = null;
  isDragging = false;
  isProcessing = signal(false);

  columns = [
    "DPI Cliente",
    "Concepto",
    "Tipo",
    "Valor",
    "IVA",
    "Valor Total",
    "Vencimiento",
  ];

  requirements = [
    {
      icon: "check-circle",
      title: "Data Validation",
      description:
        "Our system automatically checks for duplicate DPI records and currency format errors.",
      color: "#10b981",
    },
    {
      icon: "clock",
      title: "Process Tracking",
      description:
        "Once processed, a summary report will be available in the Reports section.",
      color: "#3b82f6",
    },
    {
      icon: "lock",
      title: "Secure Handling",
      description:
        "All uploaded data is encrypted and handled following municipal security protocols.",
      color: "#f59e0b",
    },
  ];

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private batchUploadService: BatchUploadService,
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      this.selectedFile = file;
    }
  }

  onBrowseFiles(): void {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  }

  onCancel(): void {
    this.router.navigate(["home/billing_records"]);
  }

  async onProcessUpload(): Promise<void> {
    if (this.selectedFile && !this.isProcessing()) {
      this.isProcessing.set(true);
      try {
        await this.batchUploadService.parseExcelFile(this.selectedFile);
        this.router.navigate(["home/billing_records/batch-upload/preview"]);
      } catch (error) {
        // TODO: Implementar mostrar error notificación si existe el servicio
      } finally {
        this.isProcessing.set(false);
      }
    }
  }

  onDownloadTemplate(): void {
    // TODO: Implementar descargar template
  }
}
