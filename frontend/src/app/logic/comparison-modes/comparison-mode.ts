import { inject } from "@angular/core";
import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
import { ItemPackService, ComparisonSessionService } from "..";

export abstract class ComparisonMode {
    protected itemPackService = inject(ItemPackService);
    protected comparisonSessionService = inject(ComparisonSessionService);

    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly allowsEqual: boolean;

    constructor(
        id: string,
        name: string,
        descriptionLines: string[],
        allowsEquals: boolean) {
        this.id = id;
        this.name = name;
        this.description = descriptionLines.join(" ");
        this.allowsEqual = allowsEquals;
    }

    abstract estimateComparisonCount(itemCount: number): number | undefined;

    abstract getItemsToCompareAsync(comparisonSession: ComparisonSession): Promise<[Item, Item] | undefined>;

    public async getProgressAsync(comparisonSession: ComparisonSession): Promise<{ completed: number, estimatedTotal: number }> {
        const itemPack = await this.getItemPackAsync(comparisonSession.itemPackId);

        return ({
            completed: comparisonSession.selections.length,
            estimatedTotal: this.estimateComparisonCount(itemPack.items.length) ?? -1,
        });
    }

    public async setSelectionAsync(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): Promise<void> {
        // We can mutate selections since they are not shown on UI on this stage
        comparisonSession.selections.push(selection);
        await this.saveComparisonSessionAsync(comparisonSession);
    };

    protected async getItemPackAsync(itemPackId: string): Promise<ItemPack> {
        const itemPack = await this.itemPackService.getByIdAsync(itemPackId);
        if (itemPack === undefined) {
            throw new Error(`Active item pack "${itemPackId}" was not found. Maybe it was concurrently removed?`);
        }

        return itemPack;
    }

    protected saveComparisonSessionAsync(comparisonSession: ComparisonSession): Promise<void> {
        return this.comparisonSessionService.upsertAsync(comparisonSession);
    }
}
