import { InputElementBase, InputElementBaseProperties } from "./base/InputElementBase";

export interface Url extends InputElementBase {
    properties:UrlProperties
}

export interface UrlProperties extends InputElementBaseProperties {
    urlValidators: string
}