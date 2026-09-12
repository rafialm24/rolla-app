<script setup lang="ts">
// Automatically redirect root page to dashboard
await navigateTo('/dashboard')
</script>

<template>
  <div>
    <!-- Optional: Add a loading state while redirecting -->
    <p>Redirecting to dashboard...</p>
  </div>
</template>
