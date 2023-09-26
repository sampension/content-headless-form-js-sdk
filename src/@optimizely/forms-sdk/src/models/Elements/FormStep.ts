import { FormElementBase, FormElementPropertiesBase } from "./base/FormElementBase"

export interface FormStep extends FormElementBase {
    properties: FormStepProperties
}

export interface FormStepProperties extends FormElementPropertiesBase {
    attachedContentLink: string
    dependField: DependField
    dependCondition: number
    dependValue: string
}

export interface DependField {
    key: string
    locale: string
    version: number
}