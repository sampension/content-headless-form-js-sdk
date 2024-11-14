import { Choice, equals, isNullOrEmpty } from '@episerver/forms-sdk';
import React, { useMemo } from 'react';
import ElementWrapper from './shared/ElementWrapper';
import { useElement } from '../../hooks/useElement';
import { ElementCaption, ValidationMessage } from './shared';

export interface ChoiceElementBlockProps {
  element: Choice;
}

export const ChoiceElementBlock = (props: ChoiceElementBlockProps) => {
  const { element } = props;
  const { elementContext, handleChange, handleBlur } = useElement(element);
  const { isVisible, validationResults, value, validatorClasses, extraAttr } = elementContext;

  return useMemo(
    () => (
      <ElementWrapper
        className={`FormChoice ${validatorClasses}`}
        validationResults={validationResults}
        isVisible={isVisible}
        extraAttr={extraAttr}
      >
        <fieldset
          aria-describedby={`${element.key}_desc`}
          className="formular-fieldset"
        >
          {!isNullOrEmpty(element.properties.label) && (
            // <legend className="Form__Element__Caption">{element.properties.label}</legend>
            <ElementCaption element={element} />
          )}

          {element.properties.items?.map((item, index) => {
            const isChecked =
              !isNullOrEmpty(item.value) &&
              !isNullOrEmpty(value) &&
              value.split(',').some((s: string) => equals(s, item.value));
            const choiceId = `${element.key}_${index}`;

            return (
              <React.Fragment key={`${item.value}_${index}`}>
                {element.properties.allowMultiSelect ? (
                  <div className="input-checkbox input-checkbox--md">
                    <input
                      type="checkbox"
                      id={choiceId}
                      name={element.key}
                      value={item.value}
                      className="input-checkbox__field FormChoice__Input FormChoice__Input--Checkbox"
                      checked={isChecked}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label
                      htmlFor={choiceId}
                      className="input-checkbox__label "
                    >
                      <div className="input-checkbox__icon-wrapper">
                        <svg
                          height="24"
                          width="24"
                          viewBox="0 0 24 24"
                          className=" icon input-checkbox__icon"
                        >
                          <path
                            d="M9.55 17.3L4.575 12.35L5.3 11.625L9.55 15.875L18.7 6.725L19.425 7.45L9.55 17.3Z"
                            fill="currentColor"
                            fillRule="evenodd"
                          />
                        </svg>
                      </div>
                      {item.caption}
                    </label>
                  </div>
                ) : (
                  <div className="input-radio input-radio--md">
                    <input
                      type="radio"
                      id={choiceId}
                      name={element.key}
                      value={item.value}
                      className="input-radio__field FormChoice__Input FormChoice__Input--Radio"
                      checked={isChecked}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <label
                      htmlFor={choiceId}
                      className="input-radio__label"
                    >
                      {item.caption}
                    </label>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </fieldset>

        <ValidationMessage
          element={element}
          validationResults={validationResults}
        />
      </ElementWrapper>
    ),
    [isVisible, validationResults, value]
  );
};
