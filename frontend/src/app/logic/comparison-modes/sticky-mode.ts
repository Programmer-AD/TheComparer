import { ComparisonMode } from "./comparison-mode";

export class StickyMode implements ComparisonMode {
    public id: string = "sticky";
    public name: string = "Sticky";
    public description: string = [
        "Sticky mode is mode where the item that wins comparison stays for next round, but another one goes away forever.",
        "It is suitable to find a single wining option in a fast way."
    ].join(" ");

    public estimateComparisonCount(itemCount: number): number | undefined {
        if (itemCount < 2) {
            return undefined;
        }

        return itemCount - 1;
    }
}
