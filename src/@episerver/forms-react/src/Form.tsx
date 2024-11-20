import React, { useEffect } from 'react';
import { IdentityInfo } from '@episerver/forms-sdk';
import { FormContainerBlock } from './components/FormContainerBlock';
import { UseFormLoaderProps, useFormLoader } from './hooks/useFormLoader';
import './Form.scss';

interface FormProps {
  /**
   * The form key that identifies the form
   */
  formKey: string;
  /**
   * The code of the form language
   */
  language?: string;
  /**
   * The base url of Headless Form API
   */
  baseUrl: string;
  /**
   * Access token for form submit
   */
  identityInfo?: IdentityInfo;
  /**
   * The instance of useHistory() received from react-router-dom
   */
  history?: any;
  /**
   * The public url of current page
   */
  currentPageUrl?: string;
  /**
   * The endpoint url of Optimizely Graph
   */
  optiGraphUrl?: string;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (error: unknown) => void;
}

export const Form = ({
  formKey,
  language,
  baseUrl,
  identityInfo,
  history,
  currentPageUrl,
  optiGraphUrl,
  onLoadingChange,
  onError,
}: FormProps) => {
  const {
    data: formData,
    loading,
    error,
  } = useFormLoader({ formKey, language, baseUrl, optiGraphUrl } as UseFormLoaderProps);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <>
      {formData && (
        <FormContainerBlock
          form={formData}
          key={formData.key}
          identityInfo={identityInfo}
          baseUrl={baseUrl}
          history={history}
          currentPageUrl={currentPageUrl}
        />
      )}
    </>
  );
};
