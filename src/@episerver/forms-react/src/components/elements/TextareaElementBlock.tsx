import { Textarea } from '@episerver/forms-sdk';
import React, { useMemo } from 'react';
import ElementWrapper from './shared/ElementWrapper';
import { useElement } from '../../hooks/useElement';
import { ElementCaption, ValidationMessage } from './shared';

export interface TextareaElementBlockProps {
  element: Textarea;
}

export const TextareaElementBlock = (props: TextareaElementBlockProps) => {
  const { element } = props;
  const { elementContext, handleChange, handleBlur } = useElement(element);
  const { isVisible, validationResults, value, extraAttr, validatorClasses, elementRef } = elementContext;
  return useMemo(
    () => (
      <ElementWrapper
        className={`FormTextbox FormTextbox--Textarea ${validatorClasses}`}
        validationResults={validationResults}
        isVisible={isVisible}
      >
        <ElementCaption element={element} />

        <div className={`input-textarea__field${validationResults.result.valid ? '' : ' --error'}`}>
          <textarea
            name={element.key}
            id={element.key}
            className="input-textarea__input FormTextbox__Input"
            placeholder={element.properties.placeHolder}
            {...extraAttr}
            aria-describedby={`${element.key}_desc`}
            value={value}
            autoComplete={element.properties.autoComplete}
            onChange={handleChange}
            onBlur={handleBlur}
            ref={elementRef}
          />
        </div>

        <ValidationMessage
          element={element}
          validationResults={validationResults}
        />
      </ElementWrapper>
    ),
    [isVisible, validationResults, value]
  );
};
