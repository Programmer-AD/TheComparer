import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomNavigationService, PageSetupService } from '../../utils';
import { ItemPackService } from '../../logic';
import { Item } from '../../models';
import { ShortTextInputComponent, LongTextInputComponent, ImageInputComponent } from "../../components";

@Component({
    selector: 'app-pack-management-page',
    imports: [ShortTextInputComponent, LongTextInputComponent, ImageInputComponent],
    templateUrl: './pack-management-page.html',
    styleUrl: './pack-management-page.scss',
})
export class PackManagementPage {
    private router = inject(Router);
    private pageSetupService = inject(PageSetupService);
    private customNavigationService = inject(CustomNavigationService);
    private itemPackService = inject(ItemPackService);

    // From route
    public itemPackId = input.required<string>();

    _temp = signal<number>(0);
    protected packProperties = {
        name: signal<string>(""),
        author: signal<string>(""),
        icon: signal<string>(""),
        description: signal<string>(""),
        questions: [],
        items: [],
    };

    constructor() {
        effect(() => {
            const itemPack = this.itemPackService.getById(this.itemPackId());
            if (itemPack === undefined) {
                this.customNavigationService.showNotFoundPage();
                return;
            }

            this.pageSetupService.setupPage(`Manage pack "${itemPack.name}"`, "/");
        })
    }

    onAddItemClick() {
        throw new Error('Method not implemented.');
    }

    onItemRowClick(item: Item) {
        throw new Error('Method not implemented.');
    }

    onDeleteItemClick($event: PointerEvent, item: Item) {
        throw new Error('Method not implemented.');
    }
}
