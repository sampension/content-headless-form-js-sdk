import { FormElementBase, FormElementPropertiesBase } from "./Base/FormElementBase"

export interface FormStep extends FormElementBase {
    properties: FormStepProperties
}

export interface FormStepProperties extends FormElementPropertiesBase {
    attachedContentLink: string
    dependField: {
        key: string
        locale: string
        version: number
    }
    dependCondition: number
    dependValue: number
}