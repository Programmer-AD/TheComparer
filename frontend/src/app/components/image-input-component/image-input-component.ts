import { Component, computed, effect, ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { FileInteractionService } from '../../utils';

@Component({
    selector: 'app-image-input-component',
    imports: [],
    templateUrl: './image-input-component.html',
    styleUrl: './image-input-component.scss',
})
export class ImageInputComponent {
    private fileInteractionService = inject(FileInteractionService);

    public value = model<string>();
    public imageWidth = input.required<number>();
    public imageHeight = input.required<number>();

    protected canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
    private canvasElement = computed(() => this.canvasRef()?.nativeElement);
    private canvasContext = computed(() => {
        return this.canvasElement()?.getContext('2d') || undefined;
    });
    protected isImageSelectionSupported = computed(() => this.canvasContext() !== undefined);

    public constructor() {
        effect(() => {
            const value = this.value();
            this.renderImage(value);
        });
    }

    protected async onCanvasClick() {
        const file = await this.fileInteractionService.selectFileAsync();
        if (file === undefined) {
            return;
        }

        const dataUrl = URL.createObjectURL(file);
        try {
            const hasDrawn = await this.renderImage(dataUrl);

            if (!hasDrawn) {
                this.value.set(undefined);
                return;
            }

            // Save rescaled image version
            const result = this.canvasElement()!.toDataURL("image/png");
            this.value.set(result);
        } finally {
            URL.revokeObjectURL(dataUrl);
        }
    }

    protected onClearClick() {
        this.value.set(undefined);
    }

    private async renderImage(dataUrl: string | undefined): Promise<boolean> {
        try {
            const canvas = this.canvasElement();
            const context = this.canvasContext();
            if (canvas === undefined || context === undefined) {
                return false;
            }

            if (dataUrl !== undefined) {
                const image = new Image(canvas.width, canvas.height);
                image.src = dataUrl;
                const isLoaded = await new Promise((resolve, _) => {
                    image.onerror = () => resolve(false);
                    image.onload = () => resolve(true);
                });

                if (isLoaded) {
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    return true;
                }
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            return false;
        } catch (error) {
            console.dir(error);
            return false;
        }
    }
}
