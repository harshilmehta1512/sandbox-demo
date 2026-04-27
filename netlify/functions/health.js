exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status:  'ok',
    mode:    process.env.MAIA_MODEL_MODE || 'demo',
    version: '1.0.0',
  }),
});
