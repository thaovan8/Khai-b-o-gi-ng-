import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Sprout, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/variety/section-card";
import { StageList } from "@/components/variety/stage-list";
import { RootSystem } from "@/components/variety/root-system";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Khai báo Giống cây" },
      {
        name: "description",
        content:
          "Khai báo giống cây: giai đoạn sinh trưởng động, lưới mùa vụ 12 tháng và cấu hình hệ thống rễ theo tầng đất.",
      },
      { property: "og:title", content: "Khai báo Giống cây" },
      {
        property: "og:description",
        content:
          "Cấu hình giai đoạn sinh trưởng, mùa vụ chính/trái vụ và hệ thống rễ cho từng giống cây.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  "Thông tin Định danh",
  "Sinh trưởng & Hình thái",
  "Ngưỡng Môi trường",
  "Định mức Dinh dưỡng đất",
  "Hồ sơ Dịch hại",
];

function Index() {
  const current = 1;

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
          icon={<Timer className="size-4" />}
          title="Giai đoạn Sinh trưởng"
          subtitle="Tuổi kinh tế cố định · giai đoạn tính theo ngày/tháng/năm"
        >
          <StageList />
        </SectionCard>

        <SectionCard
          icon={<Sprout className="size-4" />}
          title="Hệ thống rễ chính"
          subtitle="Loại rễ, tầng đất hút dinh dưỡng và khoảng độ sâu"
        >
          <RootSystem />
        </SectionCard>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
          <Button variant="ghost" className="justify-self-start">
            <X className="size-4" /> Hủy
          </Button>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline">
              <ChevronLeft className="size-4" /> Quay lại
            </Button>
            <Button asChild>
              <Link to="/moi-truong">
                Tiếp theo <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
