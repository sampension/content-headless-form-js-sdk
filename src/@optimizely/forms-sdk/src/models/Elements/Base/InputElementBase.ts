import { ConditionBlock } from "../../conditions/ConditionBlock";
import { DataElementBlockBase, DataElementBlockBaseProperties } from "./DataElementBase";

/**
 * Base class for all of input elements. 
 * This will be rendered as input in user interface.
 */
export interface InputElementBase extends DataElementBlockBase {
    properties: InputElementBaseProperties
}

export interface InputElementBaseProperties extends DataElementBlockBaseProperties, ConditionBlock {
    placeHolder: string
}