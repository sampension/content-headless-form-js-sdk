import { SelectionBase, SelectionBaseProperties } from "./Base/SelectionBase";

export interface Choice extends SelectionBase {
    propperties: ChoiceProperties
}

export interface ChoiceProperties extends SelectionBaseProperties {
    placeHolder: string
}