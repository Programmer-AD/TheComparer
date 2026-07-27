import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PageSetupService } from './utils';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './app.scss'
})
export class App {
    private pageSetupService = inject(PageSetupService);
    private router = inject(Router);

    protected readonly pageTitle = computed(() => this.pageSetupService.pageTitle())
    protected readonly backUrl = computed(() => this.pageSetupService.backUrl());
    protected readonly hasBackUrl = computed(() => this.backUrl().length > 0);

    protected readonly currentYear = new Date().getFullYear();

    protected onBackClick() {
        this.router.navigate([this.backUrl()]);
    }
}
