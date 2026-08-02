import { Component, effect, inject, input } from '@angular/core';
import { PageSetupService } from '../../utils';

@Component({
    selector: 'app-page-title-component',
    imports: [],
    templateUrl: './page-title-component.html',
    styleUrl: './page-title-component.scss',
})
export class PageTitleComponent {
    private pageSetupService = inject(PageSetupService);

    public titleText = input.required<string>();
    public backButtonUrl = input<string | null>(null);

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage(
                this.titleText(),
                this.backButtonUrl()
            );
        })
    }
}
