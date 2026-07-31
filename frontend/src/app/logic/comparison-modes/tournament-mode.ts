import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
import { ArrayExtensions, MapExtensions } from "../extensions";
import { ComparisonMode } from "./comparison-mode";

export class TournamentMode extends ComparisonMode {
    public constructor() {
        super(
            "tournament",
            "Tournament",
            [
                "Tournament mode is mode where items are compared like teams on tournament - winners go to next round and compared with each other, while others get dropped.",
                "It is suitable to find the best item and track other preferences.",
                "This mode does not provide real rating-like evaluation since it could be that all items in one semi-finalist path would be worse then all in another one which makes it a uneven."
            ],
            false,
        );
    }

    public override estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        let estimate = 0;
        let remainingItemCount = itemCount;
        while (remainingItemCount > 1) {
            let pairCount = Math.floor(remainingItemCount / 2);
            let leftoverItem = remainingItemCount % 2;
            estimate += pairCount;
            remainingItemCount = pairCount + leftoverItem;
        }

        return estimate;
    }

    protected override getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] | undefined {
        const customData = <TournamentModeCustomData>comparisonSession.customModeData;

        const remainingItems = itemPack.items.filter(x => !customData.rejectedItemIds.has(x.id));
        const firstItem = this.getRandomItemWithMinimalComparisons(remainingItems, customData);
        if (firstItem === undefined) {
            // This can occur only if all expected comparisons are done
            return undefined;
        }

        const remainingItemsForSecond = remainingItems.filter(x => x.id !== firstItem.id);
        const secondItem = this.getRandomItemWithMinimalComparisons(remainingItemsForSecond, customData);
        if (secondItem === undefined) {
            // This can occur only if all expected comparisons are done
            return undefined;
        }

        return [firstItem, secondItem];
    }

    protected override handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void {
        const customData = <TournamentModeCustomData>comparisonSession.customModeData;

        const rejectedItemIds = selection.optionItemIds.filter(x => x !== selection.selectedItemId);
        for (const rejectedItemId of rejectedItemIds) {
            customData.rejectedItemIds.add(rejectedItemId);
        }

        for (const itemId of selection.optionItemIds) {
            MapExtensions.incrementValue(customData.comparisonTimes, itemId);
        }
    }

    protected override ensureCustomModeDataInited(comparisonSession: ComparisonSession): void {
        comparisonSession.customModeData = new TournamentModeCustomData();
    }

    private getRandomItemWithMinimalComparisons(items: Item[], customData: TournamentModeCustomData): Item | undefined {
        const minimalComparisons = MapExtensions.getMinValue(customData.comparisonTimes, items.map(x => x.id), 0);
        const itemsWithMinimalComparisons = items.filter(x => MapExtensions.getValueOrDefault(customData.comparisonTimes, x.id, 0) === minimalComparisons);
        const item = ArrayExtensions.getRandomElement(itemsWithMinimalComparisons);
        return item;
    }
}

class TournamentModeCustomData {
    public rejectedItemIds = new Set<string>();
    public comparisonTimes = new Map<string, number>();
}
