<script setup lang="ts">
const { addRepo } = useRepository()
const { handleSuccess } = useErrorHandler()

const open = ref(false)

const owner = ref('')
const name = ref('')
const token = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!owner.value || !name.value) {
    error.value = 'Owner and name are required'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await addRepo(owner.value, name.value, token.value || undefined)
    handleSuccess(`Repository ${owner.value}/${name.value} added successfully`)
    owner.value = ''
    name.value = ''
    token.value = ''
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
          <UFormField label="Repository Owner">
            <UInput
              v-model="owner"
              placeholder="e.g. my-org"
              required
            />
          </UFormField>

          <UFormField label="Repository Name">
            <UInput
              v-model="name"
              placeholder="e.g. my-project"
              required
            />
          </UFormField>

          <UFormField
            label="GitHub Token (optional)"
            hint="Required for private repos"
          >
            <UInput
              v-model="token"
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
        </form>
      </template>
    </UModal>
  </div>
</template>
