import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Thermometer, Droplets, CloudRain, Sun, Wind, FlaskConical, Zap, Info, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVarietyStages } from "@/lib/variety-stages";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type EnvironmentFilter = "all" | "soil" | "air" | "water";
type EnvironmentCategory = Exclude<EnvironmentFilter, "all">;

type Param = {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  icon: ReactNode;
  tint: string;
  category: EnvironmentCategory;
  description?: string;
};

const PARAMS: Param[] = [
  { key: "soil-moisture", label: "Độ ẩm đất", unit: "%", min: 0, max: 100, icon: <Droplets className="size-4" />, tint: "text-chart-2", category: "soil" },
  { key: "ph", label: "pH đất", unit: "", min: 3, max: 10, step: 0.1, icon: <FlaskConical className="size-4" />, tint: "text-primary", category: "soil" },
  { key: "ec", label: "EC đất", unit: "µS/cm", min: 0, max: 5000, icon: <Zap className="size-4" />, tint: "text-chart-5", category: "soil", description: "Chỉ số này phản ánh mức độ phì nhiêu, lượng dinh dưỡng tồn dư và độ mặn của đất." },
  { key: "temp", label: "Nhiệt độ không khí", unit: "°C", min: 0, max: 50, icon: <Thermometer className="size-4" />, tint: "text-chart-1", category: "air" },
  { key: "humidity", label: "Độ ẩm không khí", unit: "%", min: 0, max: 100, icon: <CloudRain className="size-4" />, tint: "text-chart-3", category: "air" },
  { key: "light", label: "Ánh sáng", unit: "lux", min: 0, max: 100000, icon: <Sun className="size-4" />, tint: "text-chart-4", category: "air" },
  { key: "wind", label: "Gió cảnh báo", unit: "km/h", min: 0, max: 120, icon: <Wind className="size-4" />, tint: "text-chart-5", category: "air" },
  { key: "water-ph", label: "pH nước", unit: "pH", min: 0, max: 14, step: 0.1, icon: <Droplets className="size-4" />, tint: "text-sky-500", category: "water" },
  { key: "water-temp", label: "Nhiệt độ nước", unit: "°C", min: -10, max: 60, step: 0.1, icon: <Thermometer className="size-4" />, tint: "text-cyan-500", category: "water" },
  { key: "water-do", label: "DO", unit: "mg/L", min: 0, max: 20, step: 0.1, icon: <Waves className="size-4" />, tint: "text-blue-500", category: "water", description: "Độ oxy hòa tan." },
  { key: "water-orp", label: "ORP", unit: "mV", min: -2000, max: 2000, icon: <Zap className="size-4" />, tint: "text-violet-500", category: "water", description: "ORP đo lường mức độ sạch, lượng oxy hòa tan và mức độ ô nhiễm của môi trường nước." },
  { key: "water-ec", label: "EC nước", unit: "µS/cm", min: 0, max: 10000, icon: <FlaskConical className="size-4" />, tint: "text-teal-500", category: "water", description: "EC dùng để đo nồng độ các ion muối khoáng và phân bón hòa tan trong nước." },
];

const presets: Record<string, [number, number]> = {
  "soil-moisture": [40, 80],
  temp: [20, 32],
  humidity: [60, 85],
  ph: [5.5, 7],
  ec: [500, 1500],
  light: [15000, 40000],
  wind: [25, 40],
  "water-ph": [6.5, 8.5],
  "water-temp": [20, 30],
  "water-do": [5, 10],
  "water-orp": [200, 400],
  "water-ec": [500, 1500],
};

const defaultValue = (p: Param): [number, number] => presets[p.key] ?? [p.min, p.max];

