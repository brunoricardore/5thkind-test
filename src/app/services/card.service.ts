import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Subject, tap } from 'rxjs';
import { App } from '../models/app';

@Injectable({
    providedIn: 'root'
})
export class CardService {

    private _loading$ = new Subject<boolean>();
    get loading() {
        return this._loading$.asObservable();
    }

    private _apps: App[] = [
        {
            id: 'DC',
            contact: 'teste@example.com',
            version: '0.2.1',
            name: 'DC App'
        },
        {
            id: 'Marvel',
            contact: 'teste@example.com',
            version: '0.4.1',
            name: 'Marvel App'
        }
    ];

    private _pagination = {
        itemsPerPage: 9,
        currentPage: 1,
        totalPages: 1,
        totalItems: this._apps.length
    };

    private _pagination$ = new BehaviorSubject(this._pagination);

    updatePagination(page?: number) {
        this._pagination = {
            ...this._pagination,
            totalItems: this._apps.length,
            totalPages: Math.ceil(this._apps.length / this._pagination.itemsPerPage),
            currentPage: page ?? this._pagination.currentPage
        }
        this._pagination$.next(this._pagination);
        this._apps$.next(this.pagedApps);
    }

    get pagination$() {
        return this._pagination$.asObservable();
    }

    private _apps$ = new BehaviorSubject<App[]>(this.pagedApps);

    private get pagedApps() {
        return this._apps.slice(this._pagination.itemsPerPage * (this._pagination.currentPage - 1), this._pagination.itemsPerPage * this._pagination.currentPage);
    }

    get apps() {
        return this._apps$
            .pipe(
                tap(() => this._loading$.next(true)),
                delay(1000),
                tap(() => this._loading$.next(false))
            );
    }

    addApp(app: App) {
        if (!app.id) {
            app.id = Date.now().toString();
        }
        this._apps.splice(0, 0, app);
        this._apps$.next(this.pagedApps);
        this.updatePagination();
    }

    deleteApp(appId: string) {
        const appIndex = this._apps.findIndex(app => app.id === appId);
        if (appIndex > -1) {
            this._apps.splice(appIndex, 1);
            this._apps$.next(this.pagedApps);
        }
        this.updatePagination();
    }

    updateApp(updatedApp: App) {
        const appIndex = this._apps.findIndex(app => app.id === updatedApp.id);
        if (appIndex > -1) {
            this._apps[appIndex] = updatedApp;
            this._apps$.next(this.pagedApps);
        }
    }

}
