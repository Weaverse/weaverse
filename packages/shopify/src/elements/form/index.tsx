import { WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext, useId } from 'react'
import type { FormElementProps, FormFieldProps } from '~/types'

let InputField = ({
  field,
  formId,
}: {
  field: FormFieldProps
  formId: string
}) => {
  let fieldName = `contact[${field.name || field.label}]`
  return (
    <div>
      <label htmlFor={fieldName}>{field.label}</label>
      {field.type !== 'multiline' ? (
        <input
          form={formId}
          name={fieldName}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : (
        <textarea
          form={formId}
          name={fieldName}
          placeholder={field.placeholder}
          rows={4}
          required={field.required}
        ></textarea>
      )}
    </div>
  )
}

const Form = forwardRef<HTMLDivElement, FormElementProps>((props, ref) => {
  const { ssrMode } = useContext(WeaverseContext)
  const {
    fields,
    formType,
    submitText,
    submitPosition,
    targetLink,
    openInNewTab,
    ...rest
  } = props
  let formId = useId()
  let style = {
    '--wv-form-submit-align': submitPosition,
  } as React.CSSProperties

  const formContent = (
    <div ref={ref} {...rest} style={style}>
      {fields.map((field) => (
        <InputField key={field.id} formId={formId} field={field} />
      ))}
      <form
        method="post"
        action="/contact#contact_form"
        id={formId}
        acceptCharset="UTF-8"
        className="contact-form"
      >
        <input type="hidden" name="form_type" value={formType} />
        <input type="hidden" name="utf8" value="✓" />
        <button type="submit">{submitText}</button>
      </form>
    </div>
  )
  if (ssrMode) {
    return (
      <div ref={ref} {...rest} style={style}>
        {`{% form '${formType}' %}`}
        {` {% if form.posted_successfully? %} `}
        {`<h3>{% render 'icon-success' %}{{ 'newsletter.success' | t }}</h3>`}
        {targetLink && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.open(${targetLink},${
                openInNewTab ? '_blank' : '_self'
              })`,
            }}
          ></script>
        )}
        {` {%- endif -%} `}
        {`{% if form.errors %}`}
        {`<p>{{ form.errors | default_errors }}</p>`}
        {`{% endif %}`}
        {formContent}
        {'{% endform %}'}
      </div>
    )
  }
  return formContent
})

Form.defaultProps = {
  formType: 'customer',
  fields: [
    {
      id: 1,
      type: 'text',
      placeholder: 'Enter your name',
      showLabel: true,
      label: 'Your name',
      name: 'first_name',
      required: false,
    },
    {
      id: 2,
      showLabel: true,
      label: 'Your email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      id: 3,
      showLabel: true,
      label: 'Your message',
      name: 'message',
      type: 'multiline',
      placeholder: 'Enter your message',
      required: false,
    },
  ],
  submitText: 'Submit',
  submitPosition: 'center',
  openInNewTab: true,
  targetLink: 'https://myshop.com',
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      width: '100%',
      padding: '12px',
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      },
      '& input, & textarea': {
        px: 12,
        py: 10,
        border: '1px solid #ddd',
      },
      button: {
        alignSelf: 'var(--wv-form-submit-align)',
        background: '#4B5563',
        color: '#fff',
        padding: '14px 30px',
        border: 'none',
        width: 'fit-content',
      },
    },
  },
}

export default Form
