<script setup lang="ts">
const { stories, sprints } = useMockData()
</script>

<template>
  <div>
    <UPageHeader
      title="Roadmap"
      description="Sprint progress and timeline"
    />

    <div class="mt-6 space-y-8">
      <GlobalStats
        :stories="stories"
        :sprints="sprints"
      />

      <div>
        <h2 class="text-lg font-semibold mb-4">
          Sprint Timeline
        </h2>
        <SprintTimeline :sprints="sprints" />
      </div>
    </div>
  </div>
</template>
