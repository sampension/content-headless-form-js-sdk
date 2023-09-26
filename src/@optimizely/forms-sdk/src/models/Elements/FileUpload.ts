import {Condition} from "../conditions/Conditions";
import {ValidatableElementBase, ValidatableElementBaseProperties} from "./base/ValidatableElementBase";

export interface FileUpload extends ValidatableElementBase {
    properties: FileUploadProperties
}

export interface FileUploadProperties extends ValidatableElementBaseProperties{
    satisfiedAction: string
    conditionCombination: string
    conditions: Condition[]
    allowMultiple: boolean
    fileTypes: string
    fileSize: number
    fileExtensions: string
    description: string
}