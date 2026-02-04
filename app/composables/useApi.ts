export function useApi() {
  const session = useSupabaseSession()

  return $fetch.create({
    onRequest({ options }) {
      const token = session.value?.access_token
      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    }
  })
}
