<script setup lang="ts">
import type { Sprint, Story } from '~~/shared/types/bmad'

const repoId = inject<Ref<string | null>>('repoId')!
const { fetchSprintStatus } = useGitHub()
const { handleError } = useErrorHandler()

const sprints = ref<Sprint[]>([])
const stories = ref<Story[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await fetchSprintStatus(repoId.value!)
    sprints.value = data.sprints
    stories.value = data.sprints.flatMap(s => s.stories)
  } catch (e) {
    handleError(e, 'Failed to load roadmap data')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-1">
      Roadmap
    </h2>
    <p class="text-muted text-sm mb-6">
      Sprint progress and timeline
    </p>

    <div
      v-if="loading"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="text-primary text-4xl animate-spin"
      />
    </div>

    <div
      v-else
      class="space-y-8"
    >
      <GlobalStats
        :stories="stories"
        :sprints="sprints"
      />

      <div>
        <h3 class="text-lg font-semibold mb-4">
          Sprint Timeline
        </h3>
        <SprintTimeline :sprints="sprints" />
      </div>
    </div>
  </div>
</template>
