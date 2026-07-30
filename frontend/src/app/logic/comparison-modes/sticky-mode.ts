import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
import { ComparisonMode } from "./comparison-mode";

export class StickyMode extends ComparisonMode {
    public constructor() {
        super(
            "sticky",
            "Sticky",
            [
                "Sticky mode is mode where the item that wins comparison stays for next round, but another one goes away forever.",
                "It is suitable to find a single wining option in a fast way."
            ],
            false,
        );
    }

    public estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        return itemCount - 1;
    }

    protected getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] {
        const customData = <StickModeCustomData>comparisonSession.customModeData;
        const selections = comparisonSession.selections;

        let firstItem;
        if (selections.length === 0) {
            firstItem = this.getRandomItem(itemPack.items);
        } else {
            const lastSelection = selections[selections.length - 1];
            const lastSelectedItemId = lastSelection.selectedItemId;
            if (lastSelectedItemId === undefined) {
                throw new Error("Sticky mode somehow had 'Equals' selection!");
            }

            firstItem = this.getItem(itemPack, lastSelectedItemId);
        }

        const notRejectedItems = itemPack.items.filter(x => !customData.rejectedItemIds.has(x.id) && x.id !== firstItem.id);
        if (notRejectedItems.length === 0) {
            // That's an error, but we do not want to fail
            return [firstItem, firstItem];
        }

        const secondItem = this.getRandomItem(notRejectedItems);
        return [firstItem, secondItem];
    }

    protected handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void {
        const customData = <StickModeCustomData>comparisonSession.customModeData;

        const rejectedItemIds = selection.optionItemIds.filter(x => x !== selection.selectedItemId);
        for (const rejectedItemId of rejectedItemIds) {
            customData.rejectedItemIds.add(rejectedItemId);
        }
    }

    protected ensureCustomModeDataInited(comparisonSession: ComparisonSession): void {
        comparisonSession.customModeData = new StickModeCustomData();
    }
}

class StickModeCustomData {
    public rejectedItemIds = new Set<string>();
}
