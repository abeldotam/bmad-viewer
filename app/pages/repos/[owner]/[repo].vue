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

const { repos, fetchRepos } = useRepository()

const repoId = computed(() => {
  const found = repos.value.find(r => r.owner === owner.value && r.name === repo.value)
  return found?.id ?? null
})

onMounted(async () => {
  if (repos.value.length === 0) {
    await fetchRepos()
  }
})

provide('repoId', repoId)

// Preload all repo data (documents, sprints, stories) in parallel
provideRepoData(repoId)
</script>

<template>
  <UContainer>
    <UBreadcrumb
      :items="breadcrumbItems"
      class="mb-4"
    />

    <div
      v-if="!repoId"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="text-primary text-4xl animate-spin"
      />
      <p class="text-muted text-sm mt-4">
        Loading repository...
      </p>
    </div>

    <NuxtPage v-else />
  </UContainer>
</template>
