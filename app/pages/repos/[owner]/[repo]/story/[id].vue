<script setup lang="ts">
import type { Story } from '~~/shared/types/bmad'

const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const storyId = computed(() => route.params.id as string)
const repoId = inject<Ref<string | null>>('repoId')!

const { stories, sprints, loading: repoLoading, fetchFileContent } = useRepoData()

const story = ref<Story | null>(null)
const contentLoading = ref(false)

const storyPRs = computed(() => {
  if (!story.value) return []
  const sprint = sprints.value.find(s => s.stories.some(st => st.id === story.value?.id))
  return sprint?.pr ? [sprint.pr] : []
})

watch([repoLoading, storyId], async ([isLoading]) => {
  if (isLoading) return

  const found = stories.value.find(s => s.id === storyId.value)
  if (!found) {
    story.value = null
    return
  }

  story.value = { ...found }

  if (found.filePath) {
    contentLoading.value = true
    try {
      const content = await fetchFileContent(found.filePath)
      story.value = { ...found, content }
    } catch {
      // Story file content not available
    } finally {
      contentLoading.value = false
    }
  }
}, { immediate: true })

useHead({
  title: () => story.value ? `${story.value.id} - ${story.value.title}` : 'Story'
})
</script>

<template>
  <div
    v-if="repoLoading"
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
        <div
          v-if="contentLoading"
          class="text-center py-10"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="text-primary text-2xl animate-spin"
          />
        </div>
        <StoryContent
          v-else
          :content="story.content || 'No content available.'"
        />
        <CommentForm
          :story-id="story.id"
          :epic-id="story.epic"
          :repo-id="repoId!"
        />
      </div>

      <div class="space-y-4">
        <StoryMetadata :story="story" />
        <RelatedPRs :pull-requests="storyPRs" />
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
