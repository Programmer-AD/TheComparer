import { Component, inject, OnInit } from '@angular/core';
import { PageSetupService } from '../../utils/page-setup-service';

@Component({
  selector: 'app-pack-management-page',
  imports: [],
  templateUrl: './pack-management-page.html',
  styleUrl: './pack-management-page.scss',
})
export class PackManagementPage implements OnInit {
  private pageSetupService = inject(PageSetupService);

  ngOnInit(): void {
    this.pageSetupService.setupPage("Pack management", "/");
  }
}
