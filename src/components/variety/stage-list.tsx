import { Fragment, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Image,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setExtraStages } from "@/lib/variety-stages";

function AutoTextarea({
  value,
  onChange,
  maxLength = 500,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { maxLength?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 36)}px`;
  }, [value]);
  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      rows={1}
      className={cn("min-h-9 resize-none overflow-hidden", className)}
      {...props}
    />
  );
}

type CounterTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "maxLength"
> & {
  value?: string;
  maxLength?: number;
};

function CounterTextarea({
  value = "",
  onChange,
  maxLength = 500,
  className,
  ...props
}: CounterTextareaProps) {
  const atLimit = value.length >= maxLength;
  return (
    <div className="relative">
      <AutoTextarea
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={1}
        className={cn(
          "min-h-9 resize-none overflow-hidden pb-5",
          atLimit && "border-destructive focus-visible:ring-destructive focus-visible:ring-1",
          className,
        )}
        {...props}
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-1.5 right-2 text-[10px]",
          atLimit ? "font-medium text-destructive" : "text-muted-foreground",
        )}
      >
        {value.length}/{maxLength}
      </span>
    </div>
  );
}

type Unit = "day" | "month" | "year";

const UNIT_LABEL: Record<Unit, string> = {
  day: "Ngày",
  month: "Tháng",
  year: "Năm",
};

const UNIT_DAYS: Record<Unit, number> = { day: 1, month: 30, year: 365 };

export type TraitRow = { id: string; part: string; note: string; images?: string[] | undefined };
export type TechRow = { id: string; name: string; detail: string; images?: string[] | undefined };

export type Stage = {
  id: string;
  name: string;
  description: string;
  durationStart: number | "";
  durationEnd: number | "";
  unit: Unit;
  traits: TraitRow[];
  techs: TechRow[];
};

const PARTS = ["Rễ", "Thân", "Chồi / Đọt", "Lá", "Hoa", "Quả", "Hạt", "Khác"];

const uid = () => Math.random().toString(36).slice(2, 9);

function TraitImages({
  images = [],
  label,
  onChange,
}: {
  images?: string[] | undefined;
  label: string;
  onChange: (images?: string[] | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const pick = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newImages: string[] = [];
    let pending = files.length;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(String(reader.result));
        pending--;
        if (pending === 0) onChange([...images, ...newImages]);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (previewIndex !== null && previewIndex >= images.length) {
      setPreviewIndex(images.length > 0 ? images.length - 1 : null);
    }
  }, [images.length, previewIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === "Escape") setPreviewIndex(null);
      if (e.key === "ArrowRight") {
        setPreviewIndex((i) => (i === null ? null : (i + 1) % images.length));
      }
      if (e.key === "ArrowLeft") {
        setPreviewIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewIndex, images.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(Math.max(0, Math.min(idx, images.length - 1)));
  };

  const goTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: idx * scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const closePreview = () => setPreviewIndex(null);

  return (
    <div className="flex h-full w-full flex-col gap-1">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-card",
          images.length === 0 ? "size-10 self-start" : "h-32 w-full border border-border",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label={`Tải ảnh ${label}`}
          onChange={(e) => {
            pick(e.target.files);
            e.target.value = "";
          }}
        />
        {images.length === 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`Tải ảnh ${label}`}
                onClick={() => inputRef.current?.click()}
                className="grid size-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                <Image className="size-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ảnh</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="relative h-full w-full">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
            >
              {images.map((src, idx) => (
                <div
                  key={`${src.slice(-24)}-${idx}`}
                  className="group relative h-full w-full shrink-0 snap-center cursor-zoom-in bg-muted"
                  onClick={() => setPreviewIndex(idx)}
                >
                  <img
                    src={src}
                    alt={`Ảnh ${label} ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    aria-label={`Xóa ảnh ${label} ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(images.filter((_, i) => i !== idx));
                    }}
                    className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Ảnh trước"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo((activeIndex - 1 + images.length) % images.length);
                  }}
                  className="absolute left-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-primary"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Ảnh sau"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo((activeIndex + 1) % images.length);
                  }}
                  className="absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-primary"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            ) : null}
          </div>
        )}
        {images.length > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`Tải ảnh ${label}`}
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-primary"
              >
                <Upload className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tải ảnh lên</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex items-center justify-center gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Xem ảnh ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                i === activeIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      ) : null}

      {previewIndex !== null && previewIndex < images.length ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closePreview}
        >
          <button
            type="button"
            aria-label="Đóng xem trước"
            onClick={closePreview}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/40"
          >
            <X className="size-6" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Ảnh trước"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((previewIndex - 1 + images.length) % images.length);
                }}
                className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/40"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Ảnh sau"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((previewIndex + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/40"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <img
            src={images[previewIndex]}
            alt={`Xem trước ảnh ${previewIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}

function TraitImagePreview({
  images = [],
  label,
}: {
  images?: string[] | undefined;
  label: string;
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <>
      <button
        type="button"
        className="relative block h-20 w-28 overflow-hidden rounded-lg bg-muted"
        onClick={() => setPreviewIndex(0)}
        aria-label={`Xem ảnh ${label}`}
      >
        <img src={images[0]} alt={`Ảnh ${label}`} className="h-full w-full object-cover" />
        {images.length > 1 ? (
          <span className="absolute bottom-1 right-1 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white">
            +{images.length - 1}
          </span>
        ) : null}
      </button>

      {previewIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewIndex(null)}
        >
          <button
            type="button"
            aria-label="Đóng xem trước"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-background/20 text-white hover:bg-background/40"
            onClick={() => setPreviewIndex(null)}
          >
            <X className="size-6" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Ảnh trước"
                className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/20 text-white hover:bg-background/40"
                onClick={(event) => {
                  event.stopPropagation();
                  setPreviewIndex((previewIndex - 1 + images.length) % images.length);
                }}
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Ảnh sau"
                className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/20 text-white hover:bg-background/40"
                onClick={(event) => {
                  event.stopPropagation();
                  setPreviewIndex((previewIndex + 1) % images.length);
                }}
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}
          <img
            src={images[previewIndex]}
            alt={`Ảnh ${label} ${previewIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}

const initialStages: Stage[] = [
  {
    id: "ktcb",
    name: "Kiến thiết cơ bản",
    description: "Cây con, tập trung phát triển thân lá",
    durationStart: 25,
    durationEnd: 30,
    unit: "month",
    traits: [],
    techs: [],
  },
  {
    id: "g1",
    name: "Phục hồi sau thu hoạch",
    description: "Ưu tiên Đạm & Lân để hồi sức",
    durationStart: 40,
    durationEnd: 45,
    unit: "day",
    traits: [],
    techs: [],
  },
  {
    id: "g2",
    name: "Ra hoa & Đậu trái non",
    description: "Giai đoạn nhạy cảm, tránh stress",
    durationStart: 40,
    durationEnd: 45,
    unit: "day",
    traits: [],
    techs: [],
  },
  {
    id: "g3",
    name: "Nuôi trái lớn nhanh",
    description: "Cân bằng dinh dưỡng, cần nhiều nước",
    durationStart: 85,
    durationEnd: 90,
    unit: "day",
    traits: [],
    techs: [],
  },
  {
    id: "g5",
    name: "Thúc chín & Tích lũy",
    description: "Tích lũy đường, tăng chất lượng trái",
    durationStart: 28,
    durationEnd: 30,
    unit: "day",
    traits: [],
    techs: [],
  },
];

export function StageList() {
  return <StageListInner />;
}

function StageTabs({
  stage,
  onChange,
}: {
  stage: Stage;
  onChange: (patch: Partial<Stage>) => void;
}) {
  const [tab, setTab] = useState<"traits" | "tech">("traits");
  const [isAddingTrait, setIsAddingTrait] = useState(false);
  const [editingTraitId, setEditingTraitId] = useState<string | null>(null);
  const [traitDraft, setTraitDraft] = useState({
    part: PARTS[0],
    customPart: "",
    note: "",
    images: [] as string[],
  });
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [techDraft, setTechDraft] = useState({
    name: "",
    detail: "",
    images: [] as string[],
  });

  const tabs = [
    { key: "traits" as const, label: "Đặc điểm sinh trưởng", count: stage.traits.length },
    { key: "tech" as const, label: "Kỹ thuật canh tác", count: stage.techs.length },
  ];

  const resetTraitDraft = () => {
    setTraitDraft({ part: PARTS[0], customPart: "", note: "", images: [] });
    setIsAddingTrait(false);
    setEditingTraitId(null);
  };

  const startEditingTrait = (trait: TraitRow) => {
    setTraitDraft({
      part: trait.part,
      customPart: PARTS.includes(trait.part) ? "" : trait.part,
      note: trait.note,
      images: trait.images ?? [],
    });
    setEditingTraitId(trait.id);
    setIsAddingTrait(true);
  };

  const saveTrait = () => {
    const resolvedPart =
      traitDraft.part === "Khác" ? traitDraft.customPart.trim() || "Khác" : traitDraft.part;

    if (!resolvedPart.trim()) return;

    if (editingTraitId) {
      onChange({
        traits: stage.traits.map((t) =>
          t.id === editingTraitId
            ? {
                ...t,
                part: resolvedPart.trim(),
                note: traitDraft.note.trim(),
                images: traitDraft.images,
              }
            : t,
        ),
      });
    } else {
      addTrait();
      return;
    }

    resetTraitDraft();
  };

  const addTrait = () => {
    const resolvedPart =
      traitDraft.part === "Khác" ? traitDraft.customPart.trim() || "Khác" : traitDraft.part;

    if (!resolvedPart.trim()) return;

    onChange({
      traits: [
        ...stage.traits,
        {
          id: uid(),
          part: resolvedPart.trim(),
          note: traitDraft.note.trim(),
          images: traitDraft.images,
        },
      ],
    });

    resetTraitDraft();
  };

  const resetTechDraft = () => {
    setTechDraft({ name: "", detail: "", images: [] });
    setIsAddingTech(false);
    setEditingTechId(null);
  };

  const startEditingTech = (tech: TechRow) => {
    setTechDraft({
      name: tech.name,
      detail: tech.detail,
      images: tech.images ?? [],
    });
    setEditingTechId(tech.id);
    setIsAddingTech(true);
  };

  const saveTech = () => {
    if (!techDraft.name.trim()) return;

    if (editingTechId) {
      onChange({
        techs: stage.techs.map((tech) =>
          tech.id === editingTechId
            ? {
                ...tech,
                name: techDraft.name.trim(),
                detail: techDraft.detail.trim(),
                images: techDraft.images,
              }
            : tech,
        ),
      });
    } else {
      onChange({
        techs: [
          ...stage.techs,
          {
            id: uid(),
            name: techDraft.name.trim(),
            detail: techDraft.detail.trim(),
            images: techDraft.images,
          },
        ],
      });
    }

    resetTechDraft();
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-card">
        <div className="w-full py-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  tab === t.key
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {t.label}
                {t.count > 0 ? (
                  <span className="rounded-full bg-primary-soft px-1.5 text-[11px] font-semibold text-primary">
                    {t.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="w-full pt-3">
            {tab === "traits" ? (
              <div className="flex flex-col gap-3">
                {stage.traits.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Chưa có đặc điểm sinh trưởng nào. Nhấn “Thêm đặc điểm” để tạo mới.
                  </p>
                ) : (
                  <div className="overflow-hidden bg-card">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-secondary/40">
                        <tr>
                          <th className="w-12 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            STT
                          </th>
                          <th className="w-32 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Hình ảnh
                          </th>
                          <th className="w-36 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Bộ phận
                          </th>
                          <th className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Mô tả đặc điểm
                          </th>
                          <th className="w-12 px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stage.traits.map((t, i) => (
                          <tr key={t.id} className="align-top">
                            <td className="px-3 py-3 text-sm">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {i + 1}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <TraitImagePreview images={t.images} label={t.part} />
                            </td>
                            <td className="px-3 py-3 text-sm">
                              <div className="px-2 py-1.5" title={t.part}>
                                {t.part}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="text-sm text-foreground min-h-9">{t.note}</div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Chỉnh sửa ${t.part}`}
                                  className="text-muted-foreground hover:text-primary"
                                  onClick={() => startEditingTrait(t)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Xóa ${t.part}`}
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    onChange({ traits: stage.traits.filter((x) => x.id !== t.id) })
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetTraitDraft();
                      setIsAddingTrait(true);
                    }}
                  >
                    <Plus className="size-4" /> Thêm đặc điểm
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "tech" ? (
              <div className="flex flex-col gap-3">
                {stage.techs.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Chưa có kỹ thuật canh tác nào. Nhấn “Thêm kỹ thuật” để tạo mới.
                  </p>
                ) : (
                  <div className="overflow-hidden bg-card">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-secondary/40">
                        <tr>
                          <th className="w-12 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            STT
                          </th>
                          <th className="w-32 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Hình ảnh
                          </th>
                          <th className="w-48 px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Tên kỹ thuật
                          </th>
                          <th className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                            Chi tiết
                          </th>
                          <th className="w-24 px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stage.techs.map((tech, index) => (
                          <tr key={tech.id} className="align-top">
                            <td className="px-3 py-3 text-sm">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {index + 1}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <TraitImagePreview images={tech.images} label={tech.name} />
                            </td>
                            <td className="px-3 py-3 text-sm font-medium">{tech.name}</td>
                            <td className="px-3 py-3 text-sm text-foreground">
                              {tech.detail || "—"}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Chỉnh sửa ${tech.name}`}
                                  className="text-muted-foreground hover:text-primary"
                                  onClick={() => startEditingTech(tech)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Xóa ${tech.name}`}
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    onChange({
                                      techs: stage.techs.filter((item) => item.id !== tech.id),
                                    })
                                  }
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetTechDraft();
                      setIsAddingTech(true);
                    }}
                  >
                    <Plus className="size-4" /> Thêm kỹ thuật
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <Dialog
          open={isAddingTrait}
          onOpenChange={(value) => {
            if (!value) resetTraitDraft();
            setIsAddingTrait(value);
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTraitId ? "Chỉnh sửa đặc điểm sinh trưởng" : "Thêm đặc điểm sinh trưởng"}
              </DialogTitle>
              <DialogDescription>
                Chọn bộ phận, mô tả đặc điểm và tải nhiều ảnh nếu cần.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="trait-part">Bộ phận</Label>
                <Select
                  value={traitDraft.part}
                  onValueChange={(value) => setTraitDraft((prev) => ({ ...prev, part: value }))}
                >
                  <SelectTrigger id="trait-part" className="w-full">
                    <SelectValue placeholder="Chọn bộ phận" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTS.map((part) => (
                      <SelectItem key={part} value={part}>
                        {part}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {traitDraft.part === "Khác" ? (
                  <Input
                    value={traitDraft.customPart}
                    placeholder="Nhập bộ phận khác"
                    onChange={(e) =>
                      setTraitDraft((prev) => ({ ...prev, customPart: e.target.value }))
                    }
                  />
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trait-note">Mô tả đặc điểm</Label>
                <CounterTextarea
                  id="trait-note"
                  value={traitDraft.note}
                  maxLength={500}
                  placeholder="Mô tả chi tiết đặc điểm sinh trưởng..."
                  onChange={(e) => setTraitDraft((prev) => ({ ...prev, note: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh</Label>
                <TraitImages
                  images={traitDraft.images}
                  label={
                    traitDraft.part === "Khác" ? traitDraft.customPart || "Khác" : traitDraft.part
                  }
                  onChange={(images) =>
                    setTraitDraft((prev) => ({ ...prev, images: images ?? [] }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={resetTraitDraft}>
                Hủy
              </Button>
              <Button
                type="button"
                onClick={saveTrait}
                disabled={
                  !(
                    (traitDraft.part === "Khác"
                      ? traitDraft.customPart.trim()
                      : traitDraft.part.trim()) &&
                    (traitDraft.note.trim() || traitDraft.images.length > 0)
                  )
                }
              >
                {editingTraitId ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAddingTech}
          onOpenChange={(value) => {
            if (!value) resetTechDraft();
            setIsAddingTech(value);
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTechId ? "Chỉnh sửa kỹ thuật canh tác" : "Thêm kỹ thuật canh tác"}
              </DialogTitle>
              <DialogDescription>
                Nhập tên kỹ thuật, nội dung chi tiết và tải nhiều ảnh nếu cần.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="tech-name">Tên kỹ thuật</Label>
                <Input
                  id="tech-name"
                  value={techDraft.name}
                  placeholder="VD: Bón lót"
                  onChange={(event) =>
                    setTechDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tech-detail">Chi tiết</Label>
                <CounterTextarea
                  id="tech-detail"
                  value={techDraft.detail}
                  maxLength={500}
                  placeholder="Mô tả cách thực hiện..."
                  onChange={(event) =>
                    setTechDraft((current) => ({ ...current, detail: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh</Label>
                <TraitImages
                  images={techDraft.images}
                  label={techDraft.name || "kỹ thuật canh tác"}
                  onChange={(images) =>
                    setTechDraft((current) => ({ ...current, images: images ?? [] }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={resetTechDraft}>
                Hủy
              </Button>
              <Button type="button" onClick={saveTech} disabled={!techDraft.name.trim()}>
                {editingTechId ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function StageListInner() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [economicLife, setEconomicLife] = useState<number | "">(25);
  const [economicLifeUnit, setEconomicLifeUnit] = useState<Unit>("year");
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [newStageData, setNewStageData] = useState({
    name: "",
    description: "",
    durationStart: "" as number | "",
    durationEnd: "" as number | "",
    unit: "day" as Unit,
  });

  useEffect(() => {
    setExtraStages(
      stages
        .filter((s) => s.name.trim() !== "")
        .map((s) => ({ id: s.id, name: s.name.trim(), description: s.description.trim() })),
    );
  }, [stages]);

  const update = (id: string, patch: Partial<Stage>) =>
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const resetStageDraft = () => {
    setNewStageData({
      name: "",
      description: "",
      durationStart: "",
      durationEnd: "",
      unit: "day",
    });
    setEditingStageId(null);
    setIsAddingStage(false);
  };

  const startEditingStage = (stage: Stage) => {
    setNewStageData({
      name: stage.name,
      description: stage.description,
      durationStart: stage.durationStart,
      durationEnd: stage.durationEnd,
      unit: stage.unit,
    });
    setEditingStageId(stage.id);
    setIsAddingStage(true);
  };

  const saveStage = () => {
    if (!newStageData.name.trim()) return;

    if (editingStageId) {
      update(editingStageId, {
        name: newStageData.name.trim(),
        description: newStageData.description.trim(),
        durationStart: newStageData.durationStart,
        durationEnd: newStageData.durationEnd,
        unit: newStageData.unit,
      });
    } else {
      setStages((prev) => [
        ...prev,
        {
          id: `s${Date.now()}`,
          name: newStageData.name.trim(),
          description: newStageData.description.trim(),
          durationStart: newStageData.durationStart,
          durationEnd: newStageData.durationEnd,
          unit: newStageData.unit,
          traits: [],
          techs: [],
        },
      ]);
    }

    resetStageDraft();
  };

  const remove = (id: string) => {
    setStages((prev) => prev.filter((s) => s.id !== id));
    setExpandedStageId((current) => (current === id ? null : current));
  };

  const total = stages.reduce((sum, s) => {
    const start = typeof s.durationStart === "number" ? s.durationStart : 0;
    const end = typeof s.durationEnd === "number" ? s.durationEnd : 0;
    return sum + ((start + end) / 2) * UNIT_DAYS[s.unit];
  }, 0);

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="grid gap-3 rounded-lg border border-border bg-primary-soft/40 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,180px)] md:items-end">
          <div className="min-w-0">
            <Label htmlFor="economic-life" className="text-xs">
              Tuổi kinh tế dự kiến (cố định)
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Giá trị cố định của giống, không được tính vào tổng chu kỳ giai đoạn.
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_110px] gap-3">
            <Input
              id="economic-life"
              type="number"
              min={0}
              value={economicLife}
              placeholder="0"
              onChange={(e) => setEconomicLife(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <Select value={economicLifeUnit} onValueChange={(v) => setEconomicLifeUnit(v as Unit)}>
              <SelectTrigger id="economic-life-unit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(UNIT_LABEL) as Unit[]).map((u) => (
                  <SelectItem key={u} value={u}>
                    {UNIT_LABEL[u]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {stages.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            Chưa có giai đoạn nào. Nhấn "Thêm giai đoạn" để bắt đầu.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/40">
                <tr>
                  <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    STT
                  </th>
                  <th className="min-w-32 px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Tên giai đoạn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Mô tả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Thời lượng dự kiến
                  </th>
                  <th className="w-20 px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Đơn vị
                  </th>
                  <th className="w-24 px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage, index) => (
                  <Fragment key={stage.id}>
                    <tr className="transition-colors hover:bg-secondary/20">
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{stage.name || "—"}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-sm text-muted-foreground">
                        {stage.description || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {stage.durationStart || stage.durationEnd ? (
                          <span>
                            {stage.durationStart || "?"} – {stage.durationEnd || "?"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {UNIT_LABEL[stage.unit]}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Chỉnh sửa ${stage.name}`}
                            className="size-8 text-muted-foreground hover:text-primary"
                            onClick={() => startEditingStage(stage)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Xóa"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => remove(stage.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td colSpan={6} className="p-0">
                        <button
                          type="button"
                          aria-expanded={expandedStageId === stage.id}
                          aria-label={
                            expandedStageId === stage.id
                              ? `Thu gọn chi tiết ${stage.name}`
                              : `Mở chi tiết ${stage.name}`
                          }
                          onClick={() =>
                            setExpandedStageId((current) =>
                              current === stage.id ? null : stage.id,
                            )
                          }
                          className="flex w-full items-center justify-center py-1.5 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-primary"
                        >
                          {expandedStageId === stage.id ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedStageId === stage.id && (
                      <tr className="bg-card">
                        <td colSpan={6} className="p-0">
                          <div className="w-full">
                            <StageTabs
                              stage={stage}
                              onChange={(patch) => update(stage.id, patch)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pt-1">
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            Tổng chu kỳ: <span className="font-semibold text-foreground">{total}</span> ngày (quy
            đổi) · {stages.length} giai đoạn
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetStageDraft();
              setIsAddingStage(true);
            }}
            className="shrink-0"
          >
            <Plus className="size-4" /> Thêm giai đoạn
          </Button>
        </div>

        <Dialog
          open={isAddingStage}
          onOpenChange={(value) => {
            if (!value) resetStageDraft();
            else setIsAddingStage(true);
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingStageId ? "Chỉnh sửa giai đoạn" : "Thêm giai đoạn mới"}
              </DialogTitle>
              <DialogDescription>
                Nhập các thông tin cơ bản về giai đoạn sinh trưởng
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="new-stage-name">Tên giai đoạn</Label>
                <Input
                  id="new-stage-name"
                  value={newStageData.name}
                  placeholder="VD: Ra hoa"
                  onChange={(e) => setNewStageData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-stage-description">Mô tả</Label>
                <Input
                  id="new-stage-description"
                  value={newStageData.description}
                  placeholder="Đặc điểm, lưu ý canh tác..."
                  onChange={(e) =>
                    setNewStageData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Thời lượng dự kiến</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={newStageData.durationStart}
                    placeholder="Bắt đầu"
                    onChange={(e) =>
                      setNewStageData((prev) => ({
                        ...prev,
                        durationStart: e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    min={0}
                    value={newStageData.durationEnd}
                    placeholder="Kết thúc"
                    onChange={(e) =>
                      setNewStageData((prev) => ({
                        ...prev,
                        durationEnd: e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-stage-unit">Đơn vị</Label>
                <Select
                  value={newStageData.unit}
                  onValueChange={(v) => setNewStageData((prev) => ({ ...prev, unit: v as Unit }))}
                >
                  <SelectTrigger id="new-stage-unit" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(UNIT_LABEL) as Unit[]).map((u) => (
                      <SelectItem key={u} value={u}>
                        {UNIT_LABEL[u]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={resetStageDraft}>
                Hủy
              </Button>
              <Button type="button" onClick={saveStage} disabled={!newStageData.name.trim()}>
                {editingStageId ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
