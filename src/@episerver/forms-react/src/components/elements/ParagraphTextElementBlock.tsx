import {
  FormContainer,
  FormStorage,
  ParagraphText,
  getAllowedContentTypesInRichtext,
  getStringValue,
} from "@episerver/forms-sdk";
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption } from "./shared";
import { useForms } from "../../context/store";

export interface ParagraphTextElementBlockProps {
  element: ParagraphText;
}

export const ParagraphTextElementBlock = (
  props: ParagraphTextElementBlockProps
) => {
  const { element } = props;
  const { elementContext } = useElement(element);
  const { isVisible, validationResults, value, validatorClasses } =
    elementContext;
  const formContext = useForms();
  const form = formContext?.formContainer!;
  const formKey = form.key;
  const formStorage = new FormStorage(
    form,
    formContext?.identityInfo?.username
  );
  const allowedContentTypes = getAllowedContentTypesInRichtext();
  const data =
    formStorage.loadFormDataFromStorage() ?? formContext?.formSubmissions ?? [];

  const doReplaceText =
    element.properties.disablePlaceholdersReplacement ?? true;

  function extractTextsWithFormat(inputString: string, indicator: string) {
    const regex = new RegExp(`${indicator}(.*?)${indicator}`, "g");
    const indicatorLength = indicator.length;
    const matches = (inputString.match(regex) ?? []) as string[];
    if (matches) {
      return matches.map((match) =>
        match.slice(indicatorLength, -indicatorLength)
      );
    } else {
      return [];
    }
  }

  let replacedText = element.properties.paragraphText ?? "";
  const indicators = ["::", "#"];

  indicators.forEach((indicator) => {
    const placeHolders = extractTextsWithFormat(replacedText, indicator);
    if (doReplaceText) {
      data.forEach((element) => {
        const formElements = form.formElements.find(
          (fe) => fe.key === element.elementKey
        );
        const friendlyName = formElements?.displayName;
        if (
          formElements &&
          allowedContentTypes.includes(formElements?.contentType) &&
          friendlyName &&
          placeHolders.indexOf(friendlyName) !== -1
        ) {
          replacedText = replacedText.replaceAll(
            `${indicator}${friendlyName}${indicator}`,
            getStringValue(element)
          );
        }
      });
    }
  });

  return useMemo(
    () => (
      <ElementWrapper
        className={`richtext FormParagraphText Form__Element--NonData ${validatorClasses}`}
        validationResults={validationResults}
        isVisible={isVisible}
      >
        <ElementCaption element={element} />
        <>
          <div id={formKey}>
            <div
              dangerouslySetInnerHTML={{
                __html: replacedText,
              }}
            />
          </div>
          <div
            id={formKey + "__OriginalText"}
            className="Form__Original__ParagraphText"
          />
        </>
      </ElementWrapper>
    ),
    [isVisible, validationResults, value]
  );
};
