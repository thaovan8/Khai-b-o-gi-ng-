import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LightWind() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Cường độ ánh sáng (Lux)</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-0 space-y-1.5">
            <span className="text-xs text-muted-foreground">Tối đa giai đoạn kiến thiết cơ bản</span>
            <Input placeholder="15000" inputMode="numeric" aria-label="Ánh sáng tối đa giai đoạn kiến thiết cơ bản" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <span className="text-xs text-muted-foreground">Tối đa giai đoạn kinh doanh</span>
            <Input placeholder="40000" inputMode="numeric" aria-label="Ánh sáng tối đa giai đoạn kinh doanh" />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wind">Tốc độ gió (km/h)</Label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <Input id="wind" placeholder="25" inputMode="numeric" />
          <span className="grid shrink-0 place-items-center rounded-md border border-warning/40 bg-warning/10 px-3 text-xs font-semibold text-warning">
            Cảnh báo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="shade-required" />
        <Label htmlFor="shade-required" className="text-sm font-normal">
          Yêu cầu cây che bóng giai đoạn kiến thiết cơ bản
        </Label>
      </div>
    </div>
  );
}