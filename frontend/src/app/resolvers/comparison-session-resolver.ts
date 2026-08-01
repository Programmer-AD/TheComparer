import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ComparisonSession } from "../models";
import { inject } from "@angular/core";
import { ComparisonSessionService } from "../logic";
import { CustomNavigationService } from "../utils";

export const comparisonSessionResolver: ResolveFn<ComparisonSession> = async (
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
) => {
    const comparisonSessionService = inject(ComparisonSessionService);
    const customNavigationService = inject(CustomNavigationService);

    const sessionId = route.paramMap.get('sessionId');
    if (sessionId === null) {
        return customNavigationService.getRedirectToNotFoundPageCommand(route.url.join("/"));
    }

    const comparisonSession = await comparisonSessionService.getByIdAsync(sessionId);
    if (comparisonSession === undefined) {
        return customNavigationService.getRedirectToNotFoundPageCommand(route.url.join("/"));
    }

    return comparisonSession;
};
