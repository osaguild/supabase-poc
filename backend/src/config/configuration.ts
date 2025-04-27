export default () => ({
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/supabase_poc',
  },
  gcp: {
    projectId: process.env.GCP_PROJECT_ID || 'your-project-id',
    pubsub: {
      topic: process.env.GCP_PUBSUB_TOPIC || 'name-topic',
      subscription: process.env.GCP_PUBSUB_SUBSCRIPTION || 'name-subscription',
    },
    credentials: process.env.GCP_CREDENTIALS_JSON
      ? JSON.parse(process.env.GCP_CREDENTIALS_JSON)
      : {},
  },
  server: {
    port: Number.parseInt(process.env.PORT || '3003', 10),
  },
});
