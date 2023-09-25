import { FormElementBase, FormElementPropertiesBase } from "./Base/FormElementBase"

export interface ImageChoice extends FormElementBase {
    properties: ImageChoiceProperties
}

export interface ImageChoiceProperties extends FormElementPropertiesBase {
    showSelectionInputControl: boolean
}