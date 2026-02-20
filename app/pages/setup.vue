<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <UMain class="flex items-center justify-center min-h-screen">
      <UPageSection class="max-w-2xl">
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-lucide-settings"
                class="text-2xl text-(--ui-primary)"
              />
              <h1 class="text-xl font-bold">
                BMAD Viewer — Configuration Required
              </h1>
            </div>
          </template>

          <div class="space-y-6">
            <UAlert
              color="warning"
              icon="i-lucide-alert-triangle"
              title="No GitHub credentials configured"
              description="BMAD Viewer needs GitHub access to fetch your project data. Choose a mode below and set the corresponding environment variables."
            />

            <div class="space-y-4">
              <div class="border border-(--ui-border) rounded-lg p-4 space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-user"
                    class="text-lg text-(--ui-primary)"
                  />
                  <h2 class="font-semibold">
                    Personal Mode
                  </h2>
                  <UBadge
                    color="success"
                    variant="subtle"
                    label="Fastest"
                  />
                </div>
                <p class="text-sm text-(--ui-text-muted)">
                  Single user, no login screen. Ideal for your own dashboard.
                </p>
                <UAlert
                  color="neutral"
                  variant="subtle"
                  class="mt-2"
                >
                  <template #description>
                    <p class="font-mono text-xs">
                      NUXT_GITHUB_TOKEN=ghp_your_token_here
                    </p>
                    <p class="text-xs mt-1 text-(--ui-text-muted)">
                      Create a token at
                      <a
                        href="https://github.com/settings/tokens"
                        target="_blank"
                        class="underline"
                      >github.com/settings/tokens</a>
                      with <strong>repo</strong> scope.
                    </p>
                  </template>
                </UAlert>
              </div>

              <div class="border border-(--ui-border) rounded-lg p-4 space-y-2">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-users"
                    class="text-lg text-(--ui-primary)"
                  />
                  <h2 class="font-semibold">
                    Multi-user Mode
                  </h2>
                  <UBadge
                    color="info"
                    variant="subtle"
                    label="OAuth"
                  />
                </div>
                <p class="text-sm text-(--ui-text-muted)">
                  GitHub OAuth login, multiple users. Ideal for teams or public instances.
                </p>
                <UAlert
                  color="neutral"
                  variant="subtle"
                  class="mt-2"
                >
                  <template #description>
                    <p class="font-mono text-xs">
                      NUXT_GITHUB_CLIENT_ID=your_client_id<br>
                      NUXT_GITHUB_CLIENT_SECRET=your_client_secret<br>
                      NUXT_SESSION_PASSWORD=your_session_secret
                    </p>
                    <p class="text-xs mt-1 text-(--ui-text-muted)">
                      Create an OAuth App at
                      <a
                        href="https://github.com/settings/developers"
                        target="_blank"
                        class="underline"
                      >github.com/settings/developers</a>.
                    </p>
                  </template>
                </UAlert>
              </div>
            </div>

            <p class="text-sm text-(--ui-text-muted)">
              Add the variables to your <code class="text-xs bg-(--ui-bg-elevated) px-1 py-0.5 rounded">.env</code> file, then restart the application.
              See <code class="text-xs bg-(--ui-bg-elevated) px-1 py-0.5 rounded">.env.example</code> for the full reference.
            </p>
          </div>
        </UCard>
      </UPageSection>
    </UMain>
  </div>
</template>
