import { Component, model } from '@angular/core';

@Component({
  selector: 'app-number-input-component',
  imports: [],
  templateUrl: './number-input-component.html',
  styleUrl: './number-input-component.scss',
})
export class NumberInputComponent {
  public value = model<number>();

  protected onInput(event: InputEvent) {
    const inputElement = <HTMLInputElement>event.target;
    const value = inputElement.valueAsNumber;

    if (isNaN(value)) {
      this.value.set(0);
      return;
    }

    this.value.set(value);
  }
}
