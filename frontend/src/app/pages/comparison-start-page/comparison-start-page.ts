import { Component, inject, OnInit } from '@angular/core';
import { PageSetupService } from '../../utils/page-setup-service';

@Component({
  selector: 'app-comparison-start-page',
  imports: [],
  templateUrl: './comparison-start-page.html',
  styleUrl: './comparison-start-page.scss',
})
export class ComparisonStartPage implements OnInit {
  private pageSetupService = inject(PageSetupService);

  ngOnInit(): void {
    this.pageSetupService.setupPage("Setup comparison", "/");
  }
}
