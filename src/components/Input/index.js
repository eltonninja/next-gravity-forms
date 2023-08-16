import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";

const standardType = (type) => {
  switch (type) {
    case "phone":
      return "tel";
    case "fileupload":
      return "file";
    default:
      return type;
  }
};

const Input = ({ defaultValue, fieldData, name, ...wrapProps }) => {
  const {
    cssClass,
    inputMaskValue,
    isRequired,
    maxLength,
    placeholder,
    size,
    type,
  } = fieldData;

  const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;
  let inputType = standardType(type);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <input
        aria-invalid={Boolean(errors?.[name])}
        aria-required={isRequired}
        className={classnames(
          "gravityform__field__input",
          `gravityform__field__input__${valueToLowerCase(type)}`,
          cssClass,
          valueToLowerCase(size)
        )}
        defaultValue={defaultValue}
        id={name}
        maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
        name={name}
        placeholder={placeholder}
        {...register(name, {
          required: isRequired && strings.errors.required,
          maxLength: !fieldMaxLength
            ? undefined
            : {
                value: fieldMaxLength,
                message: `${strings.errors.maxChar.front}  ${fieldMaxLength} ${strings.errors.maxChar.back}`,
              },
          pattern: {
            value: regex,
            message: regex && strings.errors.pattern,
          },
        })}
        type={valueToLowerCase(inputType)}
      />
    </InputWrapper>
  );
};

export default Input;

Input.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};
