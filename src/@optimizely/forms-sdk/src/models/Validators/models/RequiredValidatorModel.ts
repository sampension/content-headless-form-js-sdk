import { ValidatorsModel } from "../Validators"

interface RequiredValidator extends ValidatorsModel {
    additionalAttributes: {
        required: string
        ariaRequired: boolean
    }
}

export default RequiredValidator