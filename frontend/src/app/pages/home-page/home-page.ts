import { Component, computed, effect, inject, signal } from '@angular/core';
import { PageSetupService, FileInteractionService } from '../../utils';
import { ComparisonSessionService, ItemPackService } from '../../logic';
import { ComparisonSession, ItemPack } from '../../models';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-page',
    imports: [],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
})
export class HomePage {
    private router = inject(Router);
    private pageSetupService = inject(PageSetupService);
    private fileInteractionService = inject(FileInteractionService);
    private comparisonSessionService = inject(ComparisonSessionService);
    private itemPackService = inject(ItemPackService);

    protected readonly itemPacks = signal<ItemPack[]>([]);
    private readonly comparisonSessions = signal<ComparisonSession[]>([]);
    protected readonly sessionFilterValue = signal<number>(0);
    protected readonly filteredComparisonSessions = computed(() => {
        const sessions = this.comparisonSessions();
        const sessionFilterValue = this.sessionFilterValue();

        sessions.sort((a, b) => b.startDate.toISOString().localeCompare(a.startDate?.toISOString()));

        return sessions.filter(session => {
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

    constructor() {
        effect(() => {
            this.pageSetupService.setupPage("Welcome to TheComparer", null);
            this.refreshComparisonSessions();
            this.refreshItemPacks();
        })
    }

    protected onCreateNewPackClick() {
        this.itemPackService.createNew();
        this.refreshItemPacks();
    }

    protected async onImportPackClick() {
        const file = await this.fileInteractionService.selectFileAsync();
        if (file === undefined) {
            return;
        }

        const data = await file.text();
        this.itemPackService.import(data);
        this.refreshItemPacks();
    }

    protected onPackRowClick(itemPack: ItemPack) {
        this.router.navigate(["comparison/start", itemPack.id]);
    }

    protected onEditPackClick(event: Event, itemPack: ItemPack) {
        event.stopPropagation();

        this.router.navigate(["pack-management", itemPack.id]);
    }

    protected onDownloadPackClick(event: Event, itemPack: ItemPack) {
        event.stopPropagation();

        const data = this.itemPackService.export(itemPack.id);
        this.fileInteractionService.downloadFile(`${itemPack.id}.pack`, data);
    }

    protected onDeleteClick(event: Event, itemPack: ItemPack) {
        event.stopPropagation();

        if (confirm(`Are you sure you want to delete item pack "${itemPack.name}"?`)) {
            this.itemPackService.delete(itemPack.id);
            this.refreshItemPacks();
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

    private refreshComparisonSessions() {
        const comparisonSessions = this.comparisonSessionService.getAll();
        this.comparisonSessions.set(comparisonSessions);
    }

    private refreshItemPacks() {
        const itemPacks = this.itemPackService.getAll();
        this.itemPacks.set(itemPacks);
    }
}
