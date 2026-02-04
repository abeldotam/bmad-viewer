<script setup lang="ts">
definePageMeta({
  layout: false
})

onMounted(async () => {
  await navigateTo('/dashboard')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="text-primary text-4xl animate-spin mb-4"
      />
      <p class="text-muted">
        Completing sign in...
      </p>
    </div>
  </div>
</template>
