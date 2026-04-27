// Scheduled by netlify.toml — runs at 8am, 2pm, and 8pm UTC
// Calls the Next.js keep-alive route which pings the Supabase DB
exports.handler = async () => {
  const siteUrl = process.env.URL;
  if (!siteUrl) return { statusCode: 200, body: 'No URL configured' };

  await fetch(`${siteUrl}/api/keep-alive`);
  return { statusCode: 200, body: 'ping sent' };
};
