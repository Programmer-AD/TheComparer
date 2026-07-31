import { Component, input } from '@angular/core';
import { ComparisonSession } from '../../../../models';

@Component({
    selector: 'app-elo-ranking-mode-result-component',
    imports: [],
    templateUrl: './elo-ranking-mode-result-component.html',
    styleUrl: './elo-ranking-mode-result-component.scss',
})
export class EloRankingModeResultComponent {
    public comparisonSession = input.required<ComparisonSession>();

    // TODO: Implement

}
