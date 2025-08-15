import type { FieldProps } from '~/types'

export function FormField({ field, formId }: FieldProps) {
  let fieldName = `contact[${field.name || field.label}]`
  return (
    <div className="wv-form-field">
      <label className="wv-form-field__label" htmlFor={fieldName}>
        {field.label}
      </label>
      {field.type !== 'multiline' ? (
        <input
          form={formId}
          name={fieldName}
          placeholder={field.placeholder}
          required={field.required}
          type={field.type}
        />
      ) : (
        <textarea
          form={formId}
          name={fieldName}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
        />
      )}
    </div>
  )
}
