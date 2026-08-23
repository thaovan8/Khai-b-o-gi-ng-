import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StagePestCard, type StageData } from "@/components/variety/stage-pest-card";
import { useVarietyStages } from "@/lib/variety-stages";
import { useVarietyName } from "@/lib/variety-name";

export const Route = createFileRoute("/dich-hai")({
  head: () => ({
    meta: [
      { title: "Hồ sơ Dịch hại theo giai đoạn – Giống cây" },
      {
        name: "description",
        content:
          "Khai báo bệnh hại và sâu hại theo từng giai đoạn sinh trưởng: gợi ý AI, mức nhạy cảm, dấu hiệu nhận biết và ảnh triệu chứng.",
      },
      { property: "og:title", content: "Hồ sơ Dịch hại theo giai đoạn – Giống cây" },
      {
        property: "og:description",
        content: "Mỗi giai đoạn một thẻ riêng: danh mục bệnh hại và sâu hại, thêm/xóa thủ công.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PestProfilePage,
});

const steps = [
  "Thông tin Định danh",
  "Sinh trưởng & Hình thái",
  "Ngưỡng Môi trường",
  "Định mức Dinh dưỡng đất",
  "Hồ sơ Dịch hại",
];

const diseaseCatalog = [
  { value: "heo-xanh", name: "Héo xanh" },
  { value: "gi-sat", name: "Gỉ sắt" },
  { value: "thoi-re", name: "Thối rễ" },
  { value: "suong-mai", name: "Sương mai" },
  { value: "than-thu", name: "Thán thư" },
  { value: "kham-la", name: "Khảm lá" },
];

const pestCatalog = [
  { value: "rep-sap", name: "Rệp sáp" },
  { value: "bo-tri", name: "Bọ trĩ" },
  { value: "nhen-do", name: "Nhện đỏ" },
  { value: "sau-duc-than", name: "Sâu đục thân" },
  { value: "ruoi-vang", name: "Ruồi vàng" },
  { value: "tuyen-trung", name: "Tuyến trùng" },
];

const emptyStage: StageData = { diseases: [], pests: [] };

function PestProfilePage() {
  const current = 4;
  const stageList = useVarietyStages();
  const varietyName = useVarietyName();
  const [data, setData] = useState<Record<string, StageData>>({});

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <h1 className="text-lg font-bold text-foreground">Chỉnh sửa Giống cây</h1>
        <p className="text-xs text-muted-foreground">Thiết lập dữ liệu nền</p>
      </header>

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-8">
        <nav
          aria-label="Các bước khai báo"
          className="flex gap-4 overflow-x-auto rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]"
        >
          {steps.map((label, i) => (
            <div key={label} className="flex shrink-0 items-center gap-2">
              <span
                className={
                  i <= current
                    ? "grid size-6 shrink-0 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground"
                    : "grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground"
                }
              >
                {i + 1}
              </span>
              <span
                className={
                  i === current
                    ? "text-sm font-semibold text-foreground"
                    : "text-sm text-muted-foreground"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </nav>

        {stageList.map((stage, i) => (
          <StagePestCard
            key={stage.id}
            index={i}
            stage={stage}
            varietyName={varietyName}
            diseaseCatalog={diseaseCatalog}
            pestCatalog={pestCatalog}
            value={data[stage.id] ?? emptyStage}
            onChange={(next) => setData((prev) => ({ ...prev, [stage.id]: next }))}
          />
        ))}

        <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 text-sm font-semibold text-card-foreground">Ghi chú bổ sung chung</h2>
          <Textarea
            rows={4}
            placeholder="Các thông tin bổ sung về dịch hại, biện pháp phòng trừ đặc biệt..."
          />
        </section>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
          <Button variant="ghost" className="justify-self-start">
            <X className="size-4" /> Hủy
          </Button>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" asChild>
              <Link to="/dinh-duong">
                <ChevronLeft className="size-4" /> Quay lại
              </Link>
            </Button>
            <Button>
              <Check className="size-4" /> Hoàn tất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
