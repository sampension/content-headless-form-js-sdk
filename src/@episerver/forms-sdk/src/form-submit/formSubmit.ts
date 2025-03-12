import { FormStorage } from "../form-storage";
import { FormValidator } from "../form-validator";
import { equals, isNull } from "../helpers";
import { FormConstants, FormContainer, FormFieldsData, FormSubmission, FormSubmissionData, FormValidationResult, ProblemDetail } from "../models";
import { ApiConstant } from "../form-loader/apiConstant";

export interface FormSubmitModel {
    /**
     * The key of the form's submitted data.
     */
    formKey: string;
    /**
     * The locale of the submitted form.
     */
    locale: string;
    /**
     * Key value collection of submitted data
     */
    submissionData: FormSubmission[];
    /**
     * Indicate whether the form submission is finalize
     */
    isFinalized: boolean;
    /**
     * The key reference to newly saved form submission.
     */
    partialSubmissionKey: string;
    /**
     * The url of the page hosted the form step
     */
    hostedPageUrl: string;
    /**
     * The access token to identify login user
     */
    accessToken?: string;
    /**
     * The current index of submitted step
     */
    currentStepIndex: number;
}

export interface FormSubmitResult {
    /**
     * Indication if the submission succeeded.
     */
    success: boolean;
    /**
     * The key reference to newly saved form submission.
     */
    submissionKey: string;
    /**
     * Indication if the form validation succeeded.
     */
    validationFail: boolean;
    /**
     * List of messages from the form submission.
     */
    messages: FormSubmitMessage[];
}

export interface FormSubmitMessage {
    /**
     * The section where the message originated from.
     */
    section: string;
    /**
     *  The message describing an outcome.
     */
    message: string;
    /**
     * The identifier of the resource that was the reason for this message to be created.
     */
    identifier: string;
}

/**
 * Class to submit form submission to Headless Form API
 */
export class FormSubmitter {
    readonly _form: FormContainer
    readonly _baseUrl: string

    constructor(form: FormContainer, baseUrl: string) {
        this._form = form;
        this._baseUrl = baseUrl;
    }

    /**
     * Combine 2 data from storage and form submission
     * @param dataFromStorage the array of form data from session storage
     * @param submissionData the array of form submission
     */
    combineData(dataFromStorage: FormSubmission[], submissionData: FormSubmission[]): FormSubmission[] {
        const mapFromArray = new Map<string, FormSubmission>();

        submissionData.forEach(element => {
            mapFromArray.set(element.elementKey, element);
        });

        const combinedData = [...submissionData, ...dataFromStorage.filter(element => !mapFromArray.has(element.elementKey))];

        return combinedData;
    }

    /**
     * Post an array of form submission to the Headless Form API
     * @param formSubmission the array of form submission to post
     */
    doSubmit(model: FormSubmitModel, cacheKey?: string): Promise<FormSubmitResult> {
        return new Promise<FormSubmitResult>((resolve, reject) => {
            // Post data to API
            let formData = new FormData();

            let formSubmissionData: Partial<FormSubmissionData> = {};
            formSubmissionData.FormKey = model.formKey;
            formSubmissionData.Locale = model.locale;
            formSubmissionData.IsFinalized = model.isFinalized;
            formSubmissionData.SubmissionKey = model.partialSubmissionKey;
            formSubmissionData.HostedPageUrl = model.hostedPageUrl;
            formSubmissionData.CurrentStep = model.currentStepIndex;
            let fieldsData: FormFieldsData = {}

            //append form submission to FormData object
            model.submissionData.forEach(data => {
                let ovalue = data.value;
                let key = data.elementKey;

                if (isNull(ovalue)) {
                    return;
                }

                // checking file upload elements, item must be File if any,
                // for using Object.getPrototypeOf(variable) variable must be object type
                if (Array.isArray(ovalue) && ovalue.length > 0 &&
                        ovalue[0] !== null && typeof ovalue[0] === "object") {
                    let files = ovalue,
                            fileNames = "";
                    // append each upload file with a unique key (bases on element's key) so that the server side can see it through the Request.Files,
                    // concat all the files' name and assign with the element's Id
                    for (var idx = 0; idx < files.length; idx++) {
                        let ofile = files[idx].file;
                        
                        if (ofile && Object.getPrototypeOf(ofile) === File.prototype) {
                            formData.append(key + "_file_" + idx, ofile);
                        }

                        // always send file name to server if existed to handle case upload file then click back
                        // charactor | cannot be used in filename and then is safe for splitting later
                        if(idx > 0 && idx != files.length - 1){
                            fileNames += " | "
                        }
                        
                        fileNames += files[idx].name; 
                    }
                    formData.append(key, fileNames);
                    data.prevValue = fileNames
                }
                else {
                    fieldsData[key] = data.value;
                }
            });

            formSubmissionData.Fields = fieldsData;
            formData.append("data",JSON.stringify(formSubmissionData))

            // Save data to session storage
            let formStorage = new FormStorage(this._form, cacheKey);
            let currentData = formStorage.loadFormDataFromStorage();
            let dataCombined = this.combineData(currentData, model.submissionData);
            formStorage.saveFormDataToStorage(dataCombined);
            
            //init a request and call ajax
            let requestInit: RequestInit = {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${model.accessToken}`,
                },
                body: formData
            }

            fetch(`${this._baseUrl}${ApiConstant.apiEndpoint}`, requestInit)
                .then(async (response: Response) => {
                    let json = await response.json();
                    if (response.ok) {
                        let result = json as FormSubmitResult;
                        if (result.success && model.isFinalized) {
                            //clear cache of form submission
                            formStorage.removeFormDataInStorage();
                        }
                        resolve(result);
                    }
                    else {
                        reject(json as ProblemDetail);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    /**
     * Function to validate data before submit
     * @param formSubmission the array of form submission to post
     * @returns An array of validation result
     */
    doValidate(formSubmissions: FormSubmission[]): FormValidationResult[] {
        return this._form.formElements
            .filter(e => formSubmissions.some(fs => equals(fs.elementKey, e.key)))
            .map(e => {
                let formValidator = new FormValidator(e);
                let value = formSubmissions.filter(fs => equals(fs.elementKey, e.key))[0]?.value;
                return {
                    elementKey: e.key,
                    result: formValidator.validate(value)
                } as FormValidationResult;
        });
    }
}