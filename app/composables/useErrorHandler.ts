export function useErrorHandler() {
  const toast = useToast()

  function handleError(error: unknown, fallbackMessage = 'An unexpected error occurred') {
    const message = error instanceof Error ? error.message : fallbackMessage

    toast.add({
      title: 'Error',
      description: message,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })

    console.error('[BMAD Viewer]', error)
  }

  function handleSuccess(message: string) {
    toast.add({
      title: 'Success',
      description: message,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }

  return {
    handleError,
    handleSuccess
  }
}
