import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const groups = [
  {
    label: "Môi trường kiểm soát",
    items: [
      { value: "greenhouse", name: "Nhà kính", desc: "Kiểm soát nhiệt độ, ánh sáng, độ ẩm" },
      { value: "shade-net", name: "Nhà màng / Lưới", desc: "Che nắng, chắn côn trùng" },
      { value: "indoor", name: "Canh tác trong nhà", desc: "Đèn LED, giá kệ nhiều tầng" },
    ],
  },
  {
    label: "Canh tác trên đất",
    items: [
      {
        value: "open-field",
        name: "Canh tác truyền thống ngoài trời",
        desc: "Trồng trực tiếp trên đất, phụ thuộc thời tiết",
      },
      {
        value: "organic",
        name: "Canh tác hữu cơ",
        desc: "Không dùng phân/thuốc hóa học tổng hợp",
      },
      { value: "raised-bed", name: "Luống cao", desc: "Đất được vun cao thoát nước tốt hơn" },
      { value: "paddy", name: "Ruộng nước / Lúa nước", desc: "Ngập nước theo giai đoạn sinh trưởng" },
      { value: "terrace", name: "Bậc thang", desc: "Canh tác trên đất dốc, đồi núi" },
      {
        value: "agroforestry",
        name: "Nông lâm kết hợp",
        desc: "Trồng xen cây lâu năm với cây rừng/cây che bóng",
      },
      {
        value: "intercropping",
        name: "Xen canh / Luân canh",
        desc: "Trồng xen hoặc đổi vụ nhiều loại cây trên cùng diện tích",
      },
    ],
  },
];

export function CultivationModel() {
  return (
    <Select>
      <SelectTrigger className="w-full" aria-label="Mô hình trồng">
        <SelectValue placeholder="Chọn mô hình trồng" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {groups.map((g) => (
          <SelectGroup key={g.label}>
            <SelectLabel>{g.label}</SelectLabel>
            {g.items.map((it) => (
              <SelectItem key={it.value} value={it.value}>
                <span className="font-medium">{it.name}</span>
                <span className="text-muted-foreground"> — {it.desc}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}