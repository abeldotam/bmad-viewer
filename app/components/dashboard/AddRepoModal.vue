<script setup lang="ts">
const { addRepo } = useRepository()
const { handleSuccess } = useErrorHandler()
const api = useApi()

const open = ref(false)

const selected = ref('')
const loading = ref(false)
const error = ref('')

interface GitHubRepo {
  owner: string
  name: string
  fullName: string
  description: string | null
}

const repos = ref<GitHubRepo[]>([])
const loadingRepos = ref(false)

const items = computed(() =>
  repos.value.map(r => ({
    label: r.fullName,
    value: r.fullName,
    description: r.description || undefined
  }))
)

async function fetchRepos() {
  loadingRepos.value = true
  error.value = ''
  try {
    repos.value = await api<GitHubRepo[]>('/api/github/repos')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load repositories'
  } finally {
    loadingRepos.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    selected.value = ''
    error.value = ''
    fetchRepos()
  }
})

async function handleSubmit() {
  if (!selected.value) {
    error.value = 'Please select a repository'
    return
  }
  const parts = selected.value.split('/')
  const owner = parts[0]!
  const name = parts[1]!
  loading.value = true
  error.value = ''
  try {
    await addRepo(owner, name)
    handleSuccess(`Repository ${selected.value} added successfully`)
    selected.value = ''
    open.value = false
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to add repository'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UButton
      label="Add Repository"
      icon="i-lucide-plus"
      @click="open = true"
    />

    <UModal
      v-model:open="open"
      title="Add Repository"
    >
      <template #body>
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <UFormField
            label="Repository"
            name="repo"
            required
          >
            <USelectMenu
              v-model="selected"
              :items="items"
              value-key="value"
              searchable
              placeholder="Search your repositories..."
              :loading="loadingRepos"
              class="w-full"
            />
          </UFormField>

          <p
            v-if="error"
            class="text-error text-sm"
          >
            {{ error }}
          </p>

          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              @click="open = false"
            />
            <UButton
              type="submit"
              label="Add Repository"
              :loading="loading"
              :disabled="!selected"
            />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
