import { Condition } from "../conditions/Conditions";
import { FormElementBase, FormElementPropertiesBase } from "./base/FormElementBase";

export interface ParagraphText extends FormElementBase {
    properties: ParagraphTextProperties
}

export interface ParagraphTextProperties extends FormElementPropertiesBase {
    paragraphText: string
    satisfiedAction: string
    conditionCombination: string
    conditions: Condition[]
    disablePlaceholdersReplacement: boolean
}