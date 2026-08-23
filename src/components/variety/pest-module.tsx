import { useId, useState } from "react";
import { Edit3, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type CatalogItem = { value: string; name: string };

export type Entry = {
  id: string;
  name: string;
  level: string;
  note: string;
  custom: boolean;
  aiSuggested?: boolean;
};

const levels = [
  { value: "high", label: "Cao (Nhạy cảm)" },
  { value: "medium", label: "Trung bình" },
  { value: "low", label: "Thấp (Kháng tốt)" },
];

function UploadZone({ label }: { label: string }) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 block text-xs text-muted-foreground">
        {label}
      </label>
      <label
        htmlFor={id}
        className="grid h-20 cursor-pointer place-items-center rounded-lg border border-dashed border-border bg-secondary/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Upload className="size-4" />
        <input id={id} type="file" accept="image/*" multiple className="hidden" />
      </label>
    </div>
  );
}

export function PestModule({
  catalog,
  placeholder,
  addLabel = "Thêm",
  noteLabel,
  earlyLabel,
  lateLabel,
  entries,
  onChange,
  loading,
}: {
  catalog: CatalogItem[];
  placeholder: string;
  addLabel?: string;
  noteLabel: string;
  earlyLabel: string;
  lateLabel: string;
  entries: Entry[];
  onChange: (next: Entry[]) => void;
  loading: boolean;
}) {
  const [selected, setSelected] = useState("");

  const addFromCatalog = (value: string) => {
    const item = catalog.find((c) => c.value === value);
    if (!item) return;
    setSelected(value);
    if (entries.some((e) => e.id === value)) return;
    onChange([...entries, { id: value, name: item.name, level: "high", note: "", custom: false }]);
  };

  const addCustom = () =>
    onChange([
      ...entries,
      { id: `custom-${Date.now()}`, name: "", level: "high", note: "", custom: true },
    ]);

  const patch = (id: string, next: Partial<Entry>) =>
    onChange(entries.map((e) => (e.id === id ? { ...e, ...next } : e)));

  const remove = (id: string) => onChange(entries.filter((e) => e.id !== id));

  const closeForm = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    if (id.startsWith("ai-")) {
      patch(id, { aiSuggested: true });
    } else {
      remove(id);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="flex items-center gap-2 rounded-lg border border-border bg-primary-soft/40 px-3 py-2.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin text-primary" /> AI đang phân tích theo giống cây
          và giai đoạn...
        </p>
      ) : null}

      <div>
        <p className="mb-1 text-xs text-muted-foreground">Chọn thủ công từ danh mục chung</p>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <Select value={selected} onValueChange={addFromCatalog}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {catalog.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addCustom}>
            <Plus className="size-4" /> {addLabel}
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
          Chọn từ danh mục hoặc nhấn “{addLabel}” để tạo mục mới.
        </p>
      ) : null}

      {entries.map((entry) =>
        entry.aiSuggested ? (
          <article
            key={entry.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{entry.name}</h3>
                <Badge
                  variant={entry.level === "high" ? "destructive" : entry.level === "medium" ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {levels.find((l) => l.value === entry.level)?.label.split(" ")[0]}
                </Badge>
              </div>
              {entry.note ? (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{entry.note}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Chỉnh sửa ${entry.name || "mục"}`}
                onClick={() => patch(entry.id, { aiSuggested: false })}
                className="text-muted-foreground hover:text-primary"
              >
                <Edit3 className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Xóa ${entry.name || "mục"}`}
                onClick={() => remove(entry.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </article>
        ) : (
          <article key={entry.id} className="space-y-3 rounded-lg border border-border bg-background p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              {entry.custom ? (
                <Input
                  value={entry.name}
                  onChange={(e) => patch(entry.id, { name: e.target.value })}
                  placeholder="Tên dịch hại"
                />
              ) : (
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground">{entry.name}</h3>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Đóng form ${entry.name || "mục"}`}
                onClick={() => closeForm(entry.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="grid items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)]">
              <span className="text-xs text-muted-foreground">Mức độ nhạy cảm:</span>
              <Select value={entry.level} onValueChange={(v) => patch(entry.id, { level: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="mb-1 text-xs text-muted-foreground">{noteLabel}</p>
              <Textarea
                value={entry.note}
                onChange={(e) => patch(entry.id, { note: e.target.value })}
                placeholder="Mô tả triệu chứng..."
                rows={2}
              />
            </div>

            <div>
              <p className="mb-2 text-xs text-muted-foreground">Dữ liệu hình ảnh triệu chứng</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <UploadZone label={earlyLabel} />
                <UploadZone label={lateLabel} />
              </div>
            </div>
          </article>
        ),
      )}
    </div>
  );
}