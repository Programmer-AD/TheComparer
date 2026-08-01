export interface ComparisonSession {
    id: string;

    itemPackId: string;
    itemPackName: string;
    startDate: Date;
    endDate?: Date;
    comparisonQuestion: string;

    comparisonMode: string;

    selections: ComparisonSessionSelection[];
    customModeData: unknown | undefined;
}

export interface ComparisonSessionSelection {
    /**
     * If set to undefined - means "Equals" selection.
     */
    selectedItemId: string | undefined;

    optionItemIds: string[];
}
