import { FormElementBase, FormElementPropertiesBase } from "./base/FormElementBase"

export interface ImageChoice extends FormElementBase {
    properties: ImageChoiceProperties
}

export interface ImageChoiceProperties extends FormElementPropertiesBase {
    showSelectionInputControl: boolean
}