import { Component, input } from '@angular/core';
import { Item } from '../../../models';

@Component({
    selector: 'app-comparison-item-selection-component',
    imports: [],
    templateUrl: './comparison-item-selection-component.html',
    styleUrl: './comparison-item-selection-component.scss',
})
export class ComparisonItemSelectionComponent {
    public item = input.required<Item | undefined>();
    public isSelected = input.required<boolean>();
}
