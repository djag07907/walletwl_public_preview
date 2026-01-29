import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { TranslationService } from "@app/services/translation.service";
import { emptyString } from "@app/resources/constants";
import {
  CardComponent,
  CardHeaderComponent,
  CardContentComponent,
} from "@commons/cards/card.component";
import { ButtonComponent } from "@commons/buttons/button.component";
import { BadgeComponent } from "@commons/ui/badge.component";
import { ArrowLeftIconComponent } from "@app/shared/components/icons/icons.component";
import { Payment } from "../payments/payments.mock";
import { PaymentsService } from "../payments/services/payments.service";

@Component({
  selector: "app-payments-detail",
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    ButtonComponent,
    BadgeComponent,
    ArrowLeftIconComponent,
  ],
  templateUrl: "./payments-detail.component.html",
  styleUrls: ["./payments-detail.component.scss"],
})
export class PaymentsDetailComponent implements OnInit {
  @Input() paymentId: string = emptyString;
  @Output() back = new EventEmitter<void>();

  payment = signal<Payment | undefined>(undefined);

  constructor(
    public translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute,
    private paymentsService: PaymentsService,
  ) {}

  ngOnInit(): void {
    if (!this.paymentId) {
      this.route.params.subscribe((params) => {
        this.paymentId = params["id"];
        this.loadPayment();
      });
    } else {
      this.loadPayment();
    }
  }

  private loadPayment(): void {
    if (!this.paymentId) return;

    this.paymentsService.getPaymentById(this.paymentId).subscribe({
      next: (payment) => {
        this.payment.set(payment);
      },
      error: (error) => {
        console.error("Error loading payment detail:", error);
      },
    });
  }

  onCancel(): void {
    this.back.emit();
    this.router.navigate(["/home/payments"]);
  }

  onPrint(): void {
    // TODO: Implementar impresión de recibo
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return emptyString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatAmount(amount: number | undefined): string {
    if (amount === undefined || amount === null) return "0.00";
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getPaymentMethodLabel(method: string | undefined): string {
    if (!method) return emptyString;
    const methodMap: { [key: string]: string } = {
      cash: this.translationService.t("payments.cash"),
      credit_card: this.translationService.t("payments.credit_card"),
      bank_transfer: this.translationService.t("payments.bank_transfer"),
      check: this.translationService.t("payments.check"),
      wallet: this.translationService.t("payments.wallet"),
    };
    return methodMap[method] || method;
  }

  getInitials(name: string | undefined): string {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
}
