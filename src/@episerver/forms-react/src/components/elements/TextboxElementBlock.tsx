import { Textbox } from '@episerver/forms-sdk';
import React, { useMemo } from 'react';
import ElementWrapper from './shared/ElementWrapper';
import { useElement } from '../../hooks/useElement';
import { ElementCaption, ValidationMessage, DataList } from './shared';

export interface TextboxElementBlockProps {
  element: Textbox;
}

export const TextboxElementBlock = (props: TextboxElementBlockProps) => {
  const { element } = props;
  const { elementContext, handleChange, handleBlur } = useElement(element);
  const { isVisible, validationResults, value, elementRef, validatorClasses, extraAttr } = elementContext;
  return useMemo(
    () => (
      <ElementWrapper
        className={`${validatorClasses}`}
        validationResults={validationResults}
        isVisible={isVisible}
      >
        <ElementCaption element={element} />

        <label className={`input-text__field --horizontal-padding${validationResults.result.valid ? '' : ' --error'}`}>
          <input
            name={element.key}
            id={element.key}
            type="text"
            className="input-text__input"
            aria-describedby={`${element.key}_desc`}
            placeholder={element.properties.placeHolder}
            value={value}
            autoComplete={element.properties.autoComplete}
            {...extraAttr}
            onChange={handleChange}
            onBlur={handleBlur}
            ref={elementRef}
          />
        </label>

        <ValidationMessage
          element={element}
          validationResults={validationResults}
        />

        <DataList element={element} />
      </ElementWrapper>
    ),
    [isVisible, validationResults, value]
  );
};
