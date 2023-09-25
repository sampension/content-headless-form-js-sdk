import { FormElementBase } from "./Elements/Base/FormElementBase"

export interface FormContainer {
    key : string
    properties : FormContainerProperties
    formElements : FormElementBase[]
}

export interface FormContainerProperties {
    title : string
    allowToStoreSubmissionData : boolean
    showSummarizedData : boolean
    confirmationMessage: string
    resetConfirmationMessage : string
    redirectToPage: string
    submitSuccessMessage: string
    allowAnonymousSubmission: boolean
    allowMultipleSubmission: boolean
    showNavigationBar : boolean   
}