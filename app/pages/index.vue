<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <UApp>
      <UMain>
        <UPageHero
          title="BMAD Viewer"
          description="Visualize and track your BMAD methodology projects from GitHub. Browse documentation, monitor sprint progress, and manage epics and stories."
          :links="[{
            label: 'Go to Dashboard',
            to: '/dashboard',
            trailingIcon: 'i-lucide-arrow-right',
            size: 'xl'
          }, {
            label: 'View on GitHub',
            to: 'https://github.com/abel-music/bmad-viewer',
            target: '_blank',
            icon: 'i-simple-icons-github',
            size: 'xl',
            color: 'neutral',
            variant: 'subtle'
          }]"
        />

        <UPageSection
          id="features"
          title="Everything you need to track BMAD projects"
          description="A read-only viewer that connects to your GitHub repositories and presents BMAD methodology outputs in a clear, structured interface."
          :features="[{
            icon: 'i-lucide-file-text',
            title: 'Document Browser',
            description: 'Browse project documentation with a tree sidebar and rendered Markdown. PRD, architecture docs, and more.'
          }, {
            icon: 'i-lucide-milestone',
            title: 'Sprint Roadmap',
            description: 'Visualize sprint progress with a vertical timeline. Track story completion and sprint goals at a glance.'
          }, {
            icon: 'i-lucide-kanban',
            title: 'Epics & Stories',
            description: 'View stories in table or Kanban mode. Filter by status, priority, or epic. Click through to full story details.'
          }, {
            icon: 'i-lucide-message-square',
            title: 'Comments as Issues',
            description: 'Leave feedback on stories that automatically creates GitHub issues with proper BMAD labels and templates.'
          }, {
            icon: 'i-lucide-git-branch',
            title: 'GitHub Integration',
            description: 'Connect any GitHub repo with a _bmad-output/ directory. Encrypted token storage and automatic file caching.'
          }, {
            icon: 'i-lucide-layout-dashboard',
            title: 'Multi-Repo Dashboard',
            description: 'Manage multiple BMAD projects from a single dashboard. Quick access to all your repositories.'
          }]"
        />
      </UMain>
    </UApp>
  </div>
</template>
