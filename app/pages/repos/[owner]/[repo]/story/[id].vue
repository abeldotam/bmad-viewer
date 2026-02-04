<script setup lang="ts">
const route = useRoute()
const owner = computed(() => route.params.owner as string)
const repo = computed(() => route.params.repo as string)
const storyId = computed(() => route.params.id as string)

const { getStory, getEpic } = useMockData()

const story = computed(() => getStory(storyId.value))
const epic = computed(() => story.value ? getEpic(story.value.epic) : undefined)

useHead({
  title: () => story.value ? `${story.value.id} - ${story.value.title}` : 'Story not found'
})
</script>

<template>
  <div v-if="story">
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
        />
      </div>

      <div class="space-y-4">
        <StoryMetadata
          :story="story"
          :epic="epic"
        />
        <RelatedPRs />
        <LinkedIssues />
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
