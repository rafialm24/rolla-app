<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      
      <!-- Welcome Message & Selection Status -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-5 flex items-center justify-between shadow-sm">
        <div>
          <h2 class="text-xl font-bold text-white mb-1">Production Dashboard</h2>
          <p class="text-slate-400 text-sm">
            <span v-if="currentProduksi">Menampilkan data operasional untuk lokasi <strong class="text-white">{{ currentProduksi.name_prod }}</strong>.</span>
            <span v-else class="italic text-yellow-500">Silakan pilih lokasi produksi pada sidebar.</span>
          </p>
        </div>
        <div v-if="user" class="text-right hidden sm:block">
          <p class="text-sm font-semibold text-slate-300">User: {{ user.nik }}</p>
          <p class="text-xs text-slate-500">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
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
