import { useEffect, useState } from "react";
import {
  Leaf,
  FlaskConical,
  Sprout,
  Apple,
  ShieldCheck,
  Sun,
  Sparkles,
  Flower2,
  Gem,
  Waves,
  Shield,
  Activity,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SectionCard } from "@/components/variety/section-card";
import { RangeField } from "@/components/variety/range-field";
import { useExtraStages } from "@/lib/variety-stages";
import { cn } from "@/lib/utils";

type Nut = {
  key: string;
  label: string;
  tooltip: string;
  icon: typeof Leaf;
};

const MACRO: Nut[] = [
  { key: "n", label: "Đạm (N)", tooltip: "Chuyên phát triển thân, lá, chồi (giúp cây xanh tốt, lớn nhanh).", icon: Leaf },
  { key: "p", label: "Lân (P)", tooltip: "Chuyên phát triển bộ rễ và kích thích phân hóa mầm hoa.", icon: Sprout },
  { key: "k", label: "Kali (K)", tooltip: "Chuyên nuôi hoa, dưỡng quả (tăng độ ngọt, màu sắc) và tăng sức đề kháng chống chịu thời tiết, sâu bệnh.", icon: Apple },
];
const MESO: Nut[] = [
  { key: "ca", label: "Canxi (Ca)", tooltip: "Giúp cứng cây, dày lá, chống nứt và thối đít trái.", icon: ShieldCheck },
  { key: "mg", label: "Magie (Mg)", tooltip: "Thành phần lõi của diệp lục, giúp xanh lá, quang hợp tốt.", icon: Sun },
  { key: "s", label: "Lưu huỳnh (S)", tooltip: "Tạo tinh dầu, hương vị và mùi thơm cho nông sản.", icon: Sparkles },
];
const MICRO: Nut[] = [
  { key: "b", label: "Bo (B)", tooltip: "Kích thích ra hoa, chống rụng hoa và trái non.", icon: Flower2 },
  { key: "zn", label: "Kẽm (Zn)", tooltip: "Giúp tăng sức đề kháng, bóng da, đẹp quả.", icon: Gem },
  { key: "fe", label: "Sắt (Fe)", tooltip: "Giúp tăng sức đề kháng, bóng da, đẹp quả.", icon: Waves },
  { key: "cu", label: "Đồng (Cu)", tooltip: "Giúp tăng sức đề kháng, bóng da, đẹp quả.", icon: Shield },
  { key: "mn", label: "Mangan (Mn)", tooltip: "Giúp tăng sức đề kháng, bóng da, đẹp quả.", icon: Activity },
];

type Values = Record<string, number | "">;

const GROUPS: { key: string; label: string; items: Nut[] }[] = [
  { key: "macro", label: "Đa lượng", items: MACRO },
  { key: "meso", label: "Trung lượng", items: MESO },
  { key: "micro", label: "Vi lượng", items: MICRO },
];

type Stage = {
  id: string;
  name: string;
  note?: string;
  values: Values;
};

const initialStages: Stage[] = [
  {
    id: "ktcb",
    name: "Kiến thiết cơ bản",
    note: "Kiến thiết cơ bản, nuôi bộ khung tán",
    values: { n: 180, p: 120, k: 100, ca: 40, mg: 15, s: 10, fe: 8, zn: 5, b: 3, cu: 2, mn: 4 },
  },
  {
    id: "g1",
    name: "Phục hồi sau thu hoạch",
    note: "Ưu tiên Đạm & Lân để hồi sức",
    values: { n: 150, p: 100, k: 80, ca: 20, mg: 8, s: 5, fe: 7, zn: 4, b: 2, cu: 2, mn: 3 },
  },
  {
    id: "g2",
    name: "Ra hoa & Đậu trái non",
    note: "Giai đoạn nhạy cảm, tránh stress",
    values: { n: 80, p: 90, k: 60, ca: 15, mg: 6, s: 4, fe: 6, zn: 4, b: 3, cu: 1, mn: 2 },
  },
  {
    id: "g3",
    name: "Nuôi trái lớn nhanh",
    note: "Cân bằng dinh dưỡng, cần nhiều nước",
    values: { n: 200, p: 40, k: 280, ca: 25, mg: 10, s: 6, fe: 8, zn: 5, b: 3, cu: 2, mn: 4 },
  },
  {
    id: "g5",
    name: "Thúc chín & Tích lũy",
    note: "Tích lũy đường, tăng chất lượng trái",
    values: { n: 50, p: 30, k: 200, ca: 12, mg: 6, s: 4, fe: 4, zn: 3, b: 2, cu: 1, mn: 2 },
  },
];

type Band = [number, number];

const SOIL: { key: string; label: string; scale: number }[] = [
  { key: "n", label: "Đạm tổng số (N)", scale: 400 },
  { key: "p", label: "Lân dễ tiêu (P2O5)", scale: 150 },
  { key: "k", label: "Kali trao đổi (K2O)", scale: 300 },
];

