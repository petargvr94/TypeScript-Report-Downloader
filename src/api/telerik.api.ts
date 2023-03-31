import axios, { AxiosError } from "axios";
import fs from "fs";
import {
  ClientResponse,
  InstanceResponse,
  DocumentResponse,
} from "../interfaces";

/**
 * Represents a class for interacting with the Telerik Reporting API.
 */
export class TelerikAPI {
  /**
   * The base URL for the Telerik Reporting API.
   */
  private static readonly API_URL =
    "https://demos.telerik.com/reporting/api/reports/";

  /**
   * Registers a new client with the Telerik Reporting API.
   * @returns A Promise that resolves to a ClientResponse object representing the registered client.
   */
  public async registerClient(): Promise<ClientResponse> {
    const { data } = await axios.post<ClientResponse>(
      `${TelerikAPI.API_URL}clients`
    );
    return data;
  }

  /**
   * Resolves a report instance for a given client and report name.
   * @param clientId - The unique identifier for the client.
   * @param reportName - The name of the report to resolve an instance for.
   * @returns A Promise that resolves to an InstanceResponse object representing the resolved instance.
   * @throws An AxiosError if the instance cannot be resolved.
   */
  public async resolveReportInstance(
    clientId: string,
    reportName: string
  ): Promise<InstanceResponse> {
    try {
      const { data } = await axios.post<InstanceResponse>(
        `${TelerikAPI.API_URL}clients/${clientId}/instances`,
        {
          report: reportName,
        }
      );
      return data;
    } catch (error: unknown) {
      console.error(
        `Error resolving report instance for ${reportName}:`,
        error
      );
      throw new Error(`Failed to resolve report instance: ${error}`);
    }
  }

  /**
   * Resolves a document for a given client and instance.
   * @param clientId - The unique identifier for the client.
   * @param instanceId - The unique identifier for the instance.
   * @returns A Promise that resolves to a DocumentResponse object representing the resolved document.
   * @throws An AxiosError if the document cannot be resolved.
   */
  public async resolveDocument(
    clientId: string,
    instanceId: string
  ): Promise<DocumentResponse> {
    try {
      const { data } = await axios.post<DocumentResponse>(
        `${TelerikAPI.API_URL}clients/${clientId}/instances/${instanceId}/documents`,
        {
          format: "PDF",
        }
      );
      return data;
    } catch (error: unknown) {
      console.error(
        `Error resolving document for instance ${instanceId}:`,
        error
      );
      throw new Error(`Failed to resolve document instance: ${error}`);
    }
  }

  /**
   * Extends the expiration time for a given client.
   * @param clientId - The unique identifier for the client.
   * @throws An AxiosError if the client cannot be kept alive.
   */
  public async keepClientAlive(clientId: string): Promise<void> {
    try {
      console.log("Passing client id", clientId);
      await axios.post(`${TelerikAPI.API_URL}clients/keepAlive/${clientId}`);
      console.log("Client expiration extended");
    } catch (error: unknown) {
      console.error("Error in keepClientAlive:", error);
      throw new Error(`Failed to keep client alive: ${error}`);
    }
  }

  /**
   * Downloads a report for a given client, instance, and document.
   * @param clientId - The unique identifier for the client.
   * @param instanceId - The unique identifier for the instance.
   * @param documentId - The unique identifier for the document.
   * @param reportName - The report name.
   */

  public async downloadReport(
    clientId: string,
    instanceId: string,
    documentId: string,
    reportName: string
  ): Promise<void> {
    try {
      const response = await axios.get<ArrayBuffer>(
        `${TelerikAPI.API_URL}clients/${clientId}/instances/${instanceId}/documents/${documentId}`,
        { responseType: "arraybuffer" }
      );

      // Save the file as pdf
      fs.writeFile(
        `${reportName}.pdf`,
        Buffer.from(response.data),
        { encoding: "binary" },
        function (error) {
          if (error) {
            console.error("Error:", error.message);
          } else {
            console.log(`${reportName} downloaded successfully.`);
          }
        }
      );
    } catch (error) {
      console.error("Error:", (error as AxiosError).message);
    }
  }
}
