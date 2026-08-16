import { app } from '@azure/functions';

/** Minimal stub so SWA api_location stays valid. Studio/Gemini is not in this milestone. */
app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => ({
    status: 200,
    jsonBody: { ok: true },
  }),
});
