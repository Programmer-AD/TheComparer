import { Component, input } from '@angular/core';
import { ComparisonSession } from '../../../../models';

@Component({
    selector: 'app-tournament-mode-result-component',
    imports: [],
    templateUrl: './tournament-mode-result-component.html',
    styleUrl: './tournament-mode-result-component.scss',
})
export class TournamentModeResultComponent {
    public comparisonSession = input.required<ComparisonSession>();

    // TODO: Implement

}
