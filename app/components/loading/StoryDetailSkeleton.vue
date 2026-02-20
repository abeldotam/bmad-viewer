<template>
  <div>
    <!-- Header skeleton -->
    <div class="space-y-3 mb-6">
      <div class="flex items-center gap-3">
        <USkeleton class="h-7 w-48" />
        <USkeleton class="h-5 w-16 rounded-full" />
        <USkeleton class="h-5 w-20 rounded-full" />
      </div>
      <USkeleton class="h-4 w-1/3" />
    </div>

    <!-- Grid layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main content (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <div class="space-y-4">
            <USkeleton class="h-5 w-2/3" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-5/6" />
            <USkeleton class="h-4 w-4/5" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-32 w-full" />
          </div>
        </UCard>
      </div>

      <!-- Sidebar (1/3) -->
      <div class="space-y-4">
        <UCard
          v-for="i in 3"
          :key="i"
        >
          <div class="space-y-3">
            <USkeleton class="h-4 w-1/2" />
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-3 w-2/3" />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
