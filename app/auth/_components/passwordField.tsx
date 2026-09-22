"use client"
import { Box, TextField, IconButton, InputAdornment  } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, MouseEvent } from "react";


type TFProps = React.ComponentProps<typeof TextField>;
export type PasswordTextFieldProps = Omit<TFProps, "type" | "InputProps"> & {
  enableToggle?: boolean;
  defaultVisible?: boolean;
};

export function PasswordTextField({
  enableToggle = true,
  defaultVisible = false,
  slotProps,
  ...props
}: PasswordTextFieldProps) {
  const [show, setShow] = useState(defaultVisible);

  const handleToggle = () => setShow((s) => !s);
  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  type InputSlot = NonNullable<TFProps["slotProps"]>["input"];
  const callerInputSlot = (slotProps?.input ?? {}) as InputSlot;

  const mergedEndAdornment = (
    <>
      {callerInputSlot && (callerInputSlot as any).endAdornment}
      {enableToggle && (
        <InputAdornment position="end">
          <IconButton
            aria-label={show ? "Hide password" : "Show password"}
            onClick={handleToggle}
            onMouseDown={handleMouseDown}
            edge="end"
            tabIndex={-1}
          >
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      )}
    </>
  );

  const nextSlotProps: TFProps["slotProps"] = {
    ...slotProps,
    input: {
      ...callerInputSlot,
      endAdornment: mergedEndAdornment,
    },
  };

  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      slotProps={nextSlotProps}
    />
  );
}