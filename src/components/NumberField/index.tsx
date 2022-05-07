/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react';
import NumberFormat from 'react-number-format';
import TextField, { TextFieldProps } from '@mui/material/TextField/TextField';

interface Props {
  decimalScale?: number;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export default function NumberField({
  decimalScale,
  name,
  defaultValue,
  ...textFieldProps
}: Props & TextFieldProps): React.ReactElement {
  const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
    props: CustomProps,
    ref
  ) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={values => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        decimalScale={decimalScale}
        thousandSeparator="."
        decimalSeparator=","
        isNumericString
        allowNegative={false}
        prefix=""
        {...(decimalScale && decimalScale > 0 && { fixedDecimalScale: true })}
      />
    );
  });

  return (
    <TextField
      {...textFieldProps}
      margin="normal"
      value

      InputProps={{
        inputComponent: NumberFormatCustom as any,
      }}
    />
  );
}

NumberField.defaultProps = {
  decimalScale: 0,
};
