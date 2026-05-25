// Netlify Function — Fyers Option Chain Proxy
// Runs on Netlify's server → no CORS restrictions
// Called by browser as: GET /api/optionchain?symbol=...&strikecount=...&timestamp=...&token=...

exports.handler = async function(event) {
  const { symbol, strikecount, timestamp, token } = event.queryStringParameters || {};

  if (!symbol || !token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ s: 'error', message: 'Missing symbol or token' })
    };
  }

  const url = `https://api-t2.fyers.in/api/v3/optionchain?symbol=${encodeURIComponent(symbol)}&strikecount=${strikecount || 10}&timestamp=${encodeURIComponent(timestamp || '')}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text();

    // Try to parse as JSON
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
