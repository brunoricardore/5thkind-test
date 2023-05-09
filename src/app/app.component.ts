import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { App } from './models/app';
import { CardService } from './services/card.service';
import { SemanticVersionValidator } from './validators/semver.validator';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    subscription = new Subscription();

    cardService = inject(CardService);

    apps!: App[];

    loading!: boolean;

    formGroup!: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.createForm();
        this.subscription.add(
            this.cardService.loading
                .subscribe(loading => {
                    this.loading = loading;
                })
        )

        this.subscription.add(
            this.cardService.apps.subscribe(apps => this.apps = apps)
        )
    }

    get formValid() {
        return this.formGroup?.valid;
    }

    createForm() {
        this.formGroup = this.formBuilder.group({
            id: [null],
            name: [null, Validators.required],
            version: [null, [Validators.required, SemanticVersionValidator()]],
            contact: [null, Validators.required],
        })
    }

    get idControl() {
        return this.formGroup.get('id');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    deleteApp(app: App) {
        this.cardService.deleteApp(app.id);
    }

    appClick(app: App) {
        this.formGroup.patchValue(app);
    }

    addApp() {
        if (this.idControl?.value) {
            this.cardService.updateApp(this.formGroup.value);
        } else {
            this.cardService.addApp(this.formGroup.value);
        }
        this.formGroup.reset();
    }

    resetForm() {
        this.formGroup.reset();
    }

    get formErrors() {
        const errors: string[] = [];
        if (this.formGroup.get('name')?.invalid) {
            errors.push('Please inform the card name');
        }
        if (this.formGroup.get('contact')?.invalid) {
            errors.push('Please inform the contact');
        }
        if (this.formGroup.get('version')?.invalid) {
            if (this.formGroup.get('version')?.errors?.['required']) {
                errors.push('Please inform the version');
            }
            else if (this.formGroup.get('version')?.errors?.['invalidVersion']) {
                errors.push('Check if the informed version follows [major.minor.patch] format');
            }
        }
        return errors;
    }

}
