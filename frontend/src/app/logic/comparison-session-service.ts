import { Service } from '@angular/core';
import { ComparisonSession } from '../models';

@Service()
export class ComparisonSessionService {
    public getAll(): ComparisonSession[] {
        // TODO: Not Implemented
        return [
            {
                id: "test",
                comparisonQuestion: "What is Better test?",
                startDate: new Date(2020, 0, 1, 10, 15, 30),
                comparisonMode: "some",
                selections: [],
                customComparisonModeParams: {},
                customItemStates: [],
            },
            {
                id: "test2",
                comparisonQuestion: "What is worse test?",
                startDate: new Date(2021, 0, 1, 10, 15, 30),
                endDate: new Date(2022, 0, 1, 10, 15, 30),
                comparisonMode: "someother",
                selections: [],
                customComparisonModeParams: {},
                customItemStates: [],
            }
        ];
    }
}
