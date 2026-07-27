import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class CustomNavigationService {
    private router = inject(Router);

    public showNotFoundPage() {
        this.router.navigate(["/not-found"], { browserUrl: this.router.url })
    }
}
