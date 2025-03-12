import { FormContainer, FormSubmission } from "../models";

/**
 * Class to manage form submission in session storage
 */
export class FormStorage {
    readonly _form: FormContainer
    readonly _cacheKey: string

    constructor(form: FormContainer, cacheKey?: string) {
        this._form = form;
        this._cacheKey = cacheKey ? ":" + cacheKey : "";
    }

    private getCachekey(key: string): string{
        return key + this._cacheKey;
    }

    /**
     * Storage to store EPiForms's data
     * @returns the session storage
     */
    getStorage(): Storage {
        return window.sessionStorage;
    }

    /**
     * Save form submission which specified by form key to storage
     * @param data 
     * @returns return the saved form submission
     */
    saveFormDataToStorage(data: FormSubmission[]): FormSubmission[] {
        let storage = this.getStorage();
        try { // safari private mode does not allow local storage
            let key = this.getCachekey(this._form.key);
            storage.setItem(key, JSON.stringify(data));
        } catch (e: any) {
            console.log("Local Storage not supported: " + e.message);
        }
        return data;
    }

    /**
     * Load a specified form submission from storage.
     * @returns return form submission
     */
    loadFormDataFromStorage(): FormSubmission[] {
        let storage = this.getStorage(),
            data = storage[this.getCachekey(this._form.key)];
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        if (!data) {
            return [];
        }

        return data;
    }

    /**
     * Clear saved data of specified Form in storage
     */
    removeFormDataInStorage(): void {
        let key = this.getCachekey(this._form.key);
        this.getStorage().removeItem(key);
    }
}