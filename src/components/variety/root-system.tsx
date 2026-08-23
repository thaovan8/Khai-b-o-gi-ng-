import { useState } from "react";
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ROOT_TYPES = [
  {
    value: "taproot",
    label: "Rễ cọc",
    description:
      "Rễ chính phát triển mạnh từ rễ mầm, đâm sâu xuống đất, ít rễ phụ lớn ở tầng nông.",
  },
  {
    value: "fibrous",
    label: "Rễ chùm",
    description:
      "Không có rễ chính, gồm nhiều rễ con mọc từ gốc có kích thước tương đương nhau, tập trung nông.",
  },
  {
    value: "lateral",
    label: "Rễ bàng / Rễ lan ngang",
    description:
      "Rễ chính không quá trội hoặc chuyển hướng phát triển lan rộng sang ngang, biên độ rộng hơn cả tán lá.",
  },
  {
    value: "tuber",
    label: "Rễ củ",
    description: "Biến dạng phình to để tích trữ chất dinh dưỡng.",
  },
  {
    value: "clinging",
    label: "Rễ bám",
    description: "Mọc từ thân trên mặt đất giúp bám hoặc hút ẩm không khí.",
  },
];

const SOIL_LAYERS = [
  {
    value: "shallow",
    name: "Rễ nông (0 - 30 cm)",
  },
  {
    value: "medium",
    name: "Rễ trung bình (30 - 60 cm)",
  },
  {
    value: "deep",
    name: "Rễ sâu (60 - 120 cm)",
  },
  {
    value: "very-deep",
    name: "Rễ rất sâu (> 120 cm)",
  },
];

const PHYSIOLOGICAL_TRAITS = [
  {
    value: "waterlogging-sensitive",
    label: "Mẫn cảm cao với ngập úng (Dễ thối rễ)",
    description: "Rễ cần độ thông khí cao, ngập nước ngắn hạn dễ gây ngạt và nấm bệnh tấn công.",
  },
  {
    value: "waterlogging-moderate",
    label: "Chịu ngập úng trung bình",
    description:
      "Có thể thích nghi với điều kiện ẩm ướt hoặc ngập nước tạm thời trong giai đoạn sinh trưởng.",
  },
  {
    value: "drought-tolerant",
    label: "Chịu hạn tốt nhờ rễ sâu",
    description: "Khả năng tìm kiếm nguồn nước ngầm hoặc ẩm từ tầng sâu khi tầng mặt khô hạn.",
  },
  {
    value: "compaction-sensitive",
    label: "Nhạy cảm với đất nén chặt",
    description:
      "Rễ kém phát triển nếu tầng đất bên dưới bị nén dẽ, chai cứng, cần đất tơi xốp thoáng khí.",
  },
];

export function RootSystem() {
  const [layer, setLayer] = useState("shallow");
  const [physiologicalTraits, setPhysiologicalTraits] = useState<string[]>([]);

  return (
    <TooltipProvider>
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="root-type">Loại rễ</Label>
            <Select defaultValue="fibrous">
              <SelectTrigger id="root-type" className="w-full">
                <SelectValue placeholder="Chọn loại rễ" />
              </SelectTrigger>
              <SelectContent>
                {ROOT_TYPES.map((rootType) => (
                  <Tooltip key={rootType.value}>
                    <TooltipTrigger asChild>
                      <SelectItem value={rootType.value}>{rootType.label}</SelectItem>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-muted text-muted-foreground">
                      <p>{rootType.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 space-y-1.5">
            <Label htmlFor="soil-layer">Tầng rễ hoạt động chính</Label>
            <Select value={layer} onValueChange={setLayer}>
              <SelectTrigger id="soil-layer" className="w-full">
                <SelectValue placeholder="Chọn tầng rễ" />
              </SelectTrigger>
              <SelectContent>
                {SOIL_LAYERS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Đặc tính sinh lý & Khả năng chịu đựng
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Có thể chọn nhiều đặc tính phù hợp với hệ thống rễ.
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {PHYSIOLOGICAL_TRAITS.map((trait) => {
              const checked = physiologicalTraits.includes(trait.value);
              return (
                <label
                  key={trait.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg bg-secondary/40 p-3 transition-colors hover:bg-secondary/70"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      setPhysiologicalTraits((current) =>
                        value
                          ? [...current, trait.value]
                          : current.filter((item) => item !== trait.value),
                      )
                    }
                    aria-label={trait.label}
                    className="mt-0.5"
                  />
                  <span className="flex min-w-0 flex-1 items-start gap-1.5 text-sm font-medium">
                    <span>{trait.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Giải thích ${trait.label}`}
                          className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary"
                          onClick={(event) => event.preventDefault()}
                        >
                          <Info className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{trait.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
