process.env.CHROMIUM_EXECUTABLE_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

import { handler } from '.';

describe('handler', () => {
  it('returns success', async () => {
    const result = await handler({});

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    });
  });
});
