import { DownloadConfig } from "./configuration/generatorConfig";
import { TelerikAPI } from "./api/telerik.api";
import { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

/**
 * Downloads a report using the Telerik Reporting API.
 * @param config - Configuration options for downloading the report.
 * @returns A Promise that resolves when the report has been downloaded.
 */
export async function downloadReportUsingTelerikAPI(
  config: DownloadConfig
): Promise<void> {
  try {
    const api = new TelerikAPI();
    const { clientId } = await api.registerClient();
    const uniqueId = uuidv4();
    const fileName = `${config.reportName}_${uniqueId}.pdf`;
    console.log("Registered client ID:", clientId);

    try {
      await api.keepClientAlive(clientId);
    } catch (error: unknown) {
      console.error("Failed to keep client alive:", (error as Error).message);
    }
    const { instanceId } = await api.resolveReportInstance(
      clientId,
      config.reportName
    );
    console.log(instanceId);
    const { documentId } = await api.resolveDocument(clientId, instanceId);

    try {
      await api.keepClientAlive(clientId);
    } catch (error: unknown) {
      console.error("Failed to keep client alive:", (error as Error).message);
    }

    await api.downloadReport(clientId, instanceId, documentId, fileName);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error:", error.response?.data ?? error.message);
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new Error("Failed to download report");
  }
}
