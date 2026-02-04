<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 3
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <UCard
      v-for="i in count"
      :key="i"
    >
      <div class="space-y-3">
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-3 w-1/2" />
        <USkeleton class="h-2 w-full" />
      </div>
    </UCard>
  </div>
</template>
