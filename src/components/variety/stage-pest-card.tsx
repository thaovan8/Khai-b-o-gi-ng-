import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bug, ChevronDown, ChevronUp, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PestModule, type CatalogItem, type Entry } from "@/components/variety/pest-module";
import { suggestPests, type PestSuggestion } from "@/lib/pest-suggest.functions";
import type { SharedStage } from "@/lib/variety-stages";

function merge(current: Entry[], suggestions: PestSuggestion[]): Entry[] {
  const next = [...current];
  suggestions.forEach((s, i) => {
    if (next.some((e) => e.name.trim().toLowerCase() === s.name.trim().toLowerCase())) return;
    next.push({
      id: `ai-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      name: s.name,
      level: s.level,
      note: s.note,
      custom: true,
      aiSuggested: true,
    });
  });
  return next;
}

export type StageData = { diseases: Entry[]; pests: Entry[] };

export function StagePestCard({
  index,
  stage,
  varietyName,
  diseaseCatalog,
  pestCatalog,
  value,
  onChange,
}: {
  index: number;
  stage: SharedStage;
  varietyName: string;
  diseaseCatalog: CatalogItem[];
  pestCatalog: CatalogItem[];
  value: StageData;
  onChange: (next: StageData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runSuggest = useServerFn(suggestPests);

  useEffect(() => {
    if (!open || loaded || loading) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    runSuggest({ data: { varietyName, stageName: stage.name } })
      .then((res) => {
        if (cancelled) return;
        setLoaded(true);
        onChange({
          diseases: merge(value.diseases, res.diseases),
          pests: merge(value.pests, res.pests),
        });
      })
      .catch(() => {
        if (!cancelled) setError("Không tải được gợi ý từ AI.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loaded]);

  const total = value.diseases.length + value.pests.length;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-primary text-xs font-semibold text-primary-foreground">
          {index + 1}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-card-foreground">{stage.name}</h2>
          <p className="truncate text-xs text-muted-foreground">
            {total > 0 ? `${value.diseases.length} bệnh hại · ${value.pests.length} sâu hại` : "Chưa khai báo dịch hại"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!open || loading}
          onClick={() => setLoaded(false)}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Gợi ý bằng AI
        </Button>
      </header>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={
          open
            ? "flex w-full items-center justify-center gap-2 border-y border-border bg-secondary/40 py-2.5 text-xs font-medium text-primary"
            : "flex w-full items-center justify-center gap-2 border-t border-border bg-secondary/40 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        }
      >
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        {open ? "Thu gọn chi tiết" : "Chi tiết"}
      </button>

      {open ? (
        <div className="space-y-4 p-5">
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="min-w-0 rounded-lg border border-border bg-secondary/30 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary">
                  <ShieldAlert className="size-4" />
                </span>
                Danh mục Bệnh hại
              </h3>
              <PestModule
                catalog={diseaseCatalog}
                placeholder="Chọn loại bệnh từ danh mục chung..."
                noteLabel="Ghi chú dấu hiệu nhận biết:"
                earlyLabel="Ảnh dấu hiệu sớm"
                lateLabel="Ảnh dấu hiệu muộn"
                entries={value.diseases}
                onChange={(next) => onChange({ ...value, diseases: next })}
                loading={loading}
              />
            </div>
            <div className="min-w-0 rounded-lg border border-border bg-secondary/30 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Bug className="size-4" />
                </span>
                Danh mục Sâu hại
              </h3>
              <PestModule
                catalog={pestCatalog}
                placeholder="Chọn loại sâu từ danh mục chung..."
                noteLabel="Ghi chú dấu hiệu nhận biết:"
                earlyLabel="Ảnh dấu hiệu sớm"
                lateLabel="Ảnh dấu hiệu muộn"
                entries={value.pests}
                onChange={(next) => onChange({ ...value, pests: next })}
                loading={loading}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
