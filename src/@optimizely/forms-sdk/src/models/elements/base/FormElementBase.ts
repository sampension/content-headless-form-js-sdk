/**
 * Base class for all elements of Forms
 */
export interface FormElementBase {
    key: string
    contentType: string
    displayName: string
    properties: FormElementPropertiesBase
}

export interface FormElementPropertiesBase {
    label: string
    localizations: Record<string, string>
}