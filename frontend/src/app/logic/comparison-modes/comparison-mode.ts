export interface ComparisonMode {
    id: string;
    name: string;
    description: string;

    estimateComparisonCount(itemCount: number): number;
}