export function EnvironmentMatrix({ category = "all" }: { category?: EnvironmentFilter }) {
  const stages = useVarietyStages();
  const [values, setValues] = useState<Record<string, Record<string, [number, number] | undefined>>>({});
  const [activeParam, setActiveParam] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const visibleParams = category === "all" ? PARAMS : PARAMS.filter((p) => p.category === category);

  const activateVisibleColumn = (event: MouseEvent<HTMLElement>, paramKey: string) => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    const cell = event.currentTarget.getBoundingClientRect();
    const viewport = scrollArea.getBoundingClientRect();
    const isVisible = cell.left >= viewport.left + 224 && cell.right <= viewport.right;
    setActiveParam(isVisible ? paramKey : null);
  };

  const get = (stageId: string, paramKey: string): [number, number] =>
    values[stageId]?.[paramKey] ?? defaultValue(PARAMS.find((p) => p.key === paramKey)!);

  const set = (stageId: string, paramKey: string, index: 0 | 1, raw: string) => {
    const param = PARAMS.find((p) => p.key === paramKey)!;
    const n = raw === "" ? undefined : Number(raw);
    if (n !== undefined && Number.isNaN(n)) return;
    setValues((prev) => {
      const stage = prev[stageId] ?? {};
      const current: [number, number] = stage[paramKey] ?? defaultValue(param);
      const next: [number, number] = [...current] as [number, number];
      if (n === undefined) {
        next[index] = 0;
      } else {
        next[index] = Math.min(param.max, Math.max(param.min, n));
      }
      if (index === 0 && next[0] > next[1]) next[1] = next[0];
      if (index === 1 && next[1] < next[0]) next[0] = next[1];
      return { ...prev, [stageId]: { ...stage, [paramKey]: next } };
    });
  };

  return (
    <TooltipProvider>
    <div className="space-y-4">
      <div
        ref={scrollAreaRef}
        onScroll={() => setActiveParam(null)}
        className="w-fit max-w-full overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]"
      >
        <table
          className="table-fixed border-separate border-spacing-0 text-sm"
          style={{ width: 224 + visibleParams.length * 110 }}
        >
          <colgroup>
            <col style={{ width: 224 }} />
            {visibleParams.map((param) => <col key={param.key} style={{ width: 110 }} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-56 border-b border-r border-border bg-card px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Giai đoạn
              </th>
              {visibleParams.map((p) => (
                <th
                  key={p.key}
                  onMouseEnter={(event) => activateVisibleColumn(event, p.key)}
                  onMouseLeave={() => setActiveParam(null)}
                  className={cn(
                    "min-w-[110px] border-b border-r border-border px-2 py-2.5 text-center transition-colors last:border-r-0",
                    activeParam === p.key && "bg-primary-soft/60",
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={cn("grid size-6 place-items-center rounded-md bg-secondary", p.tint)}>{p.icon}</span>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1">
                        <p className="whitespace-normal break-words text-[11px] font-semibold leading-tight text-foreground">
                          {p.label}
                        </p>
                        {p.description ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="shrink-0 text-muted-foreground hover:text-primary" aria-label={`Giải thích ${p.label}`}><Info className="size-3" /></button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs"><p>{p.description}</p></TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                      <p className="text-[9px] tabular-nums text-muted-foreground">{p.unit || "—"}</p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stages.map((s, rowIdx) => (
              <tr key={s.id} className="group/row">
                <td className="sticky left-0 z-10 w-56 border-b border-r border-border bg-card px-3 py-2.5 transition-colors group-hover/row:bg-secondary">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">
                      {rowIdx + 1}
                    </span>
                    <span className="line-clamp-2 whitespace-normal break-words text-[13px] font-medium leading-tight text-foreground">{s.name}</span>
                  </div>
                </td>
                {visibleParams.map((p) => {
                  const [lo, hi] = get(s.id, p.key);
                  const isActive = activeParam === p.key;
                  return (
                    <td
                      key={`${s.id}-${p.key}`}
                      onMouseEnter={(event) => activateVisibleColumn(event, p.key)}
                      onMouseLeave={() => setActiveParam(null)}
                      className={cn(
                        "border-b border-r border-border px-1.5 py-2 transition-colors group-hover/row:bg-secondary/20 last:border-r-0",
                        isActive && "bg-primary-soft/40",
                      )}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          inputMode="decimal"
                          step={p.step ?? 1}
                          min={p.min}
                          max={p.max}
                          placeholder="Min"
                          value={lo}
                          onChange={(e) => set(s.id, p.key, 0, e.target.value)}
                          className="h-8 w-full min-w-[44px] rounded-md border border-transparent bg-transparent px-1 text-center text-[11px] font-semibold tabular-nums text-foreground outline-none transition-colors hover:bg-secondary/60 focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20"
                          aria-label={`${p.label} tối thiểu ${s.name}`}
                        />
                        <span className="shrink-0 text-[10px] text-muted-foreground/60">—</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          step={p.step ?? 1}
                          min={p.min}
                          max={p.max}
                          placeholder="Max"
                          value={hi}
                          onChange={(e) => set(s.id, p.key, 1, e.target.value)}
                          className="h-8 w-full min-w-[44px] rounded-md border border-transparent bg-transparent px-1 text-center text-[11px] font-semibold tabular-nums text-foreground outline-none transition-colors hover:bg-secondary/60 focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20"
                          aria-label={`${p.label} tối đa ${s.name}`}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Info className="size-3.5 shrink-0" />
        <span className="text-xs">Di chuột qua cột chỉ số để làm nổi bật. Giá trị bên trái không thể lớn hơn bên phải.</span>
      </div>
    </div>
    </TooltipProvider>
  );
}
