import { Component, effect, inject } from '@angular/core';
import { PageSetupService } from '../../utils';

@Component({
    selector: 'app-comparison-page',
    imports: [],
    templateUrl: './comparison-page.html',
    styleUrl: './comparison-page.scss',
})
export class ComparisonPage {
    private pageSetupService = inject(PageSetupService);

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage("Comparing things", "/");
        })
    }
}
