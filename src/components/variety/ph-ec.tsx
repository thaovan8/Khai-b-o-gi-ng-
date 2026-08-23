import { useState } from "react";
import { RangeField } from "@/components/variety/range-field";

export function PhEc() {
  const [ph, setPh] = useState<[number, number]>([5.5, 7]);
  const [ec, setEc] = useState<[number, number]>([0.5, 1.5]);

  return (
    <div className="space-y-6">
      <RangeField label="Độ pH lý tưởng" value={ph} onChange={setPh} min={3} max={10} step={0.1} hideInputs />
      <RangeField
        label="Độ dẫn điện EC (mS/cm)"
        value={ec}
        onChange={setEc}
        min={0}
        max={5}
        step={0.1}
        unit="mS/cm"
        hideInputs
      />
    </div>
  );
}
