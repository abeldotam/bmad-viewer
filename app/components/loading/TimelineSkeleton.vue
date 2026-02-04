<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <UCard
        v-for="i in 4"
        :key="i"
      >
        <div class="space-y-2 text-center">
          <USkeleton class="h-8 w-12 mx-auto" />
          <USkeleton class="h-3 w-20 mx-auto" />
        </div>
      </UCard>
    </div>

    <div class="relative pl-10 space-y-6">
      <div
        v-for="i in 3"
        :key="i"
      >
        <UCard>
          <div class="space-y-3">
            <USkeleton class="h-5 w-1/3" />
            <USkeleton class="h-3 w-2/3" />
            <USkeleton class="h-2 w-full" />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
