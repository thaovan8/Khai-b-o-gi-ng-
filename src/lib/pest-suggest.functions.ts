import { createServerFn } from "@tanstack/react-start";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const Input = z.object({
  varietyName: z.string(),
  stageName: z.string(),
});

const Suggestion = z.object({
  name: z.string(),
  level: z.enum(["high", "medium", "low"]),
  note: z.string(),
});

const Schema = z.object({
  diseases: z.array(Suggestion),
  pests: z.array(Suggestion),
});

export type PestSuggestion = z.infer<typeof Suggestion>;
export type PestSuggestions = z.infer<typeof Schema>;

const empty: PestSuggestions = { diseases: [], pests: [] };

export const suggestPests = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<PestSuggestions> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Thiếu cấu hình AI");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = [
      `Giống cây trồng: "${data.varietyName || "chưa xác định"}".`,
      `Giai đoạn sinh trưởng: "${data.stageName}".`,
      "Liệt kê đúng 5 loại BỆNH HẠI và đúng 5 loại SÂU HẠI phổ biến nhất thường gặp ở giống cây này trong giai đoạn trên tại Việt Nam.",
      "Tên bằng tiếng Việt, không kèm tên khoa học/tiếng Anh.",
      "level = mức độ nhạy cảm (high/medium/low). note = dấu hiệu nhận biết ngắn gọn, tối đa 120 ký tự.",
    ].join("\n");

    try {
      const result = streamText({
        model: gateway("google/gemini-3.6-flash"),
        prompt,
        output: Output.object({ schema: Schema }),
      });
      const output = await result.output;
      return {
        diseases: output.diseases.slice(0, 5),
        pests: output.pests.slice(0, 5),
      };
    } catch (error) {
      console.error("suggestPests failed", error);
      if (NoObjectGeneratedError.isInstance(error)) return empty;
      throw error;
    }
  });