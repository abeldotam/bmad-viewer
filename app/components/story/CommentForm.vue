<script setup lang="ts">
defineProps<{
  storyId: string
  epicId: string
}>()

const emit = defineEmits<{
  submitted: []
}>()

const comment = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleSubmit() {
  if (!comment.value.trim()) return
  loading.value = true
  error.value = ''
  success.value = false

  try {
    // In mock mode, just show success
    success.value = true
    comment.value = ''
    emit('submitted')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to create comment'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard>
    <h3 class="font-semibold text-sm mb-3">
      Leave a Comment
    </h3>
    <p class="text-xs text-muted mb-3">
      Your comment will be created as a GitHub issue.
    </p>

    <form
      class="space-y-3"
      @submit.prevent="handleSubmit"
    >
      <UTextarea
        v-model="comment"
        placeholder="Write your comment..."
        :rows="3"
      />

      <p
        v-if="error"
        class="text-error text-xs"
      >
        {{ error }}
      </p>
      <p
        v-if="success"
        class="text-success text-xs"
      >
        Comment submitted successfully!
      </p>

      <UButton
        type="submit"
        label="Submit Comment"
        icon="i-lucide-send"
        size="sm"
        :loading="loading"
        :disabled="!comment.trim()"
      />
    </form>
  </UCard>
</template>
