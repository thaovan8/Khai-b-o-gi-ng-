import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sparkles, Sprout, Table2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/variety/section-card";
import { CultivationModel } from "@/components/variety/cultivation-model";
import { EnvironmentMatrix, type EnvironmentFilter } from "@/components/variety/environment-matrix";

export const Route = createFileRoute("/moi-truong")({
  head: () => ({
    meta: [
      { title: "Ngưỡng Môi trường – Giống cây" },
      {
        name: "description",
        content:
          "Thiết lập ngưỡng môi trường cho giống cây: mô hình trồng, độ ẩm đất, nhiệt độ, độ pH, EC, ánh sáng và gió.",
      },
      { property: "og:title", content: "Ngưỡng Môi trường – Giống cây" },
      {
        property: "og:description",
        content: "Cấu hình mô hình trồng và các ngưỡng môi trường tối ưu cho từng giống cây.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnvironmentThresholds,
});

const steps = [
  "Thông tin Định danh",
  "Sinh trưởng & Hình thái",
  "Ngưỡng Môi trường",
  "Định mức Dinh dưỡng đất",
  "Hồ sơ Dịch hại",
];

function EnvironmentThresholds() {
  const current = 2;
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>("all");

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

        <SectionCard
          noDivider
          icon={<Sprout className="size-4" />}
          title="Mô hình trồng"
          subtitle="Chọn mô hình canh tác áp dụng cho giống cây"
        >
          <CultivationModel />
        </SectionCard>

        <SectionCard
          noDivider
          icon={<Table2 className="size-4" />}
          title="Bảng ngưỡng môi trường"
          subtitle="Khai báo khoảng tối thiểu–tối ưu cho từng chỉ số theo giai đoạn"
          action={
            <div className="flex items-center gap-2">
              <Select
                value={environmentFilter}
                onValueChange={(value) => setEnvironmentFilter(value as EnvironmentFilter)}
              >
                <SelectTrigger className="w-[180px]" aria-label="Lọc nhóm môi trường">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="soil">Môi trường đất</SelectItem>
                  <SelectItem value="air">Không khí</SelectItem>
                  <SelectItem value="water">Môi trường nước</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" className="bg-violet-600 text-white hover:bg-violet-700">
                <Sparkles className="size-4" /> Gợi ý của AI
              </Button>
            </div>
          }
        >
          <EnvironmentMatrix category={environmentFilter} />
        </SectionCard>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
          <Button variant="ghost" className="justify-self-start">
            <X className="size-4" /> Hủy
          </Button>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <ChevronLeft className="size-4" /> Quay lại
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dinh-duong">
                Tiếp theo <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
