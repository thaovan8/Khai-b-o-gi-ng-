import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RangeField } from "@/components/variety/range-field";
import { StageExpand } from "@/components/variety/stage-expand";

function MoistureBlock({ id, showAuto = true }: { id: string; showAuto?: boolean }) {
  const [range, setRange] = useState<[number, number]>([40, 80]);
  const [optimal, setOptimal] = useState<[number, number]>([55, 70]);

  return (
    <div className="space-y-4">
      <RangeField label="Khoảng cho phép" value={range} onChange={setRange} min={0} max={100} step={1} unit="%" hideInputs />
      <RangeField label="Vùng tối ưu" value={optimal} onChange={setOptimal} min={0} max={100} step={1} unit="%" hideInputs />

      {showAuto ? (
        <div className="flex items-center gap-2">
          <Checkbox id={`auto-irrigation-${id}`} />
          <Label htmlFor={`auto-irrigation-${id}`} className="text-sm font-normal">
            Kích hoạt tưới tự động khi dưới ngưỡng tối ưu
          </Label>
        </div>
      ) : null}
    </div>
  );
}

export function SoilMoisture() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-foreground">Độ ẩm đất thông thường</p>
      <div className="rounded-lg bg-secondary/40 p-4">
        <MoistureBlock id="normal" />
      </div>
      <StageExpand
        label="Mở rộng theo giai đoạn"
        renderStage={(s) => <MoistureBlock id={`moisture-${s.id}`} showAuto={false} />}
      />
    </div>
  );
}
