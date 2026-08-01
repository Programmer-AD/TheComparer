import { ComparisonModeConstants, ComparisonMode } from ".";
import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
import { ArrayExtensions, MapExtensions } from "../extensions";

export class EloRankingMode extends ComparisonMode {
    // This may be configurable in next version
    private readonly roundCount = 5;
    private readonly ratingCoefficient = 200;
    private readonly maxRatingDifference = 400;
    private readonly defaultRating = 2000;

    public constructor() {
        super(
            ComparisonModeConstants.eloRankingModeId,
            "ELO Ranking",
            [
                "ELO Ranking is mode where the item rating is built using ELO System.",
                "It allows to build a full overview of your preferences."
            ],
            true,
        );
    }

    public override estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        return Math.ceil(this.roundCount * itemCount / 2);
    }

    protected override getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] | undefined {
        const customData = <EloRatingModeCustomData>comparisonSession.customModeData;

        const possibleFirstItems = this.getItemsWithMinimalComparisons(itemPack.items, customData);
        const maxRating = MapExtensions.getMaxValue(customData.itemRatings, possibleFirstItems.map(x => x.id), this.defaultRating);
        const maxRatedItems = possibleFirstItems.filter(x => this.getItemRating(x.id, customData) === maxRating);
        const firstItem = ArrayExtensions.getRandomElement(maxRatedItems);
        if (firstItem === undefined) {
            // This must not ever happen, but we do not want to fail
            console.error("ELO Rating was not able to select first item");
            return undefined;
        }

        const firstItemRating = this.getItemRating(firstItem.id, customData);

        // Recalculate remaining since it could be that there was odd item count, so one item needs to be compared with one from next round
        const possibleSecondItems = this.getItemsWithMinimalComparisons(itemPack.items.filter(x => x.id !== firstItem.id), customData);
        const possibleSecondItemsWithNearRating = possibleSecondItems.filter(possibleSecondItem => {
            const possibleSecondItemRating = this.getItemRating(possibleSecondItem.id, customData);
            return Math.abs(firstItemRating - possibleSecondItemRating) <= this.maxRatingDifference;
        });

        const secondItem = ArrayExtensions.getRandomElement(possibleSecondItemsWithNearRating);
        if (secondItem !== undefined) {
            return [firstItem, secondItem];
        }

        // If no item with allowed difference - just get some possible item
        const fallbackSecondItem = ArrayExtensions.getRandomElement(possibleSecondItems);
        if (fallbackSecondItem === undefined) {
            // This must not ever happen, but we do not want to fail
            console.error("ELO Rating was not able to select second item");
            return undefined;
        }

        return [firstItem, fallbackSecondItem];

    }

    protected override handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void {
        const customData = <EloRatingModeCustomData>comparisonSession.customModeData;

        for (const itemId of selection.optionItemIds) {
            MapExtensions.incrementValue(customData.comparisonTimes, itemId);
        }

        // Update rating
        const [firstItemId, secondItemId] = selection.optionItemIds;
        const firstItemRating = this.getItemRating(firstItemId, customData);
        const secondItemRating = this.getItemRating(secondItemId, customData);
        const firstItemOutcome = selection.selectedItemId === undefined ? 0.5 : selection.selectedItemId === firstItemId ? 1 : 0;
        const secondItemOutcome = selection.selectedItemId === undefined ? 0.5 : selection.selectedItemId === secondItemId ? 1 : 0;

        customData.itemRatings.set(firstItemId, this.getNewEloRating(firstItemRating, secondItemRating, firstItemOutcome));
        customData.itemRatings.set(secondItemId, this.getNewEloRating(secondItemRating, firstItemRating, secondItemOutcome));
    }

    public override getResult(comparisonSession: ComparisonSession, itemPack: ItemPack): EloRatingModeResult {
        const modeData = <EloRatingModeCustomData>comparisonSession.customModeData;

        const result = itemPack.items.map(item => {
            const rating = modeData.itemRatings.get(item.id)!;
            return ({ ...item, rating: rating });
        });

        result.sort((a, b) => b.rating - a.rating);

        return result;
    }

    protected override ensureCustomModeDataInited(comparisonSession: ComparisonSession): void {
        comparisonSession.customModeData = new EloRatingModeCustomData();
    }

    private getItemsWithMinimalComparisons(items: Item[], customData: EloRatingModeCustomData): Item[] {
        const minimalComparisons = MapExtensions.getMinValue(customData.comparisonTimes, items.map(x => x.id), 0);
        const itemsWithMinimalComparisons = items.filter(x => MapExtensions.getValueOrDefault(customData.comparisonTimes, x.id, 0) === minimalComparisons);
        return itemsWithMinimalComparisons;
    }

    private getItemRating(itemId: string, customData: EloRatingModeCustomData): number {
        return MapExtensions.getValueOrDefault(customData.itemRatings, itemId, this.defaultRating)
    }

    private getNewEloRating(
        currentRating: number,
        opponentRating: number,
        comparisonResult: number): number {
        const estimatedResult = 1 / (1 + 10 ** ((opponentRating - currentRating) / 400));
        const newRating = currentRating + this.ratingCoefficient * (comparisonResult - estimatedResult);
        return Math.round(newRating);
    }
}

class EloRatingModeCustomData {
    public comparisonTimes = new Map<string, number>();
    public itemRatings = new Map<string, number>();
}

export type EloRatingModeResult = (Item & { rating: number })[];
