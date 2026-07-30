import { ComparisonSession, Item } from "../../models";
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

    public async getItemsToCompareAsync(comparisonSession: ComparisonSession): Promise<[Item, Item] | undefined> {
        // TODO: Implment
        const itemPack = await this.getItemPackAsync(comparisonSession.itemPackId);
        return [itemPack.items[0], itemPack.items[1]];
    }
}
