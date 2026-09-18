"use client";

import React, { ReactNode, useId } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

/**
 * Shared field parts for the three lead forms (quick quote, product lead form,
 * Design Your Uniform).
 *
 * Every form on the site used to be a stack of pill inputs with nothing but a
 * placeholder to say what went in them — the label vanished the moment someone
 * typed, there was no focus ring worth the name, and a bad email only surfaced
 * as a browser tooltip. These parts give every field a visible label, a
 * described error, a real focus ring, and the right `type` / `autocomplete` so
 * a phone fills them in one tap.
 *
 * What they deliberately do NOT touch: the honeypot input, the `data-ga-event`
 * attribute on the <form>, the artwork upload, or the POST to /api/lead/.
 */

export type FieldErrors = Record<string, string>;

export function isEmail(value: string) {
  // Deliberately loose: the job is catching "joe@school" and "joe.school.org",
  // not adjudicating RFC 5322.
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

export function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

type BaseProps = {
  label: string;
  /** Sits under the control; also becomes the accessible description. */
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Grid span helper — the forms are two-column from `sm` up. */
  wide?: boolean;
};

function Shell({
  label,
  hint,
  error,
  required,
  wide,
  id,
  children,
}: BaseProps & { id: string; children: (ids: { id: string; describedBy?: string }) => ReactNode }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field${wide ? " sm:col-span-2" : ""}`} data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="field-label">
        {label}
        {required ? (
          <span className="field-required" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="field-optional">Optional</span>
        )}
      </label>
      {children({ id, describedBy })}
      {error ? (
        <p id={errorId} role="alert" className="field-error">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = BaseProps & {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  placeholder?: string;
};

export function TextField({
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  ...base
}: TextFieldProps) {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  return (
    <Shell {...base} id={id}>
      {({ describedBy }) => (
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode ?? (type === "email" ? "email" : type === "tel" ? "tel" : undefined)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={base.required}
          aria-invalid={base.error ? true : undefined}
          aria-describedby={describedBy}
          className="field-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      )}
    </Shell>
  );
}

type TextAreaFieldProps = BaseProps & {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
};

export function TextAreaField({
  name,
  value,
  onChange,
  onBlur,
  rows = 5,
  placeholder,
  ...base
}: TextAreaFieldProps) {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  return (
    <Shell {...base} id={id}>
      {({ describedBy }) => (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={base.required}
          aria-invalid={base.error ? true : undefined}
          aria-describedby={describedBy}
          className="field-input field-textarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      )}
    </Shell>
  );
}

type FileFieldProps = BaseProps & {
  name: string;
  accept: string;
  fileName?: string;
  onSelect: (input: HTMLInputElement) => void;
};

export function FileField({ name, accept, fileName, onSelect, ...base }: FileFieldProps) {
  const reactId = useId();
  const id = `${name}-${reactId}`;
  return (
    <Shell {...base} id={id}>
      {({ describedBy }) => (
        <>
          <input
            id={id}
            name={name}
            type="file"
            accept={accept}
            aria-invalid={base.error ? true : undefined}
            aria-describedby={describedBy}
            className="field-input field-file"
            onChange={(event) => onSelect(event.target)}
          />
          {fileName ? (
            <p className="field-file-name">
              Attached: <span className="font-semibold">{fileName}</span>
            </p>
          ) : null}
        </>
      )}
    </Shell>
  );
}

/**
 * True when focus is leaving a field for the form's own submit button.
 *
 * Showing a blur-time error in that moment inserts a line of text between
 * mousedown and mouseup, the button slides down, the click lands on the form
 * instead of the button and the submit never fires. Let the submit handler
 * raise the error a moment later instead.
 */
export function leavingForSubmit(event: React.FocusEvent<HTMLElement>) {
  const next = event.relatedTarget as HTMLElement | null;
  if (!next) return false;
  const button = next.closest?.("button");
  return Boolean(button && (button.getAttribute("type") ?? "submit") === "submit");
}

/** Red banner above the submit button for a failed send. */
export function FormAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="form-alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

export function SubmitButton({
  sending,
  label,
  sendingLabel = "Sending…",
  children,
  onClick,
  variant = "primary",
  inline = false,
}: {
  sending: boolean;
  label: string;
  sendingLabel?: string;
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  /** Shrink to its content from `sm` up — full width in a narrow column. */
  inline?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={sending}
      aria-busy={sending || undefined}
      onClick={onClick}
      className={`${variant === "primary" ? "btn-submit" : "btn-submit-outline"}${
        inline ? " is-inline" : ""
      }`}
    >
      {sending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {sendingLabel}
        </>
      ) : (
        <>
          {children}
          {label}
        </>
      )}
    </button>
  );
}
