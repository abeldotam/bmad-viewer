<script setup lang="ts">
import type { Story } from '~~/shared/types/bmad'

const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const storyId = computed(() => route.params.id as string)
const repoId = inject<Ref<string | null>>('repoId')!

const { fetchSprintStatus, fetchFileContent } = useGitHub()
const { handleError } = useErrorHandler()

const story = ref<Story | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await fetchSprintStatus(repoId.value!)
    const allStories = data.sprints.flatMap(s => s.stories)
    const found = allStories.find(s => s.id === storyId.value)

    if (found) {
      if (found.filePath) {
        try {
          const content = await fetchFileContent(repoId.value!, found.filePath)
          found.content = content
        } catch {
          // Story file content not available
        }
      }
      story.value = found
    }
  } catch (e) {
    handleError(e, 'Failed to load story')
  } finally {
    loading.value = false
  }
})

useHead({
  title: () => story.value ? `${story.value.id} - ${story.value.title}` : 'Story'
})
</script>

<template>
  <div
    v-if="loading"
    class="text-center py-20"
  >
    <UIcon
      name="i-lucide-loader-2"
      class="text-primary text-4xl animate-spin"
    />
  </div>

  <div v-else-if="story">
    <StoryHeader
      :story="story"
      :repo-owner="owner"
      :repo-name="repo"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div class="lg:col-span-2 space-y-6">
        <StoryContent :content="story.content || 'No content available.'" />
        <CommentForm
          :story-id="story.id"
          :epic-id="story.epic"
          :repo-id="repoId!"
        />
      </div>

      <div class="space-y-4">
        <StoryMetadata :story="story" />
        <RelatedPRs />
        <LinkedIssues
          :repo-id="repoId!"
          :story-id="story.id"
        />
      </div>
    </div>
  </div>

  <div
    v-else
    class="text-center py-20"
  >
    <UIcon
      name="i-lucide-file-question"
      class="text-muted text-5xl mb-4"
    />
    <h2 class="text-lg font-medium mb-2">
      Story not found
    </h2>
    <p class="text-muted text-sm">
      The story "{{ storyId }}" does not exist.
    </p>
  </div>
</template>
