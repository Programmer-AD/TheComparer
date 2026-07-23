import { Component, inject, OnInit } from '@angular/core';
import { PageSetupService } from '../../utils/page-setup-service';

@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage implements OnInit {
  private pageSetupService = inject(PageSetupService);

  ngOnInit(): void {
    this.pageSetupService.setupPage("Not found", "/");
  }
}
