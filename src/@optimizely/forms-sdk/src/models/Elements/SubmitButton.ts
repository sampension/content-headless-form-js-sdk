import { ConditionBlock } from "../conditions/ConditionBlock"
import { ButtonBase, ButtonBaseProperties } from "./base/ButtonBase"
/**
 * Allow user to submit the form
 */
export interface SubmitButton extends ButtonBase {
    properties: SubmitButtonProperties
}

export interface SubmitButtonProperties extends ButtonBaseProperties, ConditionBlock {

}