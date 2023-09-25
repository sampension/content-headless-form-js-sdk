import { Validators } from "../../Validators/Validators";
import { FormElementBase, FormElementPropertiesBase } from "./FormElementBase";

export interface ValidatableElementBase extends FormElementBase {
    properties: ValidatableElementBaseProperties
}

export interface ValidatableElementBaseProperties extends FormElementPropertiesBase {
    validators: Validators[]
    validatorMessages: string
}