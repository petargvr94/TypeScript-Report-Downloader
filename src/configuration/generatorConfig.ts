/**
 * Represents configuration options for downloading a report.
 */
export interface DownloadConfig {
  /**
   * The name to use for the downloaded report file.
   */
  reportName: string;
}

/**
 * The default configuration options for downloading a report.
 * This object will be used if no configuration options are provided.
 */
export const defaultConfig: DownloadConfig = {
  reportName: "SwissQRBill.trdx",
};
