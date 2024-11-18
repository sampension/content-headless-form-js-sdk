import { Selection, isNullOrEmpty } from '@episerver/forms-sdk';
import React, { useMemo } from 'react';
import ElementWrapper from './shared/ElementWrapper';
import { useElement } from '../../hooks/useElement';
import { ElementCaption, ValidationMessage } from './shared';

interface SelectionElementBlockProps {
  element: Selection;
}

const chevronIcon =
  "<svg height='24' width='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 14.7L6.7 9.4L7.4 8.675L12 13.275L16.6 8.675L17.3 9.4L12 14.7Z' fill='black' fill-rule='evenodd'></path></svg>";

export const SelectionElementBlock = (props: SelectionElementBlockProps) => {
  const { element } = props;
  const { elementContext, handleChange, handleBlur } = useElement(element);
  const { isVisible, validationResults, value, extraAttr, validatorClasses, elementRef } = elementContext;

  return useMemo(
    () => (
      <ElementWrapper
        className={`FormSelection ${validatorClasses}`}
        validationResults={validationResults}
        isVisible={isVisible}
      >
        <ElementCaption element={element} />
        <select
          name={element.key}
          id={element.key}
          multiple={element.properties.allowMultiSelect}
          aria-describedby={element.displayName + '_desc'}
          {...extraAttr}
          autoComplete={element.properties.autoComplete}
          onChange={handleChange}
          onBlur={handleBlur}
          value={element.properties.allowMultiSelect ? value.split(',') : value}
          ref={elementRef}
          className={`input-dropdown-radix__trigger${
            validationResults.result.valid ? '' : ' input-dropdown-radix__trigger--error'
          }`}
          style={{
            background: `url("data:image/svg+xml,${chevronIcon}") no-repeat`,
            backgroundPosition: 'calc(100% - var(--core-dimension-2)) center',
          }}
        >
          <option
            value=""
            disabled={value !== ''}
          >
            {isNullOrEmpty(element.properties.placeHolder)
              ? element.localizations.selectionDefaultPlaceholder
              : element.properties.placeHolder}
          </option>
          {element.properties.items?.map((feed) => (
            <option
              key={feed.value}
              value={feed.value}
              defaultChecked={feed.checked}
            >
              {feed.caption}
            </option>
          ))}
        </select>
        <ValidationMessage
          element={element}
          validationResults={validationResults}
        />
      </ElementWrapper>
    ),
    [isVisible, validationResults, value]
  );
};
