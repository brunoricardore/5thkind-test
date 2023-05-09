import { Component, inject } from '@angular/core';
import { CardService } from 'src/app/services/card.service';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    cardService = inject(CardService);

    pagination!: {
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };

    constructor() {
        this.cardService.pagination$.subscribe(pag => {
            this.pagination = pag
        });
    }

    get pagesArray() {
        return Array.from(Array(this.totalPages).keys())
    }

    get totalPages() {
        return Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)
    }

    gotToPage(page: number) {
        this.cardService.updatePagination(page);
    }
}
