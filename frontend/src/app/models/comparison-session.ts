export interface ComparisonSession {
    id: string;

    itemPackId: string;
    itemPackName: string;
    startDate: Date;
    endDate?: Date;
    comparisonQuestion: string;

    comparisonMode: string;

    selections: ComparisonSessionSelection[];
    customItemStates: unknown;
}

export interface ComparisonSessionSelection {
    optionItemIds: string[];
    selectedIndex: number;
}
