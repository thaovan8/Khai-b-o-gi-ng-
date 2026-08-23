import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StageExpand } from "@/components/variety/stage-expand";

function Row({ label, id }: { label: string; id: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      <Label htmlFor={`${id}-min`} className="min-w-0">
        {label}
      </Label>
      <Input id={`${id}-min`} placeholder="Tối thiểu" inputMode="decimal" />
      <Input id={`${id}-max`} placeholder="Tối đa" inputMode="decimal" />
    </div>
  );
}

function Block({ id }: { id: string }) {
  return (
    <div className="space-y-4">
      <Row label="Nhiệt độ (°C)" id={`temp-${id}`} />
      <Row label="Độ ẩm không khí (%)" id={`humidity-${id}`} />
    </div>
  );
}

export function AirClimate() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-foreground">Thông thường</p>
      <div className="rounded-lg bg-secondary/40 p-4">
        <Block id="normal" />
      </div>
      <StageExpand label="Mở rộng theo giai đoạn" renderStage={(s) => <Block id={s.id} />} />
    </div>
  );
}
