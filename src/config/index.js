export default {
  title: process.env.VUE_APP_TITLE,
  version: '1.1.0',
  apiUrl: process.env.VUE_APP_API_URL,
  registrationIsEnabled: (process.env.VUE_APP_REGISTRATION_ENABLED === 'true'),
  minPasswordLength: process.env.VUE_APP_MIN_PASSWORD_LENGTH || 16,
  fallbackFilesSortingNamespace:
    process.env.VUE_APP_FALLBACK_FILES_SORTING_NAMESPACE || 'namespace',
  fallbackTagColor: process.env.VUE_APP_FALLBACK_TAG_COLOR || '#3498db'
}
