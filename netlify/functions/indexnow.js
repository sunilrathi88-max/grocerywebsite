export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { urls } = JSON.parse(event.body);
    if (!urls || !Array.isArray(urls)) {
      return { statusCode: 400, body: 'Missing or invalid urls array' };
    }

    const host = 'rathinaturals.com';
    const key = 'rathi-123456789-indexnow';
    const keyLocation = `https://${host}/${key}.txt`;

    const indexNowPayload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload),
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'URLs submitted to IndexNow successfully' }),
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to submit URLs' }),
      };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
