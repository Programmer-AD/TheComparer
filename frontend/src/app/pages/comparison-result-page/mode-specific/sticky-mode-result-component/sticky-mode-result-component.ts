import { Component, input } from '@angular/core';
import { ComparisonSession } from '../../../../models';

@Component({
    selector: 'app-sticky-mode-result-component',
    imports: [],
    templateUrl: './sticky-mode-result-component.html',
    styleUrl: './sticky-mode-result-component.scss',
})
export class StickyModeResultComponent {
    public comparisonSession = input.required<ComparisonSession>();

    // TODO: Implement

}
