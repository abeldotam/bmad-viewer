<script setup lang="ts">
import type { IssueType, Priority } from '~~/shared/types/bmad'

const open = defineModel<boolean>('open', { default: false })
const { epics } = useMockData()

const type = ref<IssueType>('feature')
const title = ref('')
const description = ref('')
const epic = ref('')
const priority = ref<Priority>('medium')
const loading = ref(false)
const error = ref('')
const success = ref(false)

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

const epicOptions = computed(() =>
  epics.map(e => ({ label: e.title, value: e.id }))
)

async function handleSubmit() {
  if (!title.value || !description.value) return
  loading.value = true
  error.value = ''
  success.value = false

  try {
    // In mock mode, just show success
    success.value = true
    title.value = ''
    description.value = ''
    setTimeout(() => {
      open.value = false
      success.value = false
    }, 1500)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to create story'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open">
    <template #header>
      <h3 class="font-semibold">
        New Story / Report Bug
      </h3>
    </template>

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
          <USelectMenu
            v-model="epic"
            :items="epicOptions"
            value-key="value"
            placeholder="Select an epic"
          />
        </UFormField>

        <UFormField label="Priority">
          <USelectMenu
            v-model="priority"
            :items="priorityOptions"
            value-key="value"
          />
        </UFormField>

        <p
          v-if="error"
          class="text-error text-sm"
        >
          {{ error }}
        </p>
        <p
          v-if="success"
          class="text-success text-sm"
        >
          Story proposal submitted!
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
            label="Submit"
            :loading="loading"
          />
        </div>
      </form>
    </template>
  </UModal>
</template>
