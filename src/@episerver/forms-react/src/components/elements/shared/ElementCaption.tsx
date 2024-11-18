import { FormElementBase } from '@episerver/forms-sdk';
import React from 'react';
import { InputLabel } from '@sampension/design-system-react';

interface ElementCaptionProps {
  element: FormElementBase;
}

export const ElementCaption = (props: ElementCaptionProps) => {
  const { element } = props;
  return (
    <InputLabel
      className="formular-fieldset__legend"
      label={element.properties.label}
      popover={element?.properties?.description ? { bodyText: element.properties.description } : undefined}
    />
  );
};
