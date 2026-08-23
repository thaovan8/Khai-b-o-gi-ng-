import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
  /** Slider-only mode: hide the numeric inputs. */
  hideInputs?: boolean;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Dual-thumb range with both ends editable from the slider or the number inputs. */
export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  minLabel = "Min",
  maxLabel = "Max",
  className,
  hideInputs = false,
}: Props) {
  const [lo, hi] = value;
  const [loText, setLoText] = useState(String(lo));
  const [hiText, setHiText] = useState(String(hi));

  useEffect(() => setLoText(String(lo)), [lo]);
  useEffect(() => setHiText(String(hi)), [hi]);

  const commitLo = (raw: string) => {
    const n = Number(raw);
    if (raw === "" || Number.isNaN(n)) return setLoText(String(lo));
    onChange([clamp(n, min, hi), hi]);
  };
  const commitHi = (raw: string) => {
    const n = Number(raw);
    if (raw === "" || Number.isNaN(n)) return setHiText(String(hi));
    onChange([lo, clamp(n, lo, max)]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <Label className="min-w-0 truncate">{label}</Label>
          <span className="shrink-0 rounded-md bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
            {lo} – {hi}
            {unit ? ` ${unit}` : ""}
          </span>
        </div>
      ) : null}

      <Slider
        value={[lo, hi]}
        onValueChange={(v) => onChange([v[0]!, v[1]!])}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        aria-label={label}
      />

      {hideInputs ? null : (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
          <Label className="text-xs text-muted-foreground">{minLabel}</Label>
          <div className="relative">
            <Input
              type="number"
              inputMode="decimal"
              min={min}
              max={hi}
              step={step}
              className={unit ? "pr-12" : undefined}
              value={loText}
              onChange={(e) => setLoText(e.target.value)}
              onBlur={(e) => commitLo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitLo((e.target as HTMLInputElement).value)}
            />
            {unit ? (
              <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs text-muted-foreground">
                {unit}
              </span>
            ) : null}
          </div>
        </div>
        <div className="min-w-0 space-y-1.5">
          <Label className="text-xs text-muted-foreground">{maxLabel}</Label>
          <div className="relative">
            <Input
              type="number"
              inputMode="decimal"
              min={lo}
              max={max}
              step={step}
              className={unit ? "pr-12" : undefined}
              value={hiText}
              onChange={(e) => setHiText(e.target.value)}
              onBlur={(e) => commitHi(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitHi((e.target as HTMLInputElement).value)}
            />
            {unit ? (
              <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs text-muted-foreground">
                {unit}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
