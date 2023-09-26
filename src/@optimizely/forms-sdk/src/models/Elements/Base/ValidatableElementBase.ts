import { Validators } from "../../validators/Validators";
import { FormElementBase, FormElementPropertiesBase } from "./FormElementBase";

export interface ValidatableElementBase extends FormElementBase {
    properties: ValidatableElementBaseProperties
}

export interface ValidatableElementBaseProperties extends FormElementPropertiesBase {
    validators: Validators[]
    validatorMessages: string
}