import { FileUpload, FormContainer, FormStorage } from '@episerver/forms-sdk';
import React, { useMemo } from 'react';
import ElementWrapper from './shared/ElementWrapper';
import { useElement } from '../../hooks/useElement';
import { ElementCaption, ValidationMessage } from './shared';
import { useForms } from '../../context/store';

export interface FileUploadElementBlockProps {
  element: FileUpload;
}

export const FileUploadElementBlock = (props: FileUploadElementBlockProps) => {
  const { element } = props;
  const { elementContext, handleChange, handleRemoveAttachment } = useElement(element);
  let allowedTypes = element.properties.fileTypes
    ? element.properties.fileTypes
        .split(',')
        .map((ext) => {
          ext = ext.trim();
          return ext[0] != '.' ? `.${ext}` : ext;
        })
        .join(',')
    : '';
  const { value, isVisible, validationResults, extraAttr, validatorClasses, elementRef } = elementContext;
  const attachedFiles = (value as { name: string; file: File }[]) ?? [];

  const formContext = useForms();
  const form = formContext?.formContainer as FormContainer;
  const formStorage = new FormStorage(form, formContext?.identityInfo?.username);
  const data = formStorage.loadFormDataFromStorage();

  return useMemo(
    () => (
      <ElementWrapper
        className={`FormFileUpload formular-fieldset ${validatorClasses}`}
        validationResults={validationResults}
        isVisible={isVisible}
      >
        <ElementCaption element={element} />

        <input
          name={element.key}
          id={element.key}
          type="file"
          {...extraAttr}
          multiple={element.properties.allowMultiple}
          className="FormFileUpload__Input"
          accept={allowedTypes}
          aria-describedby={element.key + '_desc'}
          onChange={handleChange}
          ref={elementRef}
        />

        {attachedFiles.length > 0 && (
          <div className="attach-file-wrapper__attachments">
            <div className="attach-file-wrapper__badge-wrapper">
              {attachedFiles.map((file, index) => (
                <button
                  key={`${file.name}${index}`}
                  type="button"
                  className="badge-button badge-button--secondary"
                  onClick={() => handleRemoveAttachment(file.name)}
                  aria-label={`Remove ${file.name}`}
                >
                  <span>{file.name}</span>
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    className="icon"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M6.4 18.3L5.7 17.6L11.3 12L5.7 6.4L6.4 5.7L12 11.3L17.6 5.7L18.3 6.4L12.7 12L18.3 17.6L17.6 18.3L12 12.7L6.4 18.3Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        <ValidationMessage
          element={element}
          validationResults={validationResults}
        />
      </ElementWrapper>
    ),
    [isVisible, validationResults, value],
  );
};
