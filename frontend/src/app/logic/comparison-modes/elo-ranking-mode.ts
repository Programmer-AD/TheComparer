import { ComparisonMode } from "./comparison-mode";

export class EloRankingMode implements ComparisonMode {
    public id: string = "elo_ranking";
    public name: string = "ELO Ranking";
    public description: string = [
        "ELO Ranking is mode where the item rating is built using ELO System.",
        "It allows to build a full overview of your preferences."
    ].join(" ");

    // TODO: make configurable in next version
    private readonly roundCount = 5;

    public estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        return this.roundCount * itemCount / 2;
    }
}
