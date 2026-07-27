import { Component, effect, inject } from '@angular/core';
import { PageSetupService } from '../../utils';

@Component({
    selector: 'app-comparison-start-page',
    imports: [],
    templateUrl: './comparison-start-page.html',
    styleUrl: './comparison-start-page.scss',
})
export class ComparisonStartPage {
    private pageSetupService = inject(PageSetupService);

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage("Setup comparison", "/");
        })
    }
}
