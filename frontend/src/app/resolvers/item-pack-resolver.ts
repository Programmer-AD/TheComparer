import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, RouterStateSnapshot } from "@angular/router";
import { ItemPack } from "../models";
import { inject } from "@angular/core";
import { ItemPackService } from "../logic";
import { CustomNavigationService } from "../utils";

export const itemPackResolver: ResolveFn<ItemPack> = async (
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
) => {
    const itemPackService = inject(ItemPackService);
    const customNavigationService = inject(CustomNavigationService);

    const itemPackId = route.paramMap.get('itemPackId');
    if (itemPackId === null) {
        return customNavigationService.getRedirectToNotFoundPageCommand(route.url.join("/"));
    }

    const itemPack = await itemPackService.getByIdAsync(itemPackId);
    if (itemPack === undefined) {
        return customNavigationService.getRedirectToNotFoundPageCommand(route.url.join("/"));
    }

    return itemPack;
};
