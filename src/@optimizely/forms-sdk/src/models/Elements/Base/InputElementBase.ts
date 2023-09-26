import { Condition } from "../../conditions/Conditions";
import { DataElementBlockBase, DataElementBlockBaseProperties } from "./DataElementBase";

export interface InputElementBase extends DataElementBlockBase {
    properties: InputElementBaseProperties
}

export interface InputElementBaseProperties extends DataElementBlockBaseProperties {
    satisfiedAction: string
    conditionCombination: string
    conditions: Condition[]
    placeHolder: string
}