import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function SemanticVersionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const semanticRegex = '^[0-9]\d*(\.[1-9]\d*){0,2}$';
        const regex = new RegExp(semanticRegex);
        return regex.test(control.value) ? null : { invalidVersion: true };
    }
}