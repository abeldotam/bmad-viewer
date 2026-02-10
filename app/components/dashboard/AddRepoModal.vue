<script setup lang="ts">
const { addRepo } = useRepository()
const { handleSuccess } = useErrorHandler()

const open = ref(false)

const state = reactive({
  owner: '',
  name: '',
  token: ''
})
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!state.owner || !state.name) {
    error.value = 'Owner and name are required'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await addRepo(state.owner, state.name, state.token || undefined)
    handleSuccess(`Repository ${state.owner}/${state.name} added successfully`)
    state.owner = ''
    state.name = ''
    state.token = ''
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
        <UForm
          :state="state"
          class="space-y-4"
          @submit="handleSubmit"
        >
          <UFormField
            label="Repository Owner"
            name="owner"
            required
          >
            <UInput
              v-model="state.owner"
              placeholder="e.g. my-org"
            />
          </UFormField>

          <UFormField
            label="Repository Name"
            name="name"
            required
          >
            <UInput
              v-model="state.name"
              placeholder="e.g. my-project"
            />
          </UFormField>

          <UFormField
            label="GitHub Token (optional)"
            name="token"
            hint="Required for private repos"
          >
            <UInput
              v-model="state.token"
              type="password"
              placeholder="ghp_..."
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
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