const defaultBands = (): Record<string, Band> => ({
  n: [60, 220],
  p: [15, 70],
  k: [40, 180],
});

function UnitPicker({
  units,
  value,
  onChange,
  onUnitsChange,
}: {
  units: string[];
  value: string;
  onChange: (u: string) => void;
  onUnitsChange: (next: string[], replaced?: { from: string; to: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const addUnit = () => {
    const u = draft.trim();
    if (!u || units.includes(u)) return;
    onUnitsChange([...units, u]);
    onChange(u);
    setDraft("");
  };

  const saveEdit = (from: string) => {
    const to = editText.trim();
    setEditing(null);
    if (!to || to === from || units.includes(to)) return;
    onUnitsChange(
      units.map((u) => (u === from ? to : u)),
      { from, to },
    );
  };

  const removeUnit = (u: string) => {
    if (units.length <= 1) return;
    const next = units.filter((x) => x !== u);
    onUnitsChange(next);
    if (value === u) onChange(next[0]!);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label="Chọn đơn vị" className="h-8 w-20 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {units.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Quản lý đơn vị">
            <Pencil className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 space-y-2">
          <p className="text-xs font-semibold text-foreground">Quản lý đơn vị</p>
          <div className="space-y-1">
            {units.map((u) => (
              <div key={u} className="flex items-center gap-1">
                {editing === u ? (
                  <>
                    <Input
                      autoFocus
                      className="h-8 text-xs"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(u);
                        if (e.key === "Escape") setEditing(null);
                      }}
                    />
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => saveEdit(u)}>
                      <Check className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditing(null)}>
                      <X className="size-3.5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 truncate text-sm text-foreground">{u}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Sửa ${u}`}
                      onClick={() => {
                        setEditing(u);
                        setEditText(u);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive"
                      aria-label={`Xóa ${u}`}
                      disabled={units.length <= 1}
                      onClick={() => removeUnit(u)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 border-t border-border pt-2">
            <Input
              className="h-8 text-xs"
              placeholder="Đơn vị mới"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addUnit()}
            />
            <Button variant="ghost" size="icon" className="size-8" aria-label="Thêm đơn vị" onClick={addUnit}>
              <Plus className="size-3.5" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function NutritionPlan() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const extraStages = useExtraStages();

  useEffect(() => {
    if (extraStages.length === 0) return;
    setStages((prev) => {
      const next: Stage[] = extraStages.map((e) => {
        const existing = prev.find((s) => s.id === e.id);
        const preset = initialStages.find((d) => d.id === e.id);
        return existing
          ? { ...existing, name: e.name, note: e.description || existing.note || "" }
          : preset
          ? { ...preset, name: e.name, note: e.description || preset.note || "" }
          : {
              id: e.id,
              name: e.name,
              note: e.description || "Giai đoạn bổ sung từ Bước 2",
              values: {} as Values,
            };
      });
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [extraStages]);

  const [soilStageId, setSoilStageId] = useState(initialStages[1]!.id);
  const [activeCol, setActiveCol] = useState<string | null>(null);
  const [soil, setSoil] = useState<Record<string, Record<string, Band>>>({});
  const [units, setUnits] = useState<string[]>(["g", "kg", "mg", "ml", "L"]);
  const [groupUnit, setGroupUnit] = useState<Record<string, string>>({
    macro: "g",
    meso: "g",
    micro: "mg",
  });

  const handleUnitsChange = (next: string[], replaced?: { from: string; to: string }) => {
    setUnits(next);
    setGroupUnit((prev) => {
      const out = { ...prev };
      for (const k of Object.keys(out)) {
        if (replaced && out[k] === replaced.from) out[k] = replaced.to;
        else if (!replaced && !next.includes(out[k]!)) out[k] = next[0]!;
      }
      return out;
    });
  };

  const activeSoilStageId = stages.some((s) => s.id === soilStageId)
    ? soilStageId
    : (stages[0]?.id ?? soilStageId);
  const bands = soil[activeSoilStageId] ?? defaultBands();
  const setBand = (k: string, v: Band) =>
    setSoil((prev) => {
      const base = prev[activeSoilStageId] ?? defaultBands();
      return { ...prev, [activeSoilStageId]: { ...base, [k]: v } };
    });

  const summaryRows = stages.map((s) => ({
    id: s.id,
    name: s.name,
    bands: soil[s.id] ?? defaultBands(),
  }));

  const setValue = (stageId: string, key: string, v: number | "") =>
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, values: { ...s.values, [key]: v } } : s)),
    );

  return (
    <div className="space-y-5">
      {/* Card 1 */}
      <SectionCard
        icon={<Leaf className="size-4" />}
        title="Định mức phân bón"
        subtitle="Khai báo lượng phân theo từng giai đoạn, mở rộng để cấu hình trung/vi lượng"
        noDivider
        action={
          <Button variant="outline" size="sm">
            <Sparkles className="size-3.5" /> Gợi ý của AI
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    className="sticky left-0 z-20 w-96 border-b border-r border-border bg-card px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Giai đoạn
                  </th>
                  {GROUPS.map((g) => (
                    <th
                      key={g.key}
                      colSpan={g.items.length}
                      className="border-b border-r border-border bg-secondary/40 px-2 py-1.5 text-center text-[11px] font-semibold text-foreground last:border-r-0"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{g.label}</span>
                        <UnitPicker
                          units={units}
                          value={groupUnit[g.key]!}
                          onChange={(u) => setGroupUnit((prev) => ({ ...prev, [g.key]: u }))}
                          onUnitsChange={handleUnitsChange}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
                <tr>
                  {GROUPS.flatMap((g) =>
                    g.items.map((nu) => (
                      <th
                        key={nu.key}
                        onMouseEnter={() => setActiveCol(nu.key)}
                        onMouseLeave={() => setActiveCol(null)}
                        className={cn(
                          "min-w-[92px] border-b border-r border-border px-2 py-2 text-center transition-colors last:border-r-0",
                          activeCol === nu.key && "bg-primary-soft/60",
                        )}
                      >
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex cursor-help items-center justify-center gap-1.5 text-[11px] font-semibold text-foreground">
                                <nu.icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                                {nu.label}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-72 text-left leading-relaxed">
                              <span className="font-semibold">{nu.label}:</span> {nu.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {stages.map((stage, i) => (
                  <tr key={stage.id} className="group/row">
                    <td className="sticky left-0 z-10 w-96 border-b border-r border-border bg-card px-3 py-2 transition-colors group-hover/row:bg-secondary/30">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="line-clamp-2 whitespace-normal break-words text-[13px] font-medium leading-tight text-foreground">
                          {stage.name}
                        </span>
                      </div>
                    </td>
                    {GROUPS.flatMap((g) =>
                      g.items.map((nu) => (
                        <td
                          key={`${stage.id}-${nu.key}`}
                          onMouseEnter={() => setActiveCol(nu.key)}
                          onMouseLeave={() => setActiveCol(null)}
                          className={cn(
                            "border-b border-r border-border px-1.5 py-1.5 transition-colors group-hover/row:bg-secondary/20 last:border-r-0",
                            activeCol === nu.key && "bg-primary-soft/40",
                          )}
                        >
                          <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            value={stage.values[nu.key] ?? ""}
                            placeholder="0"
                            onChange={(e) =>
                              setValue(stage.id, nu.key, e.target.value === "" ? "" : Number(e.target.value))
                            }
                            aria-label={`${nu.label} - ${stage.name}`}
                            className="h-8 w-full rounded-md border border-transparent bg-transparent px-1 text-center text-[11px] font-semibold tabular-nums text-foreground outline-none transition-colors hover:bg-secondary/60 focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20"
                          />
                        </td>
                      )),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      {/* Card 3 */}
      <SectionCard
        icon={<FlaskConical className="size-4" />}
        title="Ngưỡng dinh dưỡng đất (AI cảnh báo)"
        subtitle="Khai báo ngưỡng chuẩn theo từng giai đoạn"
        noDivider
        action={
          <Button variant="outline" size="sm">
            <Sparkles className="size-3.5" /> Gợi ý của AI
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="soil-stage-select" className="text-xs">
                Giai đoạn khai báo
              </Label>
              <Select value={activeSoilStageId} onValueChange={setSoilStageId}>
                <SelectTrigger id="soil-stage-select" className="w-full md:max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Khai báo chỉ số dinh dưỡng đất tiêu chuẩn (ppm)
            </p>
            {SOIL.map((s) => (
              <div key={s.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-foreground">{s.label}</p>
                </div>
                <RangeField
                  value={bands[s.key]!}
                  onChange={(v) => setBand(s.key, v)}
                  min={0}
                  max={s.scale}
                  step={1}
                />
              </div>
            ))}
          </div>

          <div className="min-w-0 space-y-2 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <p className="text-xs font-medium text-muted-foreground">
              Bảng tổng hợp ngưỡng theo giai đoạn (ppm)
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="py-2 text-left font-medium">Giai đoạn</th>
                    {SOIL.map((s) => (
                      <th key={s.key} className="py-2 text-right font-medium">
                        {s.key.toUpperCase()} (min–max)
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((r) => (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-t border-border/60",
                        r.id === activeSoilStageId && "bg-primary-soft/50",
                      )}
                    >
                      <td className="py-2 pr-3 font-medium text-foreground">{r.name}</td>
                      {SOIL.map((s) => {
                        const b = r.bands[s.key]!;
                        return (
                          <td
                            key={s.key}
                            className="py-2 text-right tabular-nums whitespace-nowrap"
                          >
                            {b[0]} – {b[1]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
