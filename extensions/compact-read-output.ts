import {
  createReadToolDefinition,
  keyHint,
  type ExtensionAPI,
  type ReadToolDetails,
} from "@mariozechner/pi-coding-agent";
import { Text } from "@mariozechner/pi-tui";

type ToolContent = {
  type: string;
  text?: string;
  data?: string;
  mimeType?: string;
};

type ReadResult = {
  content?: ToolContent[];
  details?: ReadToolDetails;
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export default function (pi: ExtensionAPI) {
  const builtinRead = createReadToolDefinition(process.cwd());

  pi.registerTool({
    ...builtinRead,

    renderResult(result, options, theme, context) {
      if (options.expanded || context.isError || !builtinRead.renderResult) {
        return builtinRead.renderResult?.(result, options, theme, context) ?? new Text("", 0, 0);
      }

      const typedResult = result as ReadResult;
      const content = typedResult.content ?? [];
      const textParts = content
        .filter((item) => item.type === "text")
        .map((item) => item.text ?? "");
      const combinedText = textParts.join("\n");
      const hasImage = content.some((item) => item.type === "image");
      const truncation = typedResult.details?.truncation;

      let summary = theme.fg("success", "✓ Read");

      if (hasImage) {
        const firstLine = combinedText.split("\n").find((line) => line.trim().length > 0);
        summary += " " + theme.fg("toolOutput", firstLine ?? "image file");
      } else {
        const visibleLines = combinedText.length === 0 ? 0 : combinedText.split("\n").length;
        const totalLines = truncation?.truncated ? truncation.totalLines : visibleLines;
        summary +=
          " " +
          theme.fg("toolOutput", `${totalLines} ${pluralize(totalLines, "line")} loaded`);
      }

      if (truncation?.truncated) {
        summary +=
          " " +
          theme.fg(
            "warning",
            `[showing ${truncation.outputLines} of ${truncation.totalLines} ${pluralize(truncation.totalLines, "line")}]`,
          );
      }

      summary += ` ${theme.fg("muted", `(${keyHint("app.tools.expand", "to expand")})`)}`;

      const text = (context.lastComponent as Text | undefined) ?? new Text("", 0, 0);
      text.setText(summary);
      return text;
    },
  });
}
