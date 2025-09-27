import fs from "node:fs";
import path from "node:path";
import { JSDOM, ResourceLoader } from "jsdom";
import { describe, expect, it } from "vitest";

import { defaultFormValues } from "@/lib/default-values";
import { renderNarrative } from "@/lib/renderNarrative";

class LocalResourceLoader extends ResourceLoader {
  constructor(private readonly root: string) {
    super();
  }

  fetch(url: string) {
    if (url.startsWith("http://legacy.local/")) {
      const relative = url.replace("http://legacy.local/", "");
      const filePath = path.join(this.root, relative);
      if (fs.existsSync(filePath)) {
        return Promise.resolve(fs.readFileSync(filePath));
      }
    }
    return Promise.resolve(Buffer.from(""));
  }
}

async function buildLegacySoapReport(chiefComplaint: string): Promise<string> {
  const rootDir = path.resolve(__dirname, "../../..", "soapcr.com");
  const dom = await JSDOM.fromFile(path.join(rootDir, "index.html"), {
    runScripts: "dangerously",
    resources: new LocalResourceLoader(rootDir),
    pretendToBeVisual: true,
    url: "http://legacy.local/index.html"
  });

  await new Promise((resolve) =>
    dom.window.addEventListener("load", () => setTimeout(resolve, 50))
  );

  const $ = (dom.window as unknown as { $: any }).$;
  if (!$) {
    throw new Error("Legacy jQuery failed to load");
  }

  $("input[type='text'], input[type='number'], input[type='time'], textarea").val("");
  $("input[type='checkbox'], input[type='radio']").prop("checked", false);
  $("select").val("");

  $("#txtChiefComplaint").val(chiefComplaint);
  dom.window.writepcr();

  const report = dom.window.PCReport as string;
  dom.window.close();
  return report;
}

function extractSoapSection(report: string): string {
  const lines = report.split("\n");
  const start = lines.findIndex((line) => line.startsWith("S:"));
  if (start === -1) {
    return "";
  }
  const soapLines: string[] = [];
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    soapLines.push(line.trimEnd());
    if (line.startsWith("P:")) {
      break;
    }
  }
  return soapLines.join("\n\n");
}

describe("legacy SOAP parity", () => {
  it("matches the legacy subjective narrative", async () => {
    const legacyReport = await buildLegacySoapReport("Chest pain");
    const legacySoap = extractSoapSection(legacyReport);

    const modernReport = renderNarrative({
      ...defaultFormValues,
      subjective: {
        ...defaultFormValues.subjective,
        chiefComplaint: "Chest pain"
      }
    });

    expect(modernReport.split("\n\n")[0]).toEqual(legacySoap.split("\n\n")[0]);
  });
});
