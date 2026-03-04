"use client";

import * as React from "react";

export interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export const OTPInput = ({
    length = 6,
    value,
    onChange,
    disabled = false,
    error = false,
}: OTPInputProps) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const char = e.target.value.slice(-1); // Get only the last character entered
        if (!/^\d*$/.test(char)) return; // Only allow digits

        const newValue = value.split("");
        newValue[index] = char;
        const finalValue = newValue.join("");
        onChange(finalValue);

        // Focus next input if a digit was entered
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!value[index] && index > 0) {
                // If current is empty and backspace is pressed, focus previous and clear it
                const newValue = value.split("");
                newValue[index - 1] = "";
                onChange(newValue.join(""));
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current
                const newValue = value.split("");
                newValue[index] = "";
                onChange(newValue.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);
        if (!/^\d+$/.test(pastedData)) return;

        onChange(pastedData);
        // Focus the last input or the next empty one
        const nextIndex = pastedData.length < length ? pastedData.length : length - 1;
        inputRefs.current[nextIndex]?.focus();
    };

    const borderColor = error
        ? "border-red-500 focus:border-red-500 ring-red-500"
        : "border-neutral-border focus:border-primary ring-primary-light";

    return (
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={disabled}
                    className={`
            w-12 h-14 text-center text-xl font-bold border rounded-lg
            transition-all duration-200 outline-none focus:ring-4
            ${borderColor}
            ${disabled ? "bg-neutral-light opacity-50 cursor-not-allowed" : "bg-white"}
          `}
                />
            ))}
        </div>
    );
};

OTPInput.displayName = "OTPInput";
