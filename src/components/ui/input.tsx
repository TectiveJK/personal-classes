import * as React from "react";
import { cn } from "cn";

export function Input({
  className,
  type = "text",
  autoComplete = "off",
  onFocus,
  onPointerDown,
  onInput,
  ...props
}: React.ComponentProps<"input">) {
  const burst = React.useRef({ ch: "", startLen: 0, count: 0, at: 0 });

  return (
    <input
      type={type}
      data-slot="input"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      autoComplete={autoComplete}
      data-1p-ignore="true"
      data-lpignore="true"
      data-form-type="other"
      {...props}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      ref={(node) => {
        if (node && document.activeElement !== node) {
          node.setAttribute("readonly", "true");
        }
      }}
      onPointerDown={(event) => {
        event.currentTarget.removeAttribute("readonly");
        onPointerDown?.(event);
      }}
      onFocus={(event) => {
        window.setTimeout(() => {
          event.currentTarget.removeAttribute("readonly");
        }, 40);
        onFocus?.(event);
      }}
      onInput={(event) => {
        const el = event.currentTarget;
        const native = event.nativeEvent as InputEvent;
        const data = native.data ?? "";
        const now = performance.now();
        const repeatedBlob = /^(.)\1{6,}$/;

        if (
          (native.inputType === "insertReplacementText" ||
            native.inputType === "insertFromYank" ||
            native.inputType === "insertFromPaste" ||
            native.inputType === "insertFromAutoFill") &&
          (repeatedBlob.test(data) || repeatedBlob.test(el.value))
        ) {
          el.value = "";
          return;
        }

        if (native.inputType === "insertText" && data.length === 1) {
          const state = burst.current;
          if (data === state.ch && now - state.at < 90) {
            state.count += 1;
            state.at = now;
            if (state.count >= 5) {
              el.value = el.value.slice(0, state.startLen + 1);
              return;
            }
          } else {
            burst.current = {
              ch: data,
              startLen: Math.max(0, el.value.length - 1),
              count: 1,
              at: now,
            };
          }
        } else {
          burst.current = { ch: "", startLen: 0, count: 0, at: 0 };
        }

        onInput?.(event);
      }}
    />
  );
}
