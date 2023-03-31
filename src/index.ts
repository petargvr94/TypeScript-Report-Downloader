// index.ts
import { defaultConfig } from "./configuration/generatorConfig";
import { downloadReportUsingTelerikAPI } from "./downloadReport";

(async () => {
  await downloadReportUsingTelerikAPI(defaultConfig);
})();
