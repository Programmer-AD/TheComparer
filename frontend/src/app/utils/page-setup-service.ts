import { inject, Service, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Service()
export class PageSetupService {
    private titleService = inject(Title);

    public pageTitle = signal("TheComparer");
    public backUrl = signal("");

    public setupPage(title: string, backUrl: string | null = null) {
        this.titleService.setTitle(title);
        this.pageTitle.set(title);
        this.backUrl.set(backUrl ?? "");
    }
}
