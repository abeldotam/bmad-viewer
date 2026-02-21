<script setup lang="ts">
import type { MDCParserResult } from '@nuxtjs/mdc'

defineProps<{
  content: string | MDCParserResult
}>()
</script>

<template>
  <UCard>
    <div class="prose dark:prose-invert max-w-none">
      <MDC :value="content" />
    </div>
  </UCard>
</template>
