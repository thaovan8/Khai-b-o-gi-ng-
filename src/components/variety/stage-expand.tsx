import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVarietyStages } from "@/lib/variety-stages";

type Entry = { id: string; phase: string; stageId: string; days: string };

let seq = 0;
const newEntry = (): Entry => ({ id: `custom-${++seq}`, phase: "trong", stageId: "", days: "" });

const PHASES = [
  { value: "truoc", label: "Trước" },
  { value: "trong", label: "Trong" },
  { value: "sau", label: "Sau" },
];

/** Full-width expander that opens a single table of custom stage overrides. */
export function StageExpand({
  label = "Khai báo theo giai đoạn",
  renderStage,
}: {
  label?: string;
  renderStage: (stage: { id: string; name: string }) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(() => [newEntry()]);
  const stages = useVarietyStages();

  const update = (id: string, patch: Partial<Entry>) =>
    setEntries((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary"
      >
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        {open ? "Thu gọn" : label}
      </button>

      {open ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-secondary/40 p-4">
            {/* Table header */}
            <div className="grid grid-cols-[2rem_5rem_1fr_5rem_2rem] gap-2 border-b border-border pb-2 text-xs font-semibold text-muted-foreground">
              <div className="text-center">STT</div>
              <div>Thời điểm</div>
              <div>Giai đoạn</div>
              <div className="text-right">Thời gian</div>
              <div></div>
            </div>

            {/* Table body */}
            <div className="mt-2 space-y-3">
              {entries.map((e, i) => (
                <div key={e.id} className="space-y-3">
                  <div className="grid grid-cols-[2rem_5rem_1fr_5rem_2rem] items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </div>

                    <Select value={e.phase} onValueChange={(v) => update(e.id, { phase: v })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        {PHASES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={e.stageId} onValueChange={(v) => update(e.id, { stageId: v })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={`Chọn giai đoạn ${i + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={e.days}
                      onChange={(ev) => update(e.id, { days: ev.target.value })}
                      placeholder="0"
                      className="h-9 text-right"
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Xóa"
                      className="size-8"
                      onClick={() => setEntries((es) => es.filter((x) => x.id !== e.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  {renderStage({
                    id: e.id,
                    name: stages.find((s) => s.id === e.stageId)?.name ?? "",
                  })}
                </div>
              ))}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setEntries((es) => [...es, newEntry()])}
          >
            <Plus className="size-4" /> Thêm mốc
          </Button>
        </div>
      ) : null}
    </div>
  );
}
