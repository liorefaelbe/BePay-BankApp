import React, { useEffect, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { bepay } from "../ui/bepay";

type Props = {
  value: string;
  length?: number;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  ariaLabel?: string;
};

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

export default function OtpInput({
  value,
  length = 6,
  onChange,
  onComplete,
  autoFocus = false,
  disabled = false,
  hasError = false,
  ariaLabel = "OTP code",
}: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    const clean = onlyDigits(value);
    return Array.from({ length }, (_, i) => clean[i] || "");
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  function focusIndex(i: number) {
    const el = inputsRef.current[i];
    if (el) el.focus();
  }

  function handleChange(i: number, next: string) {
    const digit = onlyDigits(next).slice(-1);
    const arr = [...digits];
    arr[i] = digit;

    const nextValue = arr.join("");
    onChange(nextValue);

    if (digit && i < length - 1) {
      focusIndex(i + 1);
    }

    if (digit && nextValue.length === length) {
      onComplete?.(nextValue);
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const arr = [...digits];
        arr[i] = "";
        onChange(arr.join(""));
      } else if (i > 0) {
        focusIndex(i - 1);
      }
    }

    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusIndex(i - 1);
    }

    if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      focusIndex(i + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = onlyDigits(e.clipboardData.getData("text")).slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    if (pasted.length === length) {
      onComplete?.(pasted);
    } else {
      focusIndex(Math.min(pasted.length, length - 1));
    }
  }

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      sx={{
        display: "flex",
        gap: 1.25,
        justifyContent: "center",
      }}
    >
      {digits.map((digit, i) => (
        <Box
          key={i}
          component="input"
          ref={(el: HTMLInputElement | null) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          sx={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 900,
            color: "white",

            background: "rgba(255,255,255,0.04)",
            borderRadius: 3,
            border: `1px solid ${hasError ? "rgba(255,80,80,0.65)" : bepay.colors.borderSoft}`,

            outline: "none",
            transition: "all 140ms ease",

            "&::placeholder": {
              color: "rgba(255,255,255,0.35)",
            },

            "&:focus": {
              borderColor: hasError ? "rgba(255,80,80,0.9)" : bepay.colors.primary,
              boxShadow: hasError ? "0 0 0 3px rgba(255,80,80,0.18)" : `0 0 0 3px rgba(42,124,255,0.25)`,
              background: "rgba(255,255,255,0.06)",
            },

            "&:disabled": {
              opacity: 0.6,
              cursor: "not-allowed",
            },
          }}
        />
      ))}
    </Box>
  );
}
