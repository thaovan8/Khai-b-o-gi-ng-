import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/variety/section-card";
import { NutritionPlan } from "@/components/variety/nutrition-plan";
import { FeedingMethod } from "@/components/variety/feeding-method";

export const Route = createFileRoute("/dinh-duong")({
  head: () => ({
    meta: [
      { title: "Định mức Dinh dưỡng đất – Giống cây" },
      {
        name: "description",
        content:
          "Khai báo định mức dinh dưỡng theo giai đoạn: lượng NPK, trung lượng, vi lượng và mục tiêu vụ tự tính tổng.",
      },
      { property: "og:title", content: "Định mức Dinh dưỡng – Giống cây" },
      {
        property: "og:description",
        content: "Chỉnh sửa định mức dinh dưỡng đất theo giai đoạn: NPK, trung lượng, vi lượng và ngưỡng đất.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NutritionPage,
});

const steps = [
  "Thông tin Định danh",
  "Sinh trưởng & Hình thái",
  "Ngưỡng Môi trường",
  "Định mức Dinh dưỡng đất",
  "Hồ sơ Dịch hại",
];

function NutritionPage() {
  const current = 3;

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

        <NutritionPlan />

        <SectionCard
          icon={<Leaf className="size-4" />}
          title="Phương thức bón phân"
          subtitle="Chọn cách cung cấp dinh dưỡng cho cây"
          noDivider
        >
          <FeedingMethod />
        </SectionCard>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
          <Button variant="ghost" className="justify-self-start">
            <X className="size-4" /> Hủy
          </Button>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" asChild>
              <Link to="/moi-truong">
                <ChevronLeft className="size-4" /> Quay lại
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dich-hai">
                Tiếp theo <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
