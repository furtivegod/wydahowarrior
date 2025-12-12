import { withSentryConfig } from '@sentry/nextjs'

const nextConfig = {
  serverExternalPackages: ['playwright'],
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'posthog-js', '@sentry/nextjs']
  }
}

export default withSentryConfig(nextConfig, {
  org: 'wydahowarriors', // Replace with your Sentry org
  project: 'knife-check-assessment', // Replace with your Sentry project
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
})

