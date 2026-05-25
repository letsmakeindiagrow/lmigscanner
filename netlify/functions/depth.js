// Netlify Function — Fyers Depth Proxy
exports.handler = async function(event) {
  const { symbol, token } = event.queryStringParameters || {};

  if (!symbol || !token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ s: 'error', message: 'Missing symbol or token' })
    };
  }

  const url = `https://api-t1.fyers.in/data/depth?symbol=${encodeURIComponent(symbol)}&ohlcv_flag=1`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': token, 'Content-Type': 'application/json' }
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch(e) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ s: 'error', message: 'Fyers returned non-JSON: ' + text.slice(0, 200) })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ s: 'error', message: err.message })
    };
  }
};
