import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import chromium from '@sparticuz/chromium';
import playwright from 'playwright-core';

export const handler = async (_event: any) => {
  await fetchData();

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
  console.log(`CHROMIUM_EXECUTABLE_PATH: ${process.env.CHROMIUM_EXECUTABLE_PATH}`);
  console.log(`await chromium.executablePath(): ${await chromium.executablePath()}`);
  const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH ?? (await chromium.executablePath());
  console.log(2345);

  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: executablePath,
    headless: false,
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = tomorrow.getDate().toString().padStart(2, '0');
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][tomorrow.getDay()];

  const page = await browser.newPage();
  await page.goto('https://sv05.city.toyama.toyama.jp/tymyusr/usr');
  await page.getByRole('link', { name: '空き状況の確認' }).click();
  await page.getByRole('row', { name: 'テニス 選 択 バスケットボール 選 択', exact: true }).getByRole('link').first().click();
  await page.getByRole('row', { name: '東富山運動広場庭球場 人工芝コート 選 択', exact: true }).getByRole('link').click();
  await page.getByRole('link', { name: `${day} (${dayOfWeek}) 選択` }).click();
  await page.locator('input[name="ui"]').fill('20004676');
  await page.locator('input[name="pw"]').fill('4153');
  await page.getByRole('link', { name: 'ログイン' }).click();
  await page.waitForTimeout(1000);

  const file = await page.screenshot();
  await uploadFileToS3(file);

  browser.close();

  return;
};

/**
 * Uploads a file to Amazon S3.
 * @param file - The file to be uploaded as a Buffer.
 * @returns A Promise that resolves when the file is successfully uploaded.
 */
const uploadFileToS3 = async (file: Buffer) => {
  const now = new Date();
  const region = 'ap-northeast-1';
  const client = new S3Client({ region });
  const command = new PutObjectCommand({
    Body: file,
    Bucket: 'sportsnet-screenshot',
    Key: `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.png`,
  });

  await client.send(command);
};
