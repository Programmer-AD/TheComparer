import { inject, Service } from '@angular/core';
import { RedirectCommand, Router } from '@angular/router';

@Service()
export class CustomNavigationService {
    private router = inject(Router);

    public getRedirectToNotFoundPageCommand(shownUrl: string): RedirectCommand {
        return new RedirectCommand(this.router.parseUrl("/not-found"), { browserUrl: shownUrl });
    }
}

//TODO:Delete
