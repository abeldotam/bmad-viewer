<script setup lang="ts">
import type { IssueType, Priority } from '~~/shared/types/bmad'

const repoId = inject<Ref<string | null>>('repoId', ref(null))

const { createNewStory } = useGitHubIssues()
const { handleError, handleSuccess } = useErrorHandler()

const open = ref(false)
const type = ref<IssueType>('feature')
const title = ref('')
const description = ref('')
const epic = ref('')
const priority = ref<Priority>('medium')
const loading = ref(false)

const typeOptions = [
  { label: 'Feature', value: 'feature' },
  { label: 'Bug', value: 'bug' },
  { label: 'Improvement', value: 'improvement' }
]

const priorityOptions = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

async function handleSubmit() {
  if (!title.value || !description.value || !repoId?.value) return
  loading.value = true

  try {
    await createNewStory(repoId.value, {
      type: type.value,
      title: title.value,
      description: description.value,
      epic: epic.value,
      priority: priority.value
    })
    handleSuccess('Story proposal submitted as GitHub issue!')
    title.value = ''
    description.value = ''
    open.value = false
  } catch (e) {
    handleError(e, 'Failed to create story')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UButton
      icon="i-lucide-plus"
      label="New Story"
      size="lg"
      @click="open = true"
    />

    <UModal
      v-model:open="open"
      title="New Story / Report Bug"
    >
      <template #body>
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <UFormField label="Type">
            <USelectMenu
              v-model="type"
              :items="typeOptions"
              value-key="value"
            />
          </UFormField>

          <UFormField label="Title">
            <UInput
              v-model="title"
              placeholder="Brief summary"
              required
            />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="description"
              placeholder="Describe the feature, bug, or improvement..."
              :rows="4"
              required
            />
          </UFormField>

          <UFormField label="Epic">
            <UInput
              v-model="epic"
              placeholder="Epic ID (e.g. E-001)"
            />
          </UFormField>

          <UFormField label="Priority">
            <USelectMenu
              v-model="priority"
              :items="priorityOptions"
              value-key="value"
            />
          </UFormField>

          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              @click="open = false"
            />
            <UButton
              type="submit"
              label="Submit"
              :loading="loading"
              :disabled="loading || !title || !description"
            />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
