import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
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


    public estimateComparisonCount(itemCount: number): number | undefined {
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

    protected getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] {
        const customData = <TournamentModeCustomData>comparisonSession.customModeData;

        const remainingItems = itemPack.items.filter(x => !customData.rejectedItemIds.has(x.id));
        if (remainingItems.length < 2) {
            // That's an error, but we do not want to fail
            return [itemPack.items[0], itemPack.items[0]];
        }

        const firstItem = this.getRandomItemWithMinimalComparisons(remainingItems, customData);

        const remainingItemsForSecond = remainingItems.filter(x => x.id !== firstItem.id);
        const secondItem = this.getRandomItemWithMinimalComparisons(remainingItemsForSecond, customData);

        return [firstItem, secondItem];
    }

    protected handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void {
        const customData = <TournamentModeCustomData>comparisonSession.customModeData;

        const rejectedItemIds = selection.optionItemIds.filter(x => x !== selection.selectedItemId);
        for (const rejectedItemId of rejectedItemIds) {
            customData.rejectedItemIds.add(rejectedItemId);
        }

        for (const itemId of selection.optionItemIds) {
            const comparedTimes = customData.comparisonTimes.has(itemId)
                ? customData.comparisonTimes.get(itemId)! + 1
                : 1;

            customData.comparisonTimes.set(itemId, comparedTimes);
        }
    }

    protected ensureCustomModeDataInited(comparisonSession: ComparisonSession): void {
        comparisonSession.customModeData = new TournamentModeCustomData();
    }

    private getRandomItemWithMinimalComparisons(items: Item[], customData: TournamentModeCustomData): Item {
        const minimalComparisons = items.map(x => customData.comparisonTimes.get(x.id) ?? 0).reduce((a, b) => Math.min(a, b));
        console.log(minimalComparisons);
        const itemsWithMinimalComparisons = items.filter(x => (customData.comparisonTimes.get(x.id) ?? 0) === minimalComparisons);
        const item = this.getRandomItem(itemsWithMinimalComparisons);
        return item;
    }
}

class TournamentModeCustomData {
    public rejectedItemIds = new Set<string>();
    public comparisonTimes = new Map<string, number>();
}
