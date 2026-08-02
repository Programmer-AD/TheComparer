import { Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { PageSetupService } from '../../utils';
import { ItemPackService } from '../../logic';
import { ItemPack } from '../../models';
import { ShortTextInputComponent, LongTextInputComponent, ImageInputComponent, ModalDialogComponent } from "../../components";

@Component({
    selector: 'app-pack-management-page',
    imports: [ShortTextInputComponent, LongTextInputComponent, ImageInputComponent, ModalDialogComponent],
    templateUrl: './pack-management-page.html',
    styleUrl: './pack-management-page.scss',
})
export class PackManagementPage {
    private pageSetupService = inject(PageSetupService);
    private itemPackService = inject(ItemPackService);

    public itemPack = input.required<ItemPack>();

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
        effect(async () => {
            // TODO: Fix flickering
            await this.initFormDataAsync();
        });
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

    protected async onSaveButtonClick(): Promise<void> {
        const questions = this.packProperties.questions()
            .replaceAll("\r", "")
            .split("\n")
            .map(x => x.trim())
            .filter(x => x !== "");

        const updatedItemPack: ItemPack = {
            id: this.itemPack().id,
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
            })).sort((a, b) => a.name.localeCompare(b.name)),
        };

        this.itemPackService.upsertAsync(updatedItemPack);

        alert("Saved successfully");
    }

    private async initFormDataAsync(): Promise<void> {
        const itemPack = this.itemPack();
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
