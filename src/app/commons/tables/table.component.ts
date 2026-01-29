import {
  Component,
  Input,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Directive,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";
import { emptyString } from "@app/resources/constants";
import { TranslationService } from "@app/services/translation.service";

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
}

@Directive({
  selector: "[appTableCell]",
  standalone: true,
})
export class TableCellDirective {
  @Input("appTableCell") columnKey!: string;

  constructor(public template: TemplateRef<any>) {}
}

@Component({
  selector: "app-table",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <div class="table-container">
        <table class="table">
          <thead class="table-header">
            <tr class="table-row">
              <th
                *ngFor="let column of columns"
                class="table-head"
                [style.width]="column.width"
                [style.min-width]="column.minWidth"
                [style.text-align]="column.align || 'left'"
              >
                {{ column.header }}
              </th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr *ngIf="data.length === 0" class="table-row">
              <td
                [attr.colspan]="columns.length"
                class="table-cell empty-state"
              >
                {{ emptyMessage || translationService.t("table.no_data") }}
              </td>
            </tr>
            <tr *ngFor="let row of data" class="table-row">
              <td
                *ngFor="let column of columns"
                class="table-cell"
                [style.text-align]="column.align || 'left'"
              >
                <ng-container
                  *ngIf="
                    cellTemplates && cellTemplates[column.key];
                    else defaultCell
                  "
                >
                  <ng-container
                    *ngTemplateOutlet="
                      cellTemplates[column.key];
                      context: { $implicit: row, column: column }
                    "
                  ></ng-container>
                </ng-container>
                <ng-template #defaultCell>
                  {{ row[column.key] }}
                </ng-template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .table-wrapper {
        width: 100%;
      }

      .table-container {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .table {
        width: 100%;
        min-width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
        table-layout: auto;
      }

      .table-header {
        background: #f9fafb;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .table-row {
        border-bottom: 1px solid #e5e7eb;
      }

      .table-body .table-row:hover {
        background-color: #f9fafb;
      }

      .table-head {
        padding: 0.75rem 1rem;
        text-align: left;
        font-weight: 500;
        color: #6b7280;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
        box-sizing: border-box;
      }

      .table-head:first-child {
        padding-left: 1.5rem;
      }

      .table-head:last-child {
        padding-right: 1.5rem;
      }

      .table-cell {
        padding: 1rem;
        color: var(--text-color, #1a1a1a);
        vertical-align: middle;
        box-sizing: border-box;
      }

      .table-cell:first-child {
        padding-left: 1.5rem;
      }

      .table-cell:last-child {
        padding-right: 1.5rem;
      }

      .empty-state {
        text-align: center;
        padding: 2rem 1rem !important;
        color: #6b7280;
        font-size: 0.875rem;
      }

      @media (max-width: 768px) {
        .table-head,
        .table-cell {
          padding: 0.75rem 0.5rem;
        }

        .table-head:first-child,
        .table-cell:first-child {
          padding-left: 1rem;
        }

        .table-head:last-child,
        .table-cell:last-child {
          padding-right: 1rem;
        }
      }
    `,
  ],
})
export class TableComponent implements AfterContentInit, OnChanges, OnDestroy {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() emptyMessage: string = emptyString;

  @ContentChildren(TableCellDirective)
  templates!: QueryList<TableCellDirective>;

  cellTemplates: { [key: string]: TemplateRef<any> } = {};
  private destroy$ = new Subject<void>();

  constructor(public translationService: TranslationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["columns"]) {
      this.mapTemplates();
    }
  }

  ngAfterContentInit(): void {
    this.mapTemplates();
    this.templates.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.mapTemplates();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapTemplates(): void {
    if (this.columns && this.templates) {
      this.cellTemplates = {};
      this.templates.forEach((directive) => {
        this.cellTemplates[directive.columnKey] = directive.template;
      });
    }
  }
}
