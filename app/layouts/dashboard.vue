<template>
  <div class="h-screen bg-slate-50 flex overflow-hidden font-sans">
    
    <!-- Sidebar -->
    <DashboardSidebar 
      :is-open="isSidebarOpen" 
      @close="isSidebarOpen = false" 
    />

    <div class="flex-1 flex flex-col min-w-0 lg:ml-[72px]">
      <!-- Header -->
      <DashboardHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="w-full h-full p-4">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '~/components/dashboard/Sidebar.vue'
import DashboardHeader from '~/components/dashboard/Header.vue'
import { ref } from 'vue'

const isSidebarOpen = ref(false)
</script>
