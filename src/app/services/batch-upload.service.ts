import { Injectable, signal } from "@angular/core";
import * as XLSX from "xlsx";

export interface BatchRecord {
  dpi: string;
  concepto: string;
  tipo: string;
  valor: number;
  iva: number;
  total: number;
  vencimiento: string;
  status: "valid" | "invalid_dpi" | "invalid_value" | "missing_data";
  errors: string[];
}

export interface BatchSummary {
  filename: string;
  totalRecords: number;
  validRecordsCount: number;
  errorRecordsCount: number;
  extractionPercentage: number;
  readyPercentage: number;
  errorPercentage: number;
}

@Injectable({
  providedIn: "root",
})
export class BatchUploadService {
  private recordsSignal = signal<BatchRecord[]>([]);
  private summarySignal = signal<BatchSummary | null>(null);

  records = this.recordsSignal.asReadonly();
  summary = this.summarySignal.asReadonly();

  constructor() {}

  async parseExcelFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as any[];

          if (jsonData.length <= 1) {
            throw new Error("The file is empty or only contains headers.");
          }

          const rows = jsonData.slice(1).filter((row) => {
            return (
              Array.isArray(row) &&
              row.some(
                (cell) =>
                  cell !== null &&
                  cell !== undefined &&
                  String(cell).trim() !== "",
              )
            );
          });
          const processedRecords: BatchRecord[] = rows.map((row) =>
            this.validateRow(row),
          );

          this.recordsSignal.set(processedRecords);
          this.calculateSummary(file.name, processedRecords);
          resolve();
        } catch (error) {
          console.error("Error parsing Excel:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  private validateRow(row: any[]): BatchRecord {
    const dpi = String(row[0] || "").trim();
    const concepto = String(row[1] || "").trim();
    const tipo = String(row[2] || "").trim();
    const valor = Number(row[3]) || 0;
    const iva = Number(row[4]) || 0;
    const total = Number(row[5]) || 0;
    const vencimiento = String(row[6] || "").trim();

    const errors: string[] = [];
    let status: BatchRecord["status"] = "valid";

    if (!this.isValidDPI(dpi)) {
      errors.push("Invalid DPI format");
      status = "invalid_dpi";
    }
    if (!concepto || !tipo || !vencimiento) {
      errors.push("Missing mandatory fields");
      status = "missing_data";
    }
    const expectedTotal = valor + iva;
    if (Math.abs(expectedTotal - total) > 0.01) {
      errors.push("Total value mismatch");
      status = "invalid_value";
    }

    if (valor <= 0 && status === "valid") {
      errors.push("Value is missing or zero");
      status = "invalid_value";
    }

    return {
      dpi,
      concepto,
      tipo,
      valor,
      iva,
      total,
      vencimiento,
      status,
      errors,
    };
  }

  private isValidDPI(dpi: string): boolean {
    const normalized = dpi.replace(/\s/g, "");
    const dpiRegex = /^\d{13}$/;
    return dpiRegex.test(normalized);
  }

  private calculateSummary(filename: string, records: BatchRecord[]): void {
    const total = records.length;
    const valid = records.filter((r) => r.status === "valid").length;
    const errors = total - valid;

    this.summarySignal.set({
      filename,
      totalRecords: total,
      validRecordsCount: valid,
      errorRecordsCount: errors,
      extractionPercentage: 100,
      readyPercentage: total > 0 ? (valid / total) * 100 : 0,
      errorPercentage: total > 0 ? (errors / total) * 100 : 0,
    });
  }

  clearData(): void {
    this.recordsSignal.set([]);
    this.summarySignal.set(null);
  }
}
