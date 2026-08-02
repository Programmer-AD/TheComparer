import { Routes } from '@angular/router';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages/home-page/home-page").then(x => x.HomePage),
    },
    {
        path: "comparison/start/:itemPackId",
        loadComponent: () => import("./pages/comparison-start-page/comparison-start-page").then(x => x.ComparisonStartPage),
    },
    {
        path: "comparison/:sessionId",
        loadComponent: () => import("./pages/comparison-page/comparison-page").then(x => x.ComparisonPage),
    },
    {
        path: "comparison/:sessionId/result",
        loadComponent: () => import("./pages/comparison-result-page/comparison-result-page").then(x => x.ComparisonResultPage),
    },
    {
        path: "pack-management/:itemPackId",
        loadComponent: () => import("./pages/pack-management-page/pack-management-page").then(x => x.PackManagementPage),
    },
    {
        path: "**",
        component: NotFoundPage,
    }
];
