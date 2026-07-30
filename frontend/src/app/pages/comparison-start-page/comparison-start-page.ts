import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CustomNavigationService, PageSetupService } from '../../utils';
import { ComparisonMode, ComparisonModeService, ComparisonSessionService, ItemPackService } from '../../logic';
import { ItemPack } from '../../models';
import { SelectComponent } from "../../components/select-component/select-component";
import { ShortTextInputComponent } from "../../components";
import { Router } from '@angular/router';

@Component({
    selector: 'app-comparison-start-page',
    imports: [SelectComponent, ShortTextInputComponent],
    templateUrl: './comparison-start-page.html',
    styleUrl: './comparison-start-page.scss',
})
export class ComparisonStartPage {
    private router = inject(Router);
    private pageSetupService = inject(PageSetupService);
    private customNavigationService = inject(CustomNavigationService);
    private itemPackService = inject(ItemPackService);
    private comparisonModeService = inject(ComparisonModeService);
    private comparisonSessionService = inject(ComparisonSessionService);

    // From route
    public itemPackId = input.required<string>();

    protected itemPack: ItemPack = undefined!;
    protected comparisonModes: ComparisonMode[] = this.comparisonModeService.getAll();

    protected selectedComparisonModeId = signal<string>("");
    protected selectedComparisonMode = computed(() => this.comparisonModeService.getById(this.selectedComparisonModeId()));

    protected questionOptions = computed(() => this.itemPack.questions.map(x => ({ value: x, caption: x })).concat([{ value: "", caption: "Other" }]));
    protected selectedQuestion = signal<string>("");
    protected customQuestion = signal<string>("");

    constructor() {
        effect(() => {
            this.initFormData();
        });
    }

    protected onStartButtonClick() {
        const sessionId = this.comparisonSessionService.create({
            id: "assigned by service",
            comparisonMode: this.selectedComparisonModeId(),
            comparisonQuestion: this.selectedQuestion() === "" ? this.customQuestion() : this.selectedQuestion(),
            startDate: new Date(),
            selections: [],
            customComparisonModeParams: {},
            customItemStates: {},
        });

        this.router.navigate(["comparison", sessionId]);
    }

    private initFormData(): void {
        const itemPack = this.itemPackService.getById(this.itemPackId());
        if (itemPack === undefined) {
            this.customNavigationService.showNotFoundPage();
            return;
        }

        this.itemPack = itemPack;

        this.pageSetupService.setupPage(`Setup comparison for "${itemPack.name}"`, "/");
    }
}
