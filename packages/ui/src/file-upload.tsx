"use client";

import { useRef, useState } from "react";
import { Upload, File as FileIcon, X } from "lucide-react";
import React from "react";

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  onChange?: (files: FileList | File | null) => void;
  value?: File | File[] | null;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      helperText,
      error,
      onChange,
      value,
      accept,
      multiple = false,
      required = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const hasError = !!error;

    const handleFileSelect = (files: FileList | null) => {
      if (!files || files.length === 0) return;

      if (multiple) {
        onChange?.(files);
      } else {
        onChange?.(files[0] || null);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      handleFileSelect(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setDragActive(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      handleFileSelect(files);
    };

    const handleRemove = (e: React.MouseEvent, index?: number) => {
      e.stopPropagation();
      
      if (multiple && Array.isArray(value) && index !== undefined) {
        const newFiles = value.filter((_, i) => i !== index);
        // Convert File[] back to FileList-like structure or pass null if empty
        const dataTransfer = new DataTransfer();
        newFiles.forEach(file => dataTransfer.items.add(file));
        onChange?.(newFiles.length > 0 ? dataTransfer.files : null);
      } else {
        onChange?.(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    const getFileDisplay = () => {
      if (!value) return null;

      if (multiple && Array.isArray(value)) {
        return (
          <div className="space-y-2">
            {value.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-neutral-border"
              >
                <FileIcon className="w-4 h-4 text-neutral-muted flex-shrink-0" />
                <span className="text-sm text-neutral-dark flex-1 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, index)}
                  className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        );
      }

      const file = value as File;
      const fileName = file?.name || "Unknown file";

      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-neutral-border">
          <FileIcon className="w-4 h-4 text-neutral-muted flex-shrink-0" />
          <span className="text-sm text-neutral-dark flex-1 truncate">{fileName}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    };

    const borderColor = hasError
      ? "border-red-500"
      : dragActive
        ? "border-primary"
        : "border-neutral-border hover:border-primary";

    const backgroundColor = dragActive ? "bg-primary-light/5" : "bg-neutral-light/50";

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-heading text-neutral-dark mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl px-6 py-8 text-center cursor-pointer
            transition-all duration-200
            ${borderColor}
            ${backgroundColor}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              (fileInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={disabled}
            required={required && !value}
            className="hidden"
            {...props}
          />
          {!value ? (
            <div className="flex flex-col items-center gap-3">
              {/* Upload Icon - 12x12 size */}
              <Upload className="w-12 h-12 text-neutral-muted" />
              <div>
                <p className="text-sm text-neutral-dark font-sans">
                  <span className="text-primary font-medium cursor-pointer hover:underline">
                    Upload a file
                  </span>{" "}
                  <span className="text-neutral-muted">or drag and drop</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full">{getFileDisplay()}</div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-neutral-muted">{helperText}</p>}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
