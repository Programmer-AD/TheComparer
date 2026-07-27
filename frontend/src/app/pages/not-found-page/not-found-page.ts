import { Component, effect, inject } from '@angular/core';
import { PageSetupService } from '../../utils';

@Component({
    selector: 'app-not-found-page',
    imports: [],
    templateUrl: './not-found-page.html',
    styleUrl: './not-found-page.scss',
})
export class NotFoundPage {
    private pageSetupService = inject(PageSetupService);

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage("Not found", "/");
        })
    }
}
