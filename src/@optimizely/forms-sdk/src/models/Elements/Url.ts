import { InputElementBase, InputElementBaseProperties } from "./Base/InputElementBase";

export interface Url extends InputElementBase {
    properties:UrlProperties
}

export interface UrlProperties extends InputElementBaseProperties {
    urlValidators: string
}