<script setup lang="ts">
import type { StoryStatus } from '~~/shared/types/bmad'

defineProps<{
  status: StoryStatus
}>()
</script>

<template>
  <UBadge
    :label="getStatusLabel(status)"
    :color="getStatusColor(status)"
    variant="subtle"
    size="sm"
  />
</template>
