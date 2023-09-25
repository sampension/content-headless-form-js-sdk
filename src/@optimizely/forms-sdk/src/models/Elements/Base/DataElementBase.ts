import { ValidatableElementBase, ValidatableElementBaseProperties } from "./ValidatableElementBase"

export interface DataElementBlockBase extends ValidatableElementBase {
    properties: DataElementBlockBaseProperties
}

export interface DataElementBlockBaseProperties extends ValidatableElementBaseProperties {
    predefinedValue: string
}