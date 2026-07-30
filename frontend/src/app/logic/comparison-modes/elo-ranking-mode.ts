import { ComparisonSession, ComparisonSessionSelection, Item, ItemPack } from "../../models";
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

    protected getItemsToCompare(comparisonSession: ComparisonSession, itemPack: ItemPack): [Item, Item] {
        // TODO: Implment
        return [itemPack.items[0], itemPack.items[1]];

    }

    protected handleSelection(comparisonSession: ComparisonSession, selection: ComparisonSessionSelection): void {

    }

    protected override ensureCustomModeDataInited(comparisonSession: ComparisonSession): void {
        comparisonSession.customModeData = {};
    }
}
