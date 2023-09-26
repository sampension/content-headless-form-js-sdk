import { SelectionBase, SelectionBaseProperties } from "./base/SelectionBase";

export interface Choice extends SelectionBase {
    propperties: ChoiceProperties
}

export interface ChoiceProperties extends SelectionBaseProperties {
    placeHolder: string
}