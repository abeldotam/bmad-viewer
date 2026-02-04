<script setup lang="ts">
const { repos, loading, fetchRepos, addRepo, deleteRepo } = useRepository()

onMounted(() => {
  fetchRepos()
})

async function handleAdd(data: { owner: string, name: string, token?: string }) {
  await addRepo(data.owner, data.name, data.token)
}

async function handleDelete(id: string) {
  await deleteRepo(id)
}

definePageMeta({
  title: 'Dashboard'
})
</script>

<template>
  <UContainer>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">
          Dashboard
        </h1>
        <p class="text-muted text-sm mt-1">
          Your connected BMAD repositories
        </p>
      </div>
      <AddRepoModal @submit="handleAdd" />
    </div>

    <div
      v-if="loading"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="text-primary text-4xl animate-spin"
      />
    </div>

    <div
      v-else-if="repos.length === 0"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-folder-open"
        class="text-muted text-5xl mb-4"
      />
      <h3 class="text-lg font-medium mb-2">
        No repositories yet
      </h3>
      <p class="text-muted text-sm mb-6">
        Connect a GitHub repository with a _bmad-output/ directory to get started.
      </p>
      <AddRepoModal @submit="handleAdd" />
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
    >
      <RepoCard
        v-for="repo in repos"
        :key="repo.id"
        :repo="repo"
        @delete="handleDelete"
      />
    </div>
  </UContainer>
</template>
