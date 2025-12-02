import type { ElementCSS } from '@weaverse/react'

import { forwardRef, useId } from 'react'
import { useWeaverseShopify } from '~/hooks/use-weaverse-shopify'
import type { FormElementProps } from '~/types'
import { FormField } from './form-field'

let Form = forwardRef<HTMLDivElement, FormElementProps>((props, ref) => {
  let { ssrMode } = useWeaverseShopify()
  let {
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

  let formContent = (
    <div ref={ref} {...rest} style={style}>
      <form
        acceptCharset="UTF-8"
        action="/contact#contact_form"
        className="contact-form wv-form"
        id={formId}
        method="post"
      >
        <input name="form_type" type="hidden" value={formType} />
        <input name="utf8" type="hidden" value="✓" />
        {fields.map((field) => (
          <FormField field={field} formId={formId} key={field.id} />
        ))}
        <button className="wv-form__submit" type="submit">
          {submitText}
        </button>
      </form>
    </div>
  )
  if (ssrMode) {
    return (
      <div ref={ref} {...rest} style={style}>
        {`{% form '${formType}' %}`}
        {' {% if form.posted_successfully? %} '}
        {`<h3>{% render 'icon-success' %}{{ 'newsletter.success' | t }}</h3>`}
        {targetLink && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.open(${targetLink},${
                openInNewTab ? '_blank' : '_self'
              })`,
            }}
          />
        )}
        {' {%- endif -%} '}
        {'{% if form.errors %}'}
        {'<p>{{ form.errors | default_errors }}</p>'}
        {'{% endif %}'}
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
      id: 'field-1',
      type: 'text',
      placeholder: 'Enter your name',
      showLabel: true,
      label: 'Your name',
      name: 'first_name',
      required: false,
    },
    {
      id: 'field-2',
      showLabel: true,
      label: 'Your email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      id: 'field-3',
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
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    width: '100%',
    padding: '12px',
    '.wv-form': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      '.wv-form-field': {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 12,
        '.wv-form-field__label': {
          marginBottom: 4,
        },
        'input, textarea': {
          px: 12,
          py: 10,
          border: '1px solid #ddd',
        },
      },
      '.wv-form__submit': {
        alignSelf: 'var(--wv-form-submit-align, flex-start)',
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
