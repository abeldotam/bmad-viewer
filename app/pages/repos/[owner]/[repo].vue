<script setup lang="ts">
const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)

useHead({
  title: () => `${owner.value}/${repo.value}`
})

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', icon: 'i-lucide-home', to: '/dashboard' },
  { label: `${owner.value}/${repo.value}`, icon: 'i-lucide-git-branch' }
])
</script>

<template>
  <UContainer>
    <UBreadcrumb
      :items="breadcrumbItems"
      class="mb-4"
    />
    <NuxtPage />
  </UContainer>
</template>
