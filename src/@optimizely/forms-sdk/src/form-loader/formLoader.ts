'use strict';

import { ApiClient } from "./apiClient";
import { ApiClientConfig, defaultConfig } from "./apiClientConfig";

/**
 * Class for load Form
 */
export class FormLoader<T> {
    readonly client: ApiClient<T>;

    /**
     *  Constructor an instance of FormLoader
     * 
     * @param config Optional config to use. This config will combined with the defaultConfig.
     */
    constructor(config?: Partial<ApiClientConfig>) {
        this.client = new ApiClient<T>({ ...defaultConfig, ...config});
    }

    /**
     * Get a form with a GUID
     * 
     * @param key GUID of form
     * @returns A promise with a form 
     */
    getForm(key: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.client.get(`form/${key}`)
                .then((response: T) => {
                    resolve(response);
                })
                .catch((error: any) => {
                    reject(error);
                });
        })
    }
}