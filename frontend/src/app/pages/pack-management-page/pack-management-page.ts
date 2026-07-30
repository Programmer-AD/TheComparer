import { Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { CustomNavigationService, PageSetupService } from '../../utils';
import { ItemPackService } from '../../logic';
import { Item, ItemPack } from '../../models';
import { ShortTextInputComponent, LongTextInputComponent, ImageInputComponent, ModalDialogComponent } from "../../components";

@Component({
    selector: 'app-pack-management-page',
    imports: [ShortTextInputComponent, LongTextInputComponent, ImageInputComponent, ModalDialogComponent],
    templateUrl: './pack-management-page.html',
    styleUrl: './pack-management-page.scss',
})
export class PackManagementPage {
    private pageSetupService = inject(PageSetupService);
    private customNavigationService = inject(CustomNavigationService);
    private itemPackService = inject(ItemPackService);

    // From route
    public itemPackId = input.required<string>();

    protected packProperties = {
        name: signal<string>(""),
        author: signal<string>(""),
        icon: signal<string | undefined>(""),
        description: signal<string>(""),
        questions: signal<string>(""),
        items: signal<MutableItemRow[]>([]),
    };
    protected selectedItem = signal<MutableItemRow | undefined>(undefined);

    constructor() {
        effect(() => {
            this.initFormData();
        })
    }

    protected onAddItemClick(): void {
        this.packProperties.items.update(rows => rows.concat([{
            id: crypto.randomUUID(),
            name: signal<string>("New item"),
            icon: signal<string | undefined>(undefined),
            description: signal<string>(""),
        }]));
    }

    protected onItemRowClick(itemRow: MutableItemRow): void {
        this.selectedItem.set(itemRow);
    }

    protected onItemEditModalClosing(): void {
        this.selectedItem.set(undefined);
    }

    protected onDeleteItemClick(event: PointerEvent, itemRow: MutableItemRow): void {
        event.stopPropagation();

        if (confirm(`Are you sure you want to delete item  "${itemRow.name()}"?`)) {
            this.packProperties.items.update(rows => rows.filter(x => x.id !== itemRow.id));
        }
    }

    protected onSaveButtonClick(): void {
        const questions = this.packProperties.questions()
            .replaceAll("\r", "")
            .split("\n")
            .map(x => x.trim())
            .filter(x => x !== "");

        const updatedItemPack: ItemPack = {
            id: this.itemPackId(),
            name: this.packProperties.name().trim(),
            author: makeUndefinedIfEmpty(this.packProperties.author().trim()),
            icon: this.packProperties.icon(),
            description: makeUndefinedIfEmpty(this.packProperties.description().trim()),
            questions: questions,
            items: this.packProperties.items().map(itemRow => ({
                id: itemRow.id,
                name: itemRow.name().trim(),
                icon: itemRow.icon(),
                description: makeUndefinedIfEmpty(itemRow.description().trim()),
            })),
        };

        this.itemPackService.update(updatedItemPack);
        this.initFormData();

        alert("Saved successfully");
    }

    private initFormData(): void {
        const itemPack = this.itemPackService.getById(this.itemPackId());
        if (itemPack === undefined) {
            this.customNavigationService.showNotFoundPage();
            return;
        }

        this.pageSetupService.setupPage(`Manage pack "${itemPack.name}"`, "/");

        this.packProperties.name.set(itemPack.name);
        this.packProperties.author.set(itemPack.author ?? "");
        this.packProperties.icon.set(itemPack.icon);
        this.packProperties.description.set(itemPack.description ?? "");
        this.packProperties.questions.set(itemPack.questions.join("\r\n"));
        this.packProperties.items.set(itemPack.items.map(item => ({
            id: item.id,
            name: signal<string>(item.name),
            icon: signal<string | undefined>(item.icon),
            description: signal<string>(item.description ?? "")
        })));
    }
}

function makeUndefinedIfEmpty(text: string): string | undefined {
    return text === "" ? undefined : text;
}

type MutableItemRow = {
    id: string,
    name: WritableSignal<string>,
    icon: WritableSignal<string | undefined>,
    description: WritableSignal<string>,
};
