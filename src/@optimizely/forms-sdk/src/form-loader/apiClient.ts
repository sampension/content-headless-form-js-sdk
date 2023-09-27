'use strict';

import { ApiClientConfig } from "./apiClientConfig";

/**
 * Class for making API calls to the Optimizely Headless Form.
 */
export class ApiClient<T> {
    readonly config: ApiClientConfig;

    /**
    * Constructs an instance of ApiClient.
    *
    * @param initConfig Configuration to use.
    */
    constructor(initConfig: ApiClientConfig){
        this.config = initConfig;
    }

    /**
     * Make a request
     * 
     * @param path 
     */
    async send(path: string, method: string, headers?: Record<string, string>, data?: any): Promise<T> {
        let requestInfo = `${this.config.baseURL}${path}`;

        const requestInit: RequestInit = {
            method,
            credentials: 'include',
            headers: headers ?? this.config.headers,
            body: data ? JSON.stringify(data) : undefined
        };

        return new Promise<T>((resolve, reject) => {
            fetch(requestInfo, requestInit)
                .then(async (response: Response) => {
                    if(response.ok){
                        let json = await response.json();
                        resolve(json as T);
                    }
                    else {
                        reject(response);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                })
        })
    }

    /**
     * Make a GET request
     * 
     * @param path 
     * @returns 
     */
    async get(path: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.send(path, "GET").then((response: T) => {
                resolve(response);
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }

    /**
     * Make a POST request
     * 
     * @param path 
     * @returns 
     */
    async post(path: string, data: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.send(path, "POST", undefined, data).then((response: T) => {
                resolve(response);
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }
}