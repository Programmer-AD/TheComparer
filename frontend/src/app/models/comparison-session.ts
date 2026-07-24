export interface ComparisonSession {
    id: string;

    startDate: Date;
    endDate?: Date;
    comparisonQuestion: string;

    comparisonMode: string;
    customComparisonModeParams: unknown;

    selections: ComparisonSessionSelection[];
    customItemStates: unknown;
}

export interface ComparisonSessionSelection {
    optionItemIds: string[];
    selectedIndex: number;
}
