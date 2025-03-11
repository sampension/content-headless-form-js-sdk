import React, { useEffect, useRef } from 'react';
import { useForms } from '../context/store';
import {
  StepHelper,
  FormContainer,
  FormSubmitter,
  IdentityInfo,
  isInArray,
  isNull,
  isNullOrEmpty,
  FormSubmitModel,
  FormSubmitResult,
  SubmitButton,
  FormCache,
  FormConstants,
  ProblemDetail,
  StepDependCondition,
  getConfirmationData,
} from '@episerver/forms-sdk';
import { RenderElementInStep } from './RenderElementInStep';
import { DispatchFunctions } from '../context/dispatchFunctions';
import { FormStepNavigation } from './FormStepNavigation';

interface FormBodyProps {
  identityInfo?: IdentityInfo;
  baseUrl: string;
  history?: any;
  currentPageUrl?: string;
}

export const FormBody = (props: FormBodyProps) => {
  const formContext = useForms();
  const form = formContext?.formContainer ?? ({} as FormContainer);
  const inactiveElements = formContext?.dependencyInactiveElements ?? [];
  const formSubmitter = new FormSubmitter(form, props.baseUrl);
  const dispatchFunctions = new DispatchFunctions();
  const stepDependCondition = new StepDependCondition(form, inactiveElements);
  const stepHelper = new StepHelper(form);
  const currentPageUrl = props.currentPageUrl ?? window.location.href;

  const formTitleId = `${form.key}_label`;
  const statusMessage = useRef<string>('');
  const statusDisplay = useRef<string>('hide');

  const showForm = useRef<boolean>(true);

  const formCache = new FormCache();
  const localFormCache = new FormCache(window.localStorage);
  const currentStepIndex = formContext?.currentStepIndex ?? 0;

  // @sampension - check for redirect to page after submit to prevent rendering of (default) success message before redirect
  const shouldRedirectToPage = !!form.properties?.redirectToPage;

  //TODO: these variables should be get from api or sdk
  const validateFail = useRef<boolean>(false),
    isFormFinalized = useRef<boolean>(false),
    isProgressiveSubmit = useRef<boolean>(false),
    isSuccess = useRef<boolean>(false),
    submissionWarning = useRef<boolean>(false),
    message = useRef<string>(''),
    submissionStorageKey = FormConstants.FormSubmissionId + form.key,
    isStepValidToDisplay = stepDependCondition.isStepValidToDisplay(currentStepIndex, currentPageUrl),
    isMalFormSteps = stepHelper.isMalFormSteps();

  // @sampension - added check for redirect to page
  if ((isFormFinalized.current || isProgressiveSubmit.current) && isSuccess.current && !shouldRedirectToPage) {
    statusDisplay.current = 'Form__Success__Message';
    statusMessage.current = form.properties.submitSuccessMessage ?? message.current;
  } else if ((submissionWarning.current || !isSuccess.current) && !isNullOrEmpty(message.current)) {
    statusDisplay.current = 'Form__Warning__Message';
    statusMessage.current = message.current;
  } else {
    statusDisplay.current = 'hide';
    statusMessage.current = '';
  }

  const validationCssClass = validateFail.current ? 'ValidationFail' : 'ValidationSuccess';

  const showError = (error: string) => {
    submissionWarning.current = !isNullOrEmpty(error);
    message.current = error;
  };

  const handleConfirm = () => {
    const form = formContext?.formContainer ?? ({} as FormContainer);
    const confirmationMessage = form.properties.confirmationMessage ?? '';
    let confimStatus = true;

    if (form.properties.showSummarizedData) {
      const data = formContext?.formSubmissions ?? [];
      const messageData = getConfirmationData(data, form, currentStepIndex, inactiveElements);
      const showConfirmationMessage = !(isNullOrEmpty(confirmationMessage) && isNullOrEmpty(messageData));
      if (showConfirmationMessage) {
        confimStatus = confirm(confirmationMessage + '\n\n' + messageData);
      }
    }

    return confimStatus;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.properties.allowAnonymousSubmission && isNullOrEmpty(formContext?.identityInfo?.accessToken)) {
      return;
    }

    //Find submit button, if found then check property 'finalizeForm' of submit button. Otherwise, button Next/Previous was clicked.
    const buttonId = e.nativeEvent.submitter?.id;
    const submitButton = form.formElements.find((fe) => fe.key === buttonId) as SubmitButton;
    if (!isNull(submitButton)) {
      //when submitting by SubmitButton, isProgressiveSubmit default is true
      isProgressiveSubmit.current = true;
    }

    const isLastStep = currentStepIndex === form.steps.length - 1;

    //get inactives element
    const inactives = (formContext?.elementDependencies ?? [])
      .filter((dependency) => !dependency.isSatisfied)
      .map((dependency) => dependency.elementKey);

    //filter submissions by active elements and current step
    const formSubmissions = (formContext?.formSubmissions ?? []).filter(
      (fs) => !isInArray(fs.elementKey, inactives) && stepHelper.isInCurrentStep(fs.elementKey, currentStepIndex)
    );

    //validate all submission data before submit
    const formValidationResults = formSubmitter.doValidate(formSubmissions);
    dispatchFunctions.updateAllValidation(formValidationResults);

    //set focus on the 1st invalid element of current step
    const invalid = stepHelper.getFirstInvalidElement(formValidationResults, currentStepIndex);
    if (!isNullOrEmpty(invalid)) {
      dispatchFunctions.updateFocusOn(invalid);
      return;
    }

    // Confirm if user want to submit the form
    if (!isNull(submitButton) || isLastStep) {
      if (!handleConfirm()) {
        isProgressiveSubmit.current = false;
        return;
      }
    }

    const model: FormSubmitModel = {
      formKey: form.key,
      locale: form.locale,
      isFinalized: submitButton?.properties?.finalizeForm || isLastStep,
      partialSubmissionKey: localFormCache.get(submissionStorageKey) ?? formContext?.submissionKey ?? '',
      hostedPageUrl: currentPageUrl,
      submissionData: formSubmissions,
      accessToken: formContext?.identityInfo?.accessToken,
      currentStepIndex: currentStepIndex,
    };

    //submit data to API
    dispatchFunctions.updateIsSubmitting(true);
    formSubmitter
      .doSubmit(model)
      .then((response: FormSubmitResult) => {
        //go here, response.success always is true
        isSuccess.current = response.success;
        isFormFinalized.current = (submitButton?.properties?.finalizeForm || isLastStep) && response.success;
        dispatchFunctions.updateSubmissionKey(response.submissionKey);
        localFormCache.set(submissionStorageKey, response.submissionKey);

        if (isProgressiveSubmit.current) {
          message.current = response.messages.map((m) => m.message).join('<br>');
          showForm.current = false;
        }

        // Custom redirect message
        const redirectMessage = response.messages.find((message) => message.section === 'redirect');
        if (redirectMessage && !isNullOrEmpty(redirectMessage.message)) {
          window.location.href = redirectMessage.message;
          return;
        }

        if (isFormFinalized.current) {
          formCache.remove(FormConstants.FormCurrentStep + form.key);
          localFormCache.remove(submissionStorageKey);
        }

        //redirect after submit
        if (submitButton) {
          const redirectToPage = submitButton?.properties?.redirectToPage ?? form.properties?.redirectToPage;
          if (!isNullOrEmpty(redirectToPage)) {
            const cmsUrl = process.env.REACT_APP_HEADLESS_FORM_BASE_URL ?? 'http://temp';
            const url = new URL(redirectToPage, cmsUrl);
            window.location.href = url.href;
          }
        }
      })
      .catch((e: ProblemDetail) => {
        switch (e.status) {
          case 401:
            //clear access token to ask login again
            dispatchFunctions.updateIdentity({} as IdentityInfo);
            formCache.remove(FormConstants.FormAccessToken);
            break;
          case 400:
            if (e.errors) {
              //validate fail
              validateFail.current = false;
              const formValidationResults =
                formContext?.formValidationResults?.map((fr) =>
                  isNull(e.errors[fr.elementKey])
                    ? fr
                    : {
                        ...fr,
                        result: { valid: false, message: e.errors[fr.elementKey].join('<br/>') },
                      }
                ) ?? [];

              dispatchFunctions.updateAllValidation(formValidationResults);

              //set focus on the 1st invalid element of current step
              dispatchFunctions.updateFocusOn(
                stepHelper.getFirstInvalidElement(formValidationResults, currentStepIndex)
              );
            }
            break;
        }

        showError(e.detail);
      })
      .finally(() => {
        dispatchFunctions.updateIsSubmitting(false);
      });
  };

  useEffect(() => {
    dispatchFunctions.updateIdentity(props.identityInfo);
    if (isNullOrEmpty(props.identityInfo?.accessToken) && !form.properties.allowAnonymousSubmission) {
      showError(form.localizations.allowAnonymousSubmissionErrorMessage);
    } else {
      showError('');
    }
  }, [props.identityInfo?.accessToken]);

  //reset when change page
  useEffect(() => {
    isSuccess.current = false;
    if (form.properties.focusOnForm || currentStepIndex > 0) {
      dispatchFunctions.updateFocusOn(stepHelper.getFirstInputElement(currentStepIndex, inactiveElements));
    }
  }, [currentStepIndex]);

  //Run in-case change page by url. The currentStepIndex that get from cache is incorrect.
  useEffect(() => {
    if (!isStepValidToDisplay) {
      dispatchFunctions.updateCurrentStepIndex(stepHelper.getCurrentStepIndex(currentPageUrl));
    }
  }, []);

  isMalFormSteps && showError(form.localizations.malformstepconfigruationErrorMessage);

  return (
    <form
      method="post"
      noValidate={true}
      aria-labelledby={formTitleId}
      encType="multipart/form-data"
      className={`EPiServerForms ${validationCssClass}`}
      id={form.key}
      onSubmit={handleSubmit}
    >
      {form.properties.title && (
        <h2
          className="headline-sm color-txt-primary Form__Title"
          id={formTitleId}
        >
          {form.properties.title}
        </h2>
      )}
      {form.properties.description && (
        <aside className="body-lg color-txt-primary body--400 Form__Description">{form.properties.description}</aside>
      )}
      <div
        className="Form__MainBody"
        style={{ display: showForm.current ? 'flow' : 'none' }}
      >
        {/* render element */}
        {form.steps.map((e, i) => {
          const stepDisplaying =
            currentStepIndex === i && !isFormFinalized.current && isStepValidToDisplay && !isMalFormSteps ? '' : 'hide';
          return (
            <section
              key={e.formStep.key}
              id={e.formStep.key}
              className={`Form__Element__Step ${stepDisplaying}`}
            >
              <RenderElementInStep
                elements={e.elements}
                stepIndex={i}
              />
            </section>
          );
        })}

        {/* render step navigation*/}
        <FormStepNavigation
          isFormFinalized={isFormFinalized.current}
          history={props.history}
          handleSubmit={handleSubmit}
          isMalFormSteps={isMalFormSteps}
          isStepValidToDisplay={isStepValidToDisplay}
          isSuccess={isSuccess.current}
        />
      </div>
      {/* area for showing Form's status or validation */}
      <div className="Form__Status">
        <div
          role="status"
          className={`Form__Status__Message ${statusDisplay.current}`}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: statusMessage.current,
            }}
          />
        </div>
      </div>
    </form>
  );
};
