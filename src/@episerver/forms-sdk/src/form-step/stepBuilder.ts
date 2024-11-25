import { equals } from "../helpers";
import { newUniqueID } from "../helpers/generateId";
import { FormContainer, FormElementBase, Step, FormStep } from "../models";

/**
 * Class to assign elements into step
 */
export class StepBuilder {
    _form: FormContainer;

    constructor(form: FormContainer) {
        this._form = form;
    }

    /**
     * Function to assign elements into step
     * @returns Form with a list of steps and elements that are matched
     */
    buildForm(): FormContainer{
        let steps: Step[] = [];
        let elements: FormElementBase[] = [];
    
        let currentStep = { key: newUniqueID() } as FormStep;
    
        this._form.formElements.forEach((e,i) => {
            if (this.isFormStep(e)) {
                if (i !== 0)
                {
                    //if element is form step, then save list element to current step
                    steps.push({ formStep: {...currentStep}, elements: [...elements] });
                }
                
                //reset vars
                elements = [];
                currentStep = {...(e as FormStep)};
            }

            elements.push(e);
        });
    
        //if there is only one step, save list element to step
        steps.push({ formStep: {...currentStep}, elements: [...elements] });
    
        return {
            ...this._form, 
            steps
        };
    }

    /**
     * Check if element is FormStep
     * @param element Element to check
     * @returns True or false.
     */
    isFormStep(element: FormElementBase): boolean {
        return equals(element.contentType, "FormStepBlock");
    }
}