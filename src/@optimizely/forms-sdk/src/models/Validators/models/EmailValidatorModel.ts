import { ValidatorsModel } from "../Validators"

interface EmailValidator extends ValidatorsModel {
    jsPattern: string
    dotnetPattern: string
}

export default EmailValidator