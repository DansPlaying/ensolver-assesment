export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { pingDatabase } = await import('@/lib/queries');

    // Ping DB at 8am, 2pm, and 8pm to prevent Supabase free-tier pausing
    cron.default.schedule('0 8,14,20 * * *', async () => {
      try {
        await pingDatabase();
        console.log('[keep-alive] Database ping successful');
      } catch (err) {
        console.error('[keep-alive] Database ping failed:', err);
      }
    });
  }
}
