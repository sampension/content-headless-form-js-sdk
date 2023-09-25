import { InputElementBase, InputElementBaseProperties } from "./Base/InputElementBase"

export interface Textbox extends InputElementBase {
    properties: TextboxProperties
}

export interface TextboxProperties extends InputElementBaseProperties {
    descripton: string
    autoComplete: number
}