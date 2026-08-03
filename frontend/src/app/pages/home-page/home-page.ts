import { Component, computed, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FileInteractionService } from '../../utils';
import { ComparisonModeService, ComparisonSessionService, ItemPackService } from '../../logic';
import { ComparisonSession, ItemPack } from '../../models';
import { PageTitleComponent } from "../../components";
import { LoadingPlaceholderPage } from "../loading-placeholder-page/loading-placeholder-page";

@Component({
    selector: 'app-home-page',
    imports: [PageTitleComponent, LoadingPlaceholderPage],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
})
export class HomePage {
    private router = inject(Router);
    private fileInteractionService = inject(FileInteractionService);
    private comparisonSessionService = inject(ComparisonSessionService);
    private comparisonModeService = inject(ComparisonModeService);
    private itemPackService = inject(ItemPackService);

    protected readonly itemPacksResource = resource({
        params: () => ({}),
        loader: () => this.itemPackService.getAllAsync(),
    });
    protected readonly comparisonSessionsResource = resource({
        params: () => ({}),
        loader: () => this.comparisonSessionService.getAllAsync(),
    });

    protected readonly sessionFilterValue = signal<number>(0);
    protected readonly filteredComparisonSessions = computed(() => {
        if (!this.comparisonSessionsResource.hasValue()) {
            return [];
        }

        const sessions = this.comparisonSessionsResource.value();
        const sessionFilterValue = this.sessionFilterValue();

        const extendedSessions = sessions.map(x => ({ ...x, comparisonModeName: this.comparisonModeService.getById(x.comparisonMode)!.name }));

        extendedSessions.sort((a, b) => b.startDate.toISOString().localeCompare(a.startDate?.toISOString()));

        return extendedSessions.filter(session => {
            switch (sessionFilterValue) {
                case 0:
                default:
                    return true;
                case 1:
                    return session.endDate === undefined;
                case 2:
                    return session.endDate !== undefined;
            }
        });
    });

    protected async onCreateNewPackClick(): Promise<void> {
        await this.itemPackService.createNewAsync();

        this.itemPacksResource.reload();
    }

    protected async onImportPackClick(): Promise<void> {
        const file = await this.fileInteractionService.selectFileAsync();
        if (file === undefined) {
            return;
        }

        const data = await file.text();
        await this.itemPackService.importAsync(data);

        this.itemPacksResource.reload();;
    }

    protected async onFetchCommonPacksClick() {
        const commonPacks = ["fruits-berries", "poe2-core-currency", "popular-cartoons"];
        // This should be made reusable whenever it would be necessary, also more user-friendly (loading spinner)
        const baseUrl = document.getElementsByTagName("base")[0].href;
        const packUrls = commonPacks.map(packName => `${baseUrl}common-packs/${packName}.pack`);

        for (const packUrl of packUrls) {
            const packData = await fetch(packUrl).then(x => x.text());
            await this.itemPackService.importAsync(packData);
        }

        this.itemPacksResource.reload();;
    }

    protected onPackRowClick(itemPack: ItemPack): void {
        this.router.navigate(["comparison/start", itemPack.id]);
    }

    protected onEditPackClick(event: Event, itemPack: ItemPack): void {
        event.stopPropagation();

        this.router.navigate(["pack-management", itemPack.id]);
    }

    protected async onDownloadPackClick(event: Event, itemPack: ItemPack): Promise<void> {
        event.stopPropagation();

        const data = await this.itemPackService.exportAsync(itemPack.id);
        this.fileInteractionService.downloadFile(`${itemPack.id}.pack`, data);
    }

    protected async onDeletePackClick(event: Event, itemPack: ItemPack): Promise<void> {
        event.stopPropagation();

        if (confirm(`Are you sure you want to delete item pack "${itemPack.name}"?`)) {
            await this.itemPackService.deleteAsync(itemPack.id);

            this.itemPacksResource.reload();;
        }
    }

    protected async onDeleteSessionClick(event: Event, comparisonSession: ComparisonSession): Promise<void> {
        event.stopPropagation();

        const modeName = this.comparisonModeService.getById(comparisonSession.comparisonMode)!.name;
        if (confirm(`Are you sure you want to delete session ${modeName} "${comparisonSession.itemPackName}"?`)) {
            await this.comparisonSessionService.deleteAsync(comparisonSession.id);

            this.comparisonSessionsResource.reload();
        }
    }

    protected onSessionFilterSelectionChange(event: Event) {
        const selectedValue = (<HTMLSelectElement>event.target).value;
        this.sessionFilterValue.set(parseInt(selectedValue));
    }

    protected onSessionRowClick(comparisonSession: ComparisonSession) {
        if (comparisonSession.endDate === undefined) {
            this.router.navigate(["comparison", comparisonSession.id]);
        } else {
            this.router.navigate(["comparison", comparisonSession.id, "result"]);
        }
    }
}
