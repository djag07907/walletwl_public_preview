import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Country } from "@commons/models/country.model";
@Component({
  selector: "app-country-selector",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="country-selector"
      [class.open]="showDropdown"
      (click)="toggleDropdown()"
    >
      <img
        [src]="selectedCountry?.flag"
        alt="{{ selectedCountry?.name }} flag"
        class="country-flag"
      />
      <span class="country-name">{{ selectedCountry?.name }}</span>
      <i class="pi pi-chevron-down"></i>
      <div *ngIf="showDropdown" class="country-dropdown">
        <div
          *ngFor="let country of countries"
          (click)="selectCountry(country); $event.stopPropagation()"
        >
          <img
            [src]="country.flag"
            alt="{{ country.name }} flag"
            class="country-flag"
          />
          <span class="country-name">{{ country.name }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .country-selector {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.25rem;
        background-color: white;
        min-width: 120px;
      }

      .country-selector:hover {
        border-color: #6065f1;
      }

      .country-flag {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 0.5rem;
        object-fit: cover;
      }

      .country-name {
        flex: 1;
        font-size: 0.875rem;
        color: #333;
      }

      .pi {
        margin-left: 0.5rem;
        font-size: 0.75rem;
        color: #666;
        transition: transform 0.2s ease;
      }

      .country-selector.open .pi {
        transform: rotate(180deg);
      }

      .country-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 0.25rem;
        margin-top: 0.25rem;
        padding: 0;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
      }

      .country-dropdown > div {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.15s ease;
      }

      .country-dropdown > div:last-child {
        border-bottom: none;
      }

      .country-dropdown > div:hover {
        background-color: #f8f9fa;
      }

      .country-dropdown .country-flag {
        width: 18px;
        height: 18px;
      }

      .country-dropdown .country-name {
        font-size: 0.875rem;
      }
    `,
  ],
})
export class CountrySelectorComponent {
  @Input() countries: Country[] = [];
  @Input() selectedCountry: Country | null = null;
  @Output() countrySelected = new EventEmitter<Country>();

  showDropdown = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  selectCountry(country: Country) {
    this.countrySelected.emit(country);
    this.showDropdown = false;
  }
}
