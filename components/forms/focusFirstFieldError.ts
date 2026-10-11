export function focusFirstFieldError(
  errors: Record<string, string>,
  fieldOrder: readonly string[],
  idPrefix: string,
) {
  for (const field of fieldOrder) {
    if (!errors[field]) {
      continue;
    }

    const element = document.getElementById(`${idPrefix}-${field}`);
    if (element && typeof element.focus === "function") {
      element.focus();
      return;
    }
  }
}