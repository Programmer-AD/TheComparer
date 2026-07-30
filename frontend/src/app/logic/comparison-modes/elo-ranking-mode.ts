import { ComparisonSession, Item } from "../../models";
import { ComparisonMode } from "./comparison-mode";

export class EloRankingMode extends ComparisonMode {
    // TODO: make configurable in next version
    private readonly roundCount = 5;

    public constructor() {
        super(
            "elo_ranking",
            "ELO Ranking",
            [
                "ELO Ranking is mode where the item rating is built using ELO System.",
                "It allows to build a full overview of your preferences."
            ],
            true,
        );
    }

    public estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        return this.roundCount * itemCount / 2;
    }

    public async getItemsToCompareAsync(comparisonSession: ComparisonSession): Promise<[Item, Item] | undefined> {
        // TODO: Implment
        const itemPack = await this.getItemPackAsync(comparisonSession.itemPackId);
        return [itemPack.items[0], itemPack.items[1]];
    }
}
