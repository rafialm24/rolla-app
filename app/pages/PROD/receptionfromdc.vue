<script setup lang="ts">
import { onMounted } from 'vue'
import { useReceptionFromDc } from '~/composables/useReceptionFromDc'

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const {
  deliveryOptions,
  selectedSj,
  reportList,
  isLoading,
  fetchDeliveryOptions,
  fetchReportDelivery,
  actionReception,
  exportToCsv
} = useReceptionFromDc()

const columns = [
  { key: 'action_header', label: 'ACTION' },
  { key: 'sj_num', label: 'SJ NUMBER' },
  { key: 'kode_dc', label: 'KODE DC' },
  { key: 'name_dc', label: 'NAME DC' },
  { key: 'delivery_date', label: 'DELIVERY DATE' },
  { key: 'kode_produk', label: 'KODE PRODUK' },
  { key: 'name_produk', label: 'NAME PRODUK' },
  { key: 'konversi', label: 'KONVERSI' },
  { key: 'name_prod_uom', label: 'UOM BIG' },
  { key: 'qty', label: 'QTY BIG' },
  { key: 'uom_child', label: 'UOM CHILD' },
  { key: 'qty_child', label: 'QTY CHILD' },
  { key: 'price', label: 'PRICE' },
  { key: 'sub_total', label: 'SUB TOTAL' },
  { key: 'reception_date', label: 'TGL TERIMA' },
  { key: 'action_detail', label: 'ACTION LINE' }
]

onMounted(async () => {
  await fetchDeliveryOptions()
})

const handleFind = async () => {
  if (!selectedSj.value) {
    toast.add({ title: 'Perhatian', description: 'Silakan pilih SJ Number terlebih dahulu', color: 'yellow' })
    return
  }
  await fetchReportDelivery(selectedSj.value)
}

const handleExport = () => {
  exportToCsv('report_terima_delivery.csv')
}

const handleTerima = async (row: any) => {
  const result = await actionReception(row.id, 1, row.aplikasi || 0)
  if (result.success && (result.data == 1 || result.data == "1")) {
    toast.add({ title: 'Sukses', description: 'Penerimaan Berhasil', color: 'emerald' })
  } else {
    toast.add({ title: 'Gagal', description: 'Gagal, Bisa diterima di tanggal sesuai delivery atau lebih', color: 'red' })
  }
  // Reload data
  if (selectedSj.value) {
    await fetchReportDelivery(selectedSj.value)
  }
}

const handleCancel = async (row: any) => {
  const result = await actionReception(row.id_detail, 3, row.aplikasi || 0)
  if (result.success && (result.data == 1 || result.data == "1")) {
    toast.add({ title: 'Sukses', description: 'Cancel Berhasil', color: 'emerald' })
  } else {
    toast.add({ title: 'Gagal', description: 'Gagal melakukan cancel', color: 'red' })
  }
  // Reload data
  if (selectedSj.value) {
    await fetchReportDelivery(selectedSj.value)
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
          <UIcon name="i-heroicons-truck" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Purchase Order DC To DC</h1>
          <p class="text-sm font-medium text-slate-500 mt-1">Data Penerimaan Pengiriman Barang (Reception)</p>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- TOOLBAR -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">FROM DC :</span>
          <USelectMenu
            v-model="selectedSj"
            :options="deliveryOptions"
            value-attribute="id"
            option-attribute="sj_num"
            placeholder="Pilih SJ Number..."
            searchable
            searchable-placeholder="Cari SJ / DC Name..."
            class="w-full sm:w-80"
            :ui="{ 
              base: 'font-semibold ring-1 ring-slate-300'
            }"
          >
            <template #label>
              {{ selectedSj ? deliveryOptions.find(o => o.id === selectedSj)?.sj_num || selectedSj : 'Pilih SJ Number...' }}
            </template>
            <!-- Custom option rendering to show delivery date and name dc -->
            <template #option="{ option }">
              <div class="flex flex-col py-1">
                <span class="font-bold text-slate-700">{{ option.sj_num }}</span>
                <span class="text-xs text-slate-500">{{ option.name_dc }} - {{ option.delivery_date }}</span>
              </div>
            </template>
          </USelectMenu>

          <UButton 
            icon="i-heroicons-magnifying-glass" 
            color="indigo" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm ml-2"
            @click="handleFind"
          >
            FIND
          </UButton>
        </div>

        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="reportList.length === 0"
          @click="handleExport"
        >
          EXPORT CSV
        </UButton>
      </div>

      <!-- DATAGRID -->
      <div class="flex-1 overflow-auto custom-scrollbar relative min-h-[400px]">
        <UTable 
          :rows="reportList" 
          :columns="columns"
          :loading="isLoading"
          :empty-state="{ icon: 'i-heroicons-truck', label: 'Silakan pilih SJ Number dan klik FIND untuk menampilkan data.' }"
          class="w-full"
          :ui="{
            wrapper: 'absolute inset-0',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <!-- ACTION HEADER -->
          <template #action_header-data="{ row }">
            <UButton 
              v-if="row.baris == 1"
              size="xs" 
              color="emerald" 
              variant="solid"
              :disabled="!!row.reception_date"
              @click="handleTerima(row)"
              class="font-bold"
            >
              TERIMA
            </UButton>
          </template>

          <!-- CONDITIONAL BLANK RENDERING FOR CHILD ROWS -->
          <template #sj_num-data="{ row }">
            <span class="font-medium" v-if="row.baris == 1">{{ row.sj_num }}</span>
          </template>
          <template #kode_dc-data="{ row }">
            <span class="font-medium" v-if="row.baris == 1">{{ row.kode_dc }}</span>
          </template>
          <template #name_dc-data="{ row }">
            <span class="font-medium text-slate-800" v-if="row.baris == 1">{{ row.name_dc }}</span>
          </template>
          <template #delivery_date-data="{ row }">
            <span class="font-medium text-slate-500" v-if="row.baris == 1">{{ row.delivery_date }}</span>
          </template>

          <!-- NUMERIC COLUMNS -->
          <template #qty-data="{ row }">
            <span class="font-mono font-medium">{{ row.qty }}</span>
          </template>
          <template #qty_child-data="{ row }">
            <span class="font-mono font-medium">{{ row.qty_child }}</span>
          </template>
          <template #price-data="{ row }">
            <span class="font-mono font-medium">{{ row.price }}</span>
          </template>
          <template #sub_total-data="{ row }">
            <span class="font-mono font-bold text-slate-800">{{ row.sub_total }}</span>
          </template>

          <template #reception_date-data="{ row }">
            <span class="font-medium text-indigo-600">{{ row.reception_date || '-' }}</span>
          </template>

          <!-- ACTION DETAIL -->
          <template #action_detail-data="{ row }">
            <UButton 
              size="xs" 
              color="rose" 
              variant="soft"
              :disabled="!!row.reception_date"
              @click="handleCancel(row)"
              class="font-bold"
            >
              CANCEL
            </UButton>
          </template>
        </UTable>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
