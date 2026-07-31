import { Component, input, output } from '@angular/core';
import { Item } from '../../../models';

@Component({
    selector: 'app-comparison-item-component',
    imports: [],
    templateUrl: './comparison-item-component.html',
    styleUrl: './comparison-item-component.scss',
})
export class ComparisonItemComponent {
    public item = input.required<Item>();
    public click = output<Item>();

    protected onClick(event: Event) {
        event.stopPropagation();
        this.click.emit(this.item());
    }
}
