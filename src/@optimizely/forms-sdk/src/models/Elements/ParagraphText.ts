import { ConditionBlock } from "../conditions/ConditionBlock";
import { FormElementBase, FormElementPropertiesBase } from "./base/FormElementBase";
/**
 * Rich text (with placeholder)
 */
export interface ParagraphText extends FormElementBase {
    properties: ParagraphTextProperties
}

export interface ParagraphTextProperties extends FormElementPropertiesBase, ConditionBlock {
    paragraphText: string
    disablePlaceholdersReplacement: boolean
}