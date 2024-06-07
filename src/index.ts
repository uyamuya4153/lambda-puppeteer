import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const handler = async (_event: any) => {
  // create screenshot image
  const file = await fetchData();

  // upload file to S3
  await uploadFileToS3(file);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

/**
 * Fetches data from a web page using Puppeteer.
 * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the screenshot of the web page.
 */
const fetchData = async () => {
  console.log(1);
  const executablePath =
    process.env.CHROMIUM_EXECUTABLE_PATH ?? (await chromium.executablePath());
  console.log(2);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto("https://example.com");

  page.setViewport({
    width: 1200,
    height: 630,
  });

  // take a screenshot
  const file = await page.screenshot();

  browser.close();

  return file;
};

/**
 * Uploads a file to Amazon S3.
 * @param file - The file to be uploaded as a Buffer.
 * @returns A Promise that resolves when the file is successfully uploaded.
 */
const uploadFileToS3 = async (file: Buffer) => {
  const now = new Date();
  const region = "ap-northeast-1";
  const client = new S3Client({ region });
  const command = new PutObjectCommand({
    Body: file,
    Bucket: "sportsnet-screenshot",
    Key: `${now.getFullYear()}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}.png`,
  });

  await client.send(command);
};
