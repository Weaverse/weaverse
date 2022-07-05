import React, {FC, forwardRef, useContext} from 'react'
import {WeaverseElementSchema} from '@weaverse/core'
import {WeaverseContext} from '@weaverse/react/src/context'

const Form: FC = forwardRef((props, ref) => {
  const {isDesignMode, ssrMode} = useContext(WeaverseContext)
  const {fields, formType, button, ...rest} = props
  console.info("9779 fields", fields)
  const formContent = (
    <div ref={ref} {...rest}>
      {
        fields.map(field => (
          <div key={field.id} style={{pointerEvents: isDesignMode ? "none" : "auto"}}>
            <label htmlFor={field.label}>{field.label}</label>
            {field.type !== "multiline" ? <input
              name={`contact[${field.label}]`}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
            /> : <textarea
              name={`contact[${field.label}]`}
              placeholder={field.placeholder}
              rows={4}
              required={field.required}
            ></textarea>}
          </div>
        ))
      }
      <button>{button.text}</button>
    </div>
  )
  if (ssrMode) {
    return <>
      {`{% form '${formType}' %}`}
      {formContent}
      {`{% endform %}`}
    </>
  }
  return formContent
})

Form.defaultProps = {
  formType: "customer",
  fields: [
    {
      id: 1,
      type: "text",
      placeholder: "Please enter your name",
      showLabel: true,
      label: "Your name: ",
      required: false
    },
    {
      id: 2,
      showLabel: true,
      label: "Your email",
      type: "email",
      placeholder: "Please enter your email",
      required: true
    },
    {
      id: 3,
      showLabel: true,
      label: "Your message",
      type: "multiline",
      placeholder: "Please enter your message",
      required: false
    },
  ],
  button: {
    text: "Submit",
    position: "center",
  }
}

export const schema: WeaverseElementSchema = {
  type: "form",
  title: "Form",
  parentType: "container",
  toolbar: [
    {
      type: 'delete'
    },
    {
      type: 'duplicate'
    },
    {
      type: 'link',
    },
    {
      type: 'color'
    }
  ],
  data: {
    css: {
      '@desktop': {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
        "& > div": {
          display: "flex",
          flexDirection: "column",
          gap: 4
        },
        "& input, & textarea": {
          px: 12,
          py: 10,
          border: "1px solid #ddd"
        },
        "& button": {
          background: "#4B5563",
          color: "#fff",
          padding: "14px 30px",
          border: "none",
          width: "fit-content",
          alignSelf: "center"
        }
      }
    }
  },
  flags: {
    draggable: true
  }
}

export default Form