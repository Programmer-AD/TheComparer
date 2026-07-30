import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-select-component',
  imports: [],
  templateUrl: './select-component.html',
  styleUrl: './select-component.scss',
})
export class SelectComponent {
  public options = input.required<{ caption: string, value: string }[]>();
  public value = model<string>();

  protected onInput(event: InputEvent) {
    const inputElement = <HTMLSelectElement>event.target;
    const value = inputElement.value;
    this.value.set(value);
  }
}
