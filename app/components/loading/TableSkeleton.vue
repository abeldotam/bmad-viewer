<template>
  <div class="space-y-3">
    <USkeleton class="h-10 w-full" />
    <USkeleton
      v-for="i in 5"
      :key="i"
      class="h-12 w-full"
    />
  </div>
</template>
