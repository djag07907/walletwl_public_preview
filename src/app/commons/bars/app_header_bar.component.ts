import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountrySelectorComponent } from "@commons/selectors/country_selector.component";
import { Country } from "@commons/models/country.model";
@Component({
  selector: "app-header-bar",
  standalone: true,
  imports: [CommonModule, CountrySelectorComponent],
  template: `
    <div class="header-bar">
      <div class="left-section">
        <img src="logo.png" alt="" />
      </div>
      <div class="right-section">
        <span class="support" (click)="onSupportClick()">Soporte</span>
        <app-country-selector
          [countries]="countries"
          [selectedCountry]="selectedCountry"
          (countrySelected)="selectCountry($event)"
        ></app-country-selector>
      </div>
    </div>
  `,
  styles: [
    `
      .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #ffffff;
        border-bottom: 1px solid #e0e0e0;
      }
      .left-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .right-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .support {
        cursor: pointer;
        color: #6065f1;
      }
      .country-selector {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .country-flag {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 0.5rem;
      }
      .country-dropdown {
        position: absolute;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        z-index: 1000;
      }
      .country-dropdown div {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        cursor: pointer;
      }
      .country-dropdown div:hover {
        background-color: #f0f0f0;
      }
    `,
  ],
})
export class HeaderBarComponent {
  @Output() supportClicked = new EventEmitter<void>();
  selectedCountry: Country | null = {
    id: "HN",
    name: "Honduras",
    flag: "hn.png",
  };
  countries: Country[] = [
    { id: "HN", name: "Honduras", flag: "hn.png" },
    { id: "USA", name: "United States", flag: "usa.png" },
    //  TODO: Países de prueba, agregar países según se requieran
  ];
  onSupportClick() {
    this.supportClicked.emit();
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
  }
}
