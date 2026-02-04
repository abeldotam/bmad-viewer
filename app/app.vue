<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'BMAD Viewer'
const description = 'Visualize BMAD methodology projects from GitHub repositories. Track sprints, epics, stories, and project documentation.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const route = useRoute()
const isRepoContext = computed(() => route.path.startsWith('/repos/'))

const { user, logout } = useAuth()

const userMenuItems = computed(() => [
  [{
    label: user.value?.email || 'Account',
    disabled: true
  }],
  [{
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard'
  }],
  [{
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    click: logout
  }]
])
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 border-b border-default bg-default/80 backdrop-blur">
      <div class="container mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <BmadLogo />
          </NuxtLink>

          <RepoNavigation
            v-if="isRepoContext"
            class="ml-2"
          />
        </div>

        <div class="flex items-center gap-2">
          <UColorModeButton />

          <UButton
            to="https://github.com/abeldotam/bmad-viewer"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />

          <template v-if="user">
            <UDropdownMenu :items="userMenuItems">
              <UAvatar
                :alt="user.email || 'User'"
                size="sm"
                class="cursor-pointer"
              />
            </UDropdownMenu>
          </template>
          <UButton
            v-else
            to="/login"
            label="Sign in"
            variant="subtle"
            size="sm"
          />
        </div>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-8">
      <NuxtPage />
    </main>

    <div
      v-if="isRepoContext"
      class="fixed bottom-6 right-6 z-50 shadow-lg"
    >
      <NewStoryModal />
    </div>

    <footer class="border-t border-default py-4">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <p class="text-sm text-muted">
          BMAD Viewer &copy; {{ new Date().getFullYear() }}
        </p>
        <UColorModeButton size="xs" />
      </div>
    </footer>
  </div>
</template>
