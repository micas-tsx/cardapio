// api/send-order.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookURL = process.env.WEBHOOK_URL;
  if (!webhookURL) {
    return res.status(500).json({ error: 'WEBHOOK_URL não configurada' });
  }

  try {
    const { msg } = req.body;

    const discordRes = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: msg }),
    });

    if (!discordRes.ok) {
      return res
        .status(500)
        .json({ error: 'Erro ao chamar Discord', status: discordRes.status });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Erro interno', message: err.message });
  }
};