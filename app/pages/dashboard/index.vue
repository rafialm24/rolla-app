<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      
      <!-- Welcome Message & Selection Status -->
      <div class="relative overflow-hidden bg-gradient-to-r from-[#2b170f] via-[#3b2518] to-[#4b2e1c] border border-amber-300/20 rounded-2xl p-5 flex items-center justify-between shadow-[0_16px_38px_rgba(70,38,20,0.16)]">
        <div class="absolute -right-16 -top-24 w-64 h-64 rounded-full border border-amber-300/10 shadow-[0_0_0_42px_rgba(218,171,79,0.025)] pointer-events-none"></div>
        <div>
          <p class="text-[10px] font-bold text-amber-300/70 uppercase tracking-[0.2em] mb-1.5">Rolla Production System</p>
          <h2 class="text-xl font-bold text-[#fff8e9] mb-1">Production Dashboard</h2>
          <p class="text-[#c9af91] text-sm">
            <span v-if="currentProduksi">Menampilkan data operasional untuk lokasi <strong class="text-amber-200">{{ currentProduksi.name_prod }}</strong>.</span>
            <span v-else class="italic text-amber-400">Silakan pilih lokasi produksi pada sidebar.</span>
          </p>
        </div>
        <div v-if="user" class="relative text-right hidden sm:block">
          <p class="text-sm font-semibold text-[#f4e4cc]">User: {{ user.nik }}</p>
          <p class="text-xs text-[#ad8d70]">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </div>
      </div>

      <!-- Render Dashboard Components only if a location is selected -->
      <div v-if="activeProdId" class="space-y-6 pb-10">
        
        <!-- KPI Cards -->
        <DashboardKpiCards :prodId="activeProdId" />

        <!-- Sales Chart -->
        <DashboardSalesChart :prodId="activeProdId" />

        <!-- Sales Detail Table & Chart -->
        <DashboardSalesDetail :prodId="activeProdId" />

        <!-- Pareto Data & Return Detail -->
        <DashboardParetoTable :prodId="activeProdId" />

        <!-- Store Return Table & Detail -->
        <DashboardReturnTable :prodId="activeProdId" />

        <!-- Penjualan Store & Cabang Table -->
        <DashboardPenjualanTable :prodId="activeProdId" />

        <!-- Pembelian Table -->
        <DashboardPembelianTable :prodId="activeProdId" />

        <!-- Produktivitas -->
        <DashboardProduktivitas :prodId="activeProdId" />

      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useProduksi } from '~/composables/useProduksi'

// Disable automatic layout because we explicitly define <NuxtLayout>
definePageMeta({
  layout: false 
})

const { user } = useAuth()
const { currentProduksi, activeProdId } = useProduksi()

// Components will be automatically imported by Nuxt from app/components/dashboard/* 
// For example: <DashboardKpiCards /> looks for app/components/dashboard/KpiCards.vue
</script>
