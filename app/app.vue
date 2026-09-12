<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { performRefresh, isAuthenticated } = useAuth()
let refreshInterval: any = null

onMounted(() => {
  // Set up refresh token interval every 2 minutes (120000 ms)
  refreshInterval = setInterval(async () => {
    if (isAuthenticated.value) {
      await performRefresh()
    }
  }, 120000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
