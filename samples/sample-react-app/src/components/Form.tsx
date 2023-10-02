import { FormContainer, FormLoader } from "@optimizely/forms-sdk";
import React, { useEffect, useState } from "react";

interface FormProps {
    formKey: string
}

export default function Form ({formKey}: FormProps) {

  const formLoader = new FormLoader({
    baseURL:"http://localhost:8000/"
  });

  const [form, setForm] = useState<FormContainer | null>(null);

  useEffect(()=>{
    if(!form){
      formLoader.getForm(formKey, "en")
        .then((res)=>setForm(res));
    }
  },[form, formKey]);

  return (
    <>
      {form && (
          <>
              <h2>{form.properties.title}</h2>
              <h3>Elements</h3>
              {form.formElements.map(e => (
                  <ul>
                      <li key={e.key}>{`${e.contentType}: ${e.displayName}`}</li>
                  </ul>
              ))}
          </>
      )}
    </>
  );
}