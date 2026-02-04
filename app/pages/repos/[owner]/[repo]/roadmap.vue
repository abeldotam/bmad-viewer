<script setup lang="ts">
const { sprints, stories, loading } = useRepoData()
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-1">
      Roadmap
    </h2>
    <p class="text-muted text-sm mb-6">
      Epic progress and timeline
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
      v-else-if="sprints.length === 0"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-calendar-off"
        class="text-muted text-4xl mb-4"
      />
      <p class="text-muted text-sm">
        No <code>sprint-status.yaml</code> found in <code>_bmad-output/</code>.
      </p>
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
          Epic Timeline
        </h3>
        <SprintTimeline :sprints="sprints" />
      </div>
    </div>
  </div>
</template>
