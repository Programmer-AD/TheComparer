import { Component, model } from '@angular/core';

@Component({
  selector: 'app-long-text-input-component',
  imports: [],
  templateUrl: './long-text-input-component.html',
  styleUrl: './long-text-input-component.scss',
})
export class LongTextInputComponent {
  public value = model<string>();

  protected onInput(event: InputEvent) {
    const inputElement = <HTMLTextAreaElement>event.target;
    const value = inputElement.value;
    this.value.set(value);
  }
}
