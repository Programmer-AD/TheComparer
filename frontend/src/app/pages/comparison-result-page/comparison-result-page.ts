import { Component, inject, OnInit } from '@angular/core';
import { PageSetupService } from '../../utils/page-setup-service';

@Component({
  selector: 'app-comparison-result-page',
  imports: [],
  templateUrl: './comparison-result-page.html',
  styleUrl: './comparison-result-page.scss',
})
export class ComparisonResultPage implements OnInit {
  private pageSetupService = inject(PageSetupService);

  ngOnInit(): void {
    this.pageSetupService.setupPage("Result of comparison", "/");
  }
}
