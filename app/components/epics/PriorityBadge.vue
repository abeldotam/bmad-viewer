<script setup lang="ts">
import type { Priority } from '~~/shared/types/bmad'

defineProps<{
  priority: Priority
}>()
</script>

<template>
  <UBadge
    :icon="getPriorityIcon(priority)"
    :label="priority"
    :color="getPriorityColor(priority)"
    variant="subtle"
    size="sm"
  />
</template>
