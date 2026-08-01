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

    public abstract estimateComparisonCount(itemCount: number): number | undefined;

    public abstract getResult(comparisonSession: ComparisonSession, itemPack: ItemPack): unknown;

    public async getComparisonStateAsync(comparisonSession: ComparisonSession): Promise<ComparisonState> {
        const itemPack = await this.getItemPackAsync(comparisonSession.itemPackId);

        if (comparisonSession.customModeData === undefined) {
            this.ensureCustomModeDataInited(comparisonSession);
        }

        const itemsToCompare = this.getItemsToCompare(comparisonSession, itemPack);
        const estimatedTotalComparisons = this.estimateComparisonCount(itemPack.items.length) ?? -1;
        const completedComparisons = comparisonSession.selections.length;

        return ({
            estimatedTotalComparisons: estimatedTotalComparisons,
            completedComparisons: completedComparisons,
            items: itemsToCompare,
        });
    }

    public async setSelectionAsync(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): Promise<void> {
        const itemPack = await this.getItemPackAsync(comparisonSession.itemPackId);

        // We can mutate selections since they are not shown on UI on this stage
        comparisonSession.selections.push(selection);

        // Do handling related to selection (if any)
        this.handleSelection(comparisonSession, selection);

        const estimatedTotalComparisons = this.estimateComparisonCount(itemPack.items.length) ?? -1;
        const completedComparisons = comparisonSession.selections.length;

        // Mark as done if this was last selection
        if (completedComparisons >= estimatedTotalComparisons && comparisonSession.endDate === undefined) {
            comparisonSession.endDate = new Date();
        }

        await this.comparisonSessionService.upsertAsync(comparisonSession);
    };

    protected abstract getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] | undefined;

    protected abstract handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void;

    protected abstract ensureCustomModeDataInited(comparisonSession: ComparisonSession): void;

    protected getItem(itemPack: ItemPack, id: string): Item {
        const result = itemPack.items.find(x => x.id === id);
        if (result === undefined) {
            throw new Error(`Item with id "${id}" was not found in pack "${itemPack.id}`);
        }

        return result;
    }

    private async getItemPackAsync(itemPackId: string): Promise<ItemPack> {
        const itemPack = await this.itemPackService.getByIdAsync(itemPackId);
        if (itemPack === undefined) {
            throw new Error(`Active item pack "${itemPackId}" was not found. Maybe it was concurrently removed?`);
        }

        return itemPack;
    }
}

export interface ComparisonState {
    estimatedTotalComparisons: number;
    completedComparisons: number;
    items: [Item, Item] | undefined;
}
