"use client";

import { useState } from "react";
import { TextField, Label, InputGroup, FieldError } from "@heroui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function PasswordField({
  name,
  label,
  placeholder,
  isRequired,
  minLength,
}: {
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField name={name} isRequired={isRequired} minLength={minLength} fullWidth>
      <Label className="text-sm font-medium">{label}</Label>
      <InputGroup>
        <InputGroup.Input type={visible ? "text" : "password"} placeholder={placeholder} />
        <InputGroup.Suffix>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="flex h-full items-center px-3 text-muted hover:text-accent"
          >
            {visible ? <FiEyeOff /> : <FiEye />}
          </button>
        </InputGroup.Suffix>
      </InputGroup>
      <FieldError className="text-xs text-danger" />
    </TextField>
  );
}