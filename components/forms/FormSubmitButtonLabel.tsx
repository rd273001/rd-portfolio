import { LoadingSpinner } from "@/components/primitives";

type FormSubmitButtonLabelProps = {
  busy: boolean;
  idleLabel: string;
  busyLabel?: string;
};

export function FormSubmitButtonLabel({
  busy,
  idleLabel,
  busyLabel = "Sending…",
}: FormSubmitButtonLabelProps) {
  if (!busy) {
    return idleLabel;
  }

  return (
    <span className="inline-flex items-center justify-center gap-2">
      <LoadingSpinner />
      {busyLabel}
    </span>
  );
}