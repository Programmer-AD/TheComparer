import { ComparisonSession, Item } from "../../models";
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
            let pairCount = remainingItemCount / 2;
            let leftoverItem = remainingItemCount % 2;
            estimate += pairCount;
            remainingItemCount = pairCount + leftoverItem;
        }

        return estimate;
    }

    public async getItemsToCompareAsync(comparisonSession: ComparisonSession): Promise<[Item, Item] | undefined> {
        // TODO: Implment
        const itemPack = await this.getItemPackAsync(comparisonSession.itemPackId);
        return [itemPack.items[0], itemPack.items[1]];
    }
}
