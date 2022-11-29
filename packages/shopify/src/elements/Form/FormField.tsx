import React from 'react'
import type { FieldProps } from '~/types'

export function FormField({ field, formId }: FieldProps) {
  let fieldName = `contact[${field.name || field.label}]`
  return (
    <div className="wv-form-field">
      <label htmlFor={fieldName} className="wv-form=field__label">
        {field.label}
      </label>
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
        />
      )}
    </div>
  )
}
