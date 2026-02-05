<script setup lang="ts">
const props = defineProps<{
  storyId: string
  epicId: string
  repoId: string
}>()

const emit = defineEmits<{
  submitted: []
}>()

const { createComment } = useGitHubIssues()
const { handleError } = useErrorHandler()

const comment = ref('')
const loading = ref(false)
const success = ref(false)

async function handleSubmit() {
  if (!comment.value.trim()) return
  loading.value = true
  success.value = false

  try {
    await createComment(props.repoId, props.storyId, props.epicId, comment.value)
    success.value = true
    comment.value = ''
    emit('submitted')
  } catch (e) {
    handleError(e, 'Failed to create comment')
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
        :disabled="loading || !comment.trim()"
      />
    </form>
  </UCard>
</template>
