import { Component, inject, input, linkedSignal, resource, signal, WritableSignal } from '@angular/core';
import { ItemPackService } from '../../logic';
import { ItemPack } from '../../models';
import { ShortTextInputComponent, LongTextInputComponent, ImageInputComponent, ModalDialogComponent, PageTitleComponent } from "../../components";
import { LoadingPlaceholderPage } from "../loading-placeholder-page/loading-placeholder-page";
import { NotFoundPage } from "../not-found-page/not-found-page";

@Component({
    selector: 'app-pack-management-page',
    imports: [ShortTextInputComponent, LongTextInputComponent, ImageInputComponent, ModalDialogComponent, PageTitleComponent, LoadingPlaceholderPage, NotFoundPage],
    templateUrl: './pack-management-page.html',
    styleUrl: './pack-management-page.scss',
})
export class PackManagementPage {
    private itemPackService = inject(ItemPackService);

    public itemPackId = input.required<string>();

    protected itemPackResource = resource({
        params: () => this.itemPackId(),
        loader: ({ params: itemPackId }) => this.itemPackService.getByIdAsync(itemPackId),
    });

    protected packProperties = {
        name: linkedSignal<string>(() => this.itemPackResource.value()?.name ?? ""),
        author: linkedSignal<string>(() => this.itemPackResource.value()?.author ?? ""),
        icon: linkedSignal<string | undefined>(() => this.itemPackResource.value()?.icon),
        description: linkedSignal<string>(() => this.itemPackResource.value()?.description ?? ""),
        questions: linkedSignal<string>(() => this.itemPackResource.value()?.questions.join("\r\n") ?? ""),
        items: linkedSignal<MutableItemRow[]>(() => this.itemPackResource.value()?.items?.map(item => ({
            id: item.id,
            name: signal<string>(item.name),
            icon: signal<string | undefined>(item.icon),
            description: signal<string>(item.description ?? "")
        })) ?? []),
    };
    protected selectedItem = signal<MutableItemRow | undefined>(undefined);

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
            })).sort((a, b) => a.name.localeCompare(b.name)),
        };

        this.itemPackService.upsertAsync(updatedItemPack);

        this.itemPackResource.reload();
        alert("Saved successfully");
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
