import { ComparisonModeConstants, ComparisonMode } from ".";
import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
import { ArrayExtensions } from "../extensions";

export class StickyMode extends ComparisonMode {
    public constructor() {
        super(
            ComparisonModeConstants.stickyModeId,
            "Sticky compare",
            [
                "Sticky compare mode is mode where the item that wins comparison stays for next round, but another one goes away forever.",
                "It is suitable to find a single wining option in a fast way."
            ],
            false,
        );
    }

    public override estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        return itemCount - 1;
    }

    public override getResult(comparisonSession: ComparisonSession, itemPack: ItemPack): StickyModeResult {
        const lastSelection = ArrayExtensions.getLastElement(comparisonSession.selections);
        const itemThatStayed = itemPack.items.find(x => x.id === lastSelection?.selectedItemId);
        return itemThatStayed;
    }

    protected override getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] | undefined {
        const customData = <StickModeCustomData>comparisonSession.customModeData;

        let firstItem: Item;
        const lastSelection = ArrayExtensions.getLastElement(comparisonSession.selections);
        if (lastSelection !== undefined) {
            // If last selection exists - get selected item
            const lastSelectedItemId = lastSelection.selectedItemId;
            if (lastSelectedItemId === undefined) {
                throw new Error("Sticky mode somehow had 'Equals' selection!");
            }

            firstItem = this.getItem(itemPack, lastSelectedItemId);
        } else {
            // If no last selection (when its first selection in session) - get random item
            firstItem = ArrayExtensions.getRandomElement(itemPack.items)!;
        }

        const remainingItems = itemPack.items.filter(x => !customData.rejectedItemIds.has(x.id) && x.id !== firstItem.id);
        const secondItem = ArrayExtensions.getRandomElement(remainingItems);
        if (secondItem === undefined) {
            // This can occur only if all expected comparisons are done
            return undefined;
        }

        return [firstItem, secondItem];
    }

    protected override handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void {
        const customData = <StickModeCustomData>comparisonSession.customModeData;

        const rejectedItemIds = selection.optionItemIds.filter(x => x !== selection.selectedItemId);
        for (const rejectedItemId of rejectedItemIds) {
            customData.rejectedItemIds.add(rejectedItemId);
        }
    }

    protected override ensureCustomModeDataInited(comparisonSession: ComparisonSession): void {
        comparisonSession.customModeData = new StickModeCustomData();
    }
}

class StickModeCustomData {
    public rejectedItemIds = new Set<string>();
}

export type StickyModeResult = Item | undefined;
