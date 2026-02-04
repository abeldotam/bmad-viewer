<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <UCard>
    <div class="prose dark:prose-invert max-w-none">
      <MDC :value="content" />
    </div>
  </UCard>
</template>
