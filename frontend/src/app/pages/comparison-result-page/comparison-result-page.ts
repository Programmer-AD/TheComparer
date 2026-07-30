import { Component, effect, inject, input } from '@angular/core';
import { PageSetupService } from '../../utils';
import { ComparisonSession } from '../../models';

@Component({
    selector: 'app-comparison-result-page',
    imports: [],
    templateUrl: './comparison-result-page.html',
    styleUrl: './comparison-result-page.scss',
})
export class ComparisonResultPage {
    private pageSetupService = inject(PageSetupService);

    public comparisonSession = input.required<ComparisonSession>();

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage(`Result of comparing "${this.comparisonSession().itemPackName}"`, "/");
        })
    }
}
