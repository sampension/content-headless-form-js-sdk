import {Condition} from "../Conditions/Conditions";
import {ValidatableElementBase, ValidatableElementBaseProperties} from "./Base/ValidatableElementBase";

export interface FileUpload extends ValidatableElementBase {
    properties: FileUploadProperties
}

export interface FileUploadProperties extends ValidatableElementBaseProperties{
    satisfiedAction: string
    conditionCombination: number
    conditions: Condition[]
    allowMultiple: boolean
    fileTypes: string
    fileSize: number
    fileExtensions: string
    description: string
}