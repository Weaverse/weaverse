import { WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'
import { FormElementProps, FormField } from '../../types'

const Form = forwardRef<HTMLDivElement, FormElementProps>((props, ref) => {
  const { isDesignMode, ssrMode } = useContext(WeaverseContext)
  const { fields, formType, button, ...rest } = props

  let style = {
    '--wv-form-submit-align': button.position,
  } as React.CSSProperties

  const formContent = (
    <div ref={ref} {...rest} style={style}>
      {fields.map((field: FormField) => (
        <div
          key={field.id}
          style={{ pointerEvents: isDesignMode ? 'none' : 'auto' }}
        >
          <label htmlFor={field.label}>{field.label}</label>
          {field.type !== 'multiline' ? (
            <input
              name={`contact[${field.label}]`}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
            />
          ) : (
            <textarea
              name={`contact[${field.label}]`}
              placeholder={field.placeholder}
              rows={4}
              required={field.required}
            ></textarea>
          )}
        </div>
      ))}
      <button type="submit">{button.text}</button>
    </div>
  )
  if (ssrMode) {
    return (
      <div ref={ref} {...rest} style={style}>
        {`{% form '${formType}' %}`}
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
      placeholder: 'Please enter your name',
      showLabel: true,
      label: 'Your name: ',
      required: false,
    },
    {
      id: 2,
      showLabel: true,
      label: 'Your email',
      type: 'email',
      placeholder: 'Please enter your email',
      required: true,
    },
    {
      id: 3,
      showLabel: true,
      label: 'Your message',
      type: 'multiline',
      placeholder: 'Please enter your message',
      required: false,
    },
  ],
  button: {
    text: 'Submit',
    position: 'center',
    openInNewTab: true,
    targetLink: 'https://myshop.com',
  },
  css: {
    '@desktop': {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      width: '100%',
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
      '& button': {
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
