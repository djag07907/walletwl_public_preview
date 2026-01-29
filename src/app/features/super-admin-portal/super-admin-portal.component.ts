import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TokenRepositoryService } from "@app/core/services/token-repository.service";
import { SuperAdminTopBarComponent } from "./components/super-admin-top-bar.component";

interface Municipality {
  id: string;
  name: string;
}

@Component({
  selector: "app-super-admin-portal",
  standalone: true,
  imports: [CommonModule, FormsModule, SuperAdminTopBarComponent],
  templateUrl: "./super-admin-portal.component.html",
  styleUrls: ["./super-admin-portal.component.scss"],
})
export class SuperAdminPortalComponent implements OnInit {
  selectedMunicipality: string = "";
  userName: string = "";
  userEmail: string = "";

  municipalities: Municipality[] = [
    { id: "springfield", name: "Springfield City Council" },
    { id: "riverside", name: "Riverside Municipal Services" },
    { id: "oakwood", name: "Oakwood County Tax Office" },
    { id: "metro", name: "Metropolis Public Works" },
    { id: "lakeside", name: "Lakeside District Authority" },
  ];

  constructor(
    private router: Router,
    private tokenRepository: TokenRepositoryService,
  ) {}

  ngOnInit(): void {
    this.userName = this.tokenRepository.getUserFullName() || "Admin User";
    this.userEmail = this.tokenRepository.getUserEmail() || "";
  }

  onEnterDashboard(): void {
    if (!this.selectedMunicipality) {
      return;
    }

    this.router.navigate(["/home"]);
  }

  onCreateMunicipality(): void {
    this.router.navigate(["/home/municipalities/add"]);
  }

  onGlobalConfig(): void {
    this.router.navigate(["/home/settings"]);
  }
}
