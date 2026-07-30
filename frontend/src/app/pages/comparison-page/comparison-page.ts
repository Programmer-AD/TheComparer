import { Component, effect, inject, input } from '@angular/core';
import { PageSetupService } from '../../utils';
import { ComparisonSession } from '../../models';

@Component({
    selector: 'app-comparison-page',
    imports: [],
    templateUrl: './comparison-page.html',
    styleUrl: './comparison-page.scss',
})
export class ComparisonPage {
    private pageSetupService = inject(PageSetupService);

    public comparisonSession = input.required<ComparisonSession>();

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage(`Comparing items from "${this.comparisonSession().itemPackName}"`, "/");
        })
    }
}
