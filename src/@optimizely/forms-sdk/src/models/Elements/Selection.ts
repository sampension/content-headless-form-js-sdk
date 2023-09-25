import { SelectionBase, SelectionBaseProperties } from "./Base/SelectionBase"

/***
 * This element can be rendered as Combobox or Listbox, base on property SelectionElementkBase.AllowMultiSelect
 */
export interface Selection extends SelectionBase {
    properties: SelectionProperties
}

export interface SelectionProperties extends SelectionBaseProperties {
    autoComplete: number
}