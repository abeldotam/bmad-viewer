<script setup lang="ts">
import type { Story } from '~~/shared/types/bmad'

const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const storyId = computed(() => route.params.id as string)

const { stories, sprints, loading: repoLoading, fetchFileContent } = useRepoData()

const story = ref<Story | null>(null)
const contentLoading = ref(false)
const contentMissing = ref(false)

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
  contentMissing.value = false

  if (found.filePath) {
    contentLoading.value = true
    try {
      const content = await fetchFileContent(found.filePath)
      story.value = { ...found, content }
    } catch {
      contentMissing.value = true
    } finally {
      contentLoading.value = false
    }
  } else {
    contentMissing.value = true
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
        <UCard v-else-if="contentMissing">
          <div class="text-center py-6">
            <UIcon
              name="i-lucide-file-x"
              class="text-muted text-3xl mb-3"
            />
            <p class="text-muted text-sm">
              Story file not yet created.
            </p>
            <p class="text-xs text-dimmed mt-1">
              {{ story.filePath }}
            </p>
          </div>
        </UCard>
        <StoryContent
          v-else
          :content="story.content || ''"
        />
        <CommentForm
          :story-id="story.id"
          :epic-id="story.epic"
          :owner="owner"
          :repo="repo"
        />
      </div>

      <div class="space-y-4">
        <StoryMetadata :story="story" />
        <RelatedPRs :pull-requests="storyPRs" />
        <LinkedIssues
          :owner="owner"
          :repo="repo"
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
