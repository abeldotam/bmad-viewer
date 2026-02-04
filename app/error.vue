<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

function getTitle(statusCode?: number) {
  if (statusCode === 404) return 'Page not found'
  if (statusCode === 401) return 'Unauthorized'
  return 'Something went wrong'
}

function getDescription(statusCode?: number) {
  if (statusCode === 404) return 'The page you are looking for does not exist or has been moved.'
  if (statusCode === 401) return 'You need to be signed in to access this page.'
  return 'An unexpected error occurred. Please try again later.'
}

function getIcon(statusCode?: number) {
  if (statusCode === 404) return 'i-lucide-file-question'
  if (statusCode === 401) return 'i-lucide-lock'
  return 'i-lucide-alert-circle'
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <UIcon
        :name="getIcon(error.statusCode)"
        class="text-muted text-6xl mb-6"
      />
      <h1 class="text-4xl font-bold mb-2">
        {{ error.statusCode || 500 }}
      </h1>
      <h2 class="text-xl font-medium mb-4">
        {{ getTitle(error.statusCode) }}
      </h2>
      <p class="text-muted mb-8">
        {{ getDescription(error.statusCode) }}
      </p>
      <div class="flex gap-3 justify-center">
        <UButton
          label="Go Home"
          to="/"
          variant="subtle"
        />
        <UButton
          label="Go Back"
          color="neutral"
          variant="outline"
          @click="$router.back()"
        />
      </div>
    </div>
  </div>
</template>
