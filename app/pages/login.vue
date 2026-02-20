<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const error = computed(() => route.query.error === 'oauth' ? 'GitHub authentication failed. Please try again.' : '')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <div class="text-center mb-6">
        <BmadLogo />
        <p class="text-sm text-muted mt-2">
          Sign in to your account
        </p>
      </div>

      <UAlert
        v-if="error"
        color="error"
        icon="i-lucide-alert-circle"
        :description="error"
        class="mb-4"
      />

      <UButton
        to="/auth/github"
        label="Sign in with GitHub"
        icon="i-simple-icons-github"
        block
        size="lg"
        external
      />

      <p class="text-center text-xs text-muted mt-4">
        You will be redirected to GitHub to authorize this application.
      </p>
    </UCard>
  </div>
</template>
