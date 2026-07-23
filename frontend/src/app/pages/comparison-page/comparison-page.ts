import { Component, inject, OnInit } from '@angular/core';
import { PageSetupService } from '../../utils/page-setup-service';

@Component({
  selector: 'app-comparison-page',
  imports: [],
  templateUrl: './comparison-page.html',
  styleUrl: './comparison-page.scss',
})
export class ComparisonPage implements OnInit {
  private pageSetupService = inject(PageSetupService);

  ngOnInit(): void {
    this.pageSetupService.setupPage("Comparing things", "/");
  }
}
