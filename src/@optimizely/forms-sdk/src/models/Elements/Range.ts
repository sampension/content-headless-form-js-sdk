import { InputElementBase, InputElementBaseProperties } from "./base/InputElementBase"
/**
 * Allows users to select an integer value within a specified range
 */
interface Range extends InputElementBase {
    properties: RangeProperties
}

interface RangeProperties extends InputElementBaseProperties {

}

export default Range