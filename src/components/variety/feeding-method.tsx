import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "traditional",
    name: "Bón phân truyền thống",
    desc: "Gom lượng phân của mỗi giai đoạn thành 1–2 lần bón, lịch thực tế phụ thuộc mùa vụ.",
  },
  {
    value: "smart",
    name: "Tưới phân thông minh",
    desc: "Tự động chia nhỏ lượng phân thành liều lượng hàng tuần (hoặc mỗi lần tưới). Cây ăn liên tục, không bị sốc.",
    tag: "SutaGrow",
  },
];

export function FeedingMethod() {
  const [value, setValue] = useState("traditional");

  return (
    <RadioGroup value={value} onValueChange={setValue} className="grid gap-3 md:grid-cols-2">
      {options.map((o) => (
        <Label
          key={o.value}
          htmlFor={`fm-${o.value}`}
          className={cn(
            "grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-lg border p-4 transition-colors",
            value === o.value
              ? "border-primary bg-primary-soft/40"
              : "border-border hover:bg-secondary/50",
          )}
        >
          <RadioGroupItem id={`fm-${o.value}`} value={o.value} className="mt-0.5" />
          <div className="min-w-0 space-y-1">
            <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
              {o.name}
              {o.tag ? (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                  {o.tag}
                </span>
              ) : null}
            </span>
            <p className="text-xs font-normal leading-relaxed text-muted-foreground">{o.desc}</p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
