<script setup lang="ts">
import type { IssueType, Priority } from '~~/shared/types/bmad'

const repoId = inject<Ref<string | null>>('repoId', ref(null))

const { createNewStory } = useGitHubIssues()
const { handleError, handleSuccess } = useErrorHandler()

const open = ref(false)
const state = reactive({
  type: 'feature' as IssueType,
  title: '',
  description: '',
  epic: '',
  priority: 'medium' as Priority
})
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
  if (!state.title || !state.description || !repoId?.value) return
  loading.value = true

  try {
    await createNewStory(repoId.value, {
      type: state.type,
      title: state.title,
      description: state.description,
      epic: state.epic,
      priority: state.priority
    })
    handleSuccess('Story proposal submitted as GitHub issue!')
    state.title = ''
    state.description = ''
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
        <UForm
          :state="state"
          class="space-y-4"
          @submit="handleSubmit"
        >
          <UFormField
            label="Type"
            name="type"
          >
            <USelectMenu
              v-model="state.type"
              :items="typeOptions"
              value-key="value"
            />
          </UFormField>

          <UFormField
            label="Title"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              placeholder="Brief summary"
            />
          </UFormField>

          <UFormField
            label="Description"
            name="description"
            required
          >
            <MarkdownEditor
              v-model="state.description"
              placeholder="Describe the feature, bug, or improvement..."
              :rows="4"
            />
          </UFormField>

          <UFormField
            label="Epic"
            name="epic"
          >
            <UInput
              v-model="state.epic"
              placeholder="Epic ID (e.g. E-001)"
            />
          </UFormField>

          <UFormField
            label="Priority"
            name="priority"
          >
            <USelectMenu
              v-model="state.priority"
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
              :disabled="loading || !state.title || !state.description"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
