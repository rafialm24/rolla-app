<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportDelivery } from '~/composables/useReportDelivery'

definePageMeta({
  layout: 'dashboard'
})

const {
  clients,
  deliveryData,
  deliveryWoData,
  isLoadingDelivery,
  isLoadingWo,
  isExportingSummary,
  fetchClients,
  fetchDelivery,
  fetchDeliveryWo,
  exportSummary,
  exportCsvBase
} = useReportDelivery()

const selectedClient = ref<string>('')
const selectedClientWo = ref<string>('')

const startDate = ref<string>('')
const endDate = ref<string>('')

const startDateWo = ref<string>('')
const endDateWo = ref<string>('')

const columnsDelivery = [
  { key: 'sj_num', label: 'SJ NUMBER' },
  { key: 'tgl_kirim', label: 'TGL KIRIM' },
  { key: 'tgl_terima', label: 'TGL TERIMA' },
  { key: 'name_prod', label: 'NAMA PROD' },
  { key: 'kode_store', label: 'KODE STORE' },
  { key: 'name_store', label: 'NAME STORE' },
  { key: 'kode_produk', label: 'KODE PRODUK' },
  { key: 'name_produk', label: 'NAMA PRODUK' },
  { key: 'name_prod_cate', label: 'KATEGORI' },
  { key: 'uom', label: 'UOM' },
  { key: 'konversi', label: 'KONVERSI' },
  { key: 'price_bom', label: 'HARGA BELI' },
  { key: 'price', label: 'HARGA' },
  { key: 'qty_delivery', label: 'QTY KIRIM' },
  { key: 'qty_free', label: 'DISC' },
  { key: 'qty_konversi', label: 'QTY KONVERSI' },
  { key: 'total_delivery', label: 'TOTAL KIRIM' },
  { key: 'qty_terima', label: 'QTY TERIMA' },
  { key: 'qty_reject', label: 'QTY REJECT' },
  { key: 'qty_terima_fix', label: 'QTY TERIMA FIX' },
  { key: 'total_terima_stlh_reject', label: 'TOTAL TERIMA STL REJECT' },
  { key: 'total_terima', label: 'TOTAL TERIMA' }
]

const columnsWo = [
  { key: 'wo_number', label: 'SJ NUMBER' },
  { key: 'tgl_kirim', label: 'TGL KIRIM' },
  { key: 'kode_store', label: 'KODE STORE' },
  { key: 'name_store', label: 'NAME STORE' },
  { key: 'kode_produk', label: 'KODE PRODUK' },
  { key: 'name_produk', label: 'NAMA PRODUK' },
  { key: 'uom', label: 'UOM' },
  { key: 'name_prod_cate', label: 'KATEGORY' },
  { key: 'price_bom', label: 'HARGA BELI' },
  { key: 'price', label: 'HARGA' },
  { key: 'qty_delivery', label: 'QTY' },
  { key: 'qty_free', label: 'QTY KIRIM' },
  { key: 'pricex', label: 'PRICE KIRIM' },
  { key: 'total_delivery', label: 'TOTAL KIRIM' }
]

onMounted(async () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const MM = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${MM}-${dd}`
  
  startDate.value = todayStr
  endDate.value = todayStr
  startDateWo.value = todayStr
  endDateWo.value = todayStr

  await fetchClients()
})

const handleFindDelivery = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end date.')
    return
  }
  let v_id_client = ""
  let v_set_id = ""
  if (selectedClient.value) {
    const parts = String(selectedClient.value).split(';')
    v_id_client = parts[0] || ""
    v_set_id = parts[1] || ""
  }
  await fetchDelivery(v_id_client, v_set_id, startDate.value, endDate.value)
}

const handleExportDelivery = () => {
  exportCsvBase(deliveryData.value, columnsDelivery, 'report_delivery.csv')
}

const handleExportSummary = async () => {
  let v_id_client = ""
  let v_set_id = ""
  if (selectedClient.value) {
    const parts = String(selectedClient.value).split(';')
    v_id_client = parts[0] || ""
    v_set_id = parts[1] || ""
  }
  await exportSummary(v_id_client, v_set_id, startDate.value, endDate.value)
}

const handleFindWo = async () => {
  if (!startDateWo.value || !endDateWo.value) {
    alert('Please select both start and end date.')
    return
  }
  let v_id_client = ""
  if (selectedClientWo.value) {
    v_id_client = selectedClientWo.value
  }
  await fetchDeliveryWo(v_id_client, startDateWo.value, endDateWo.value)
}

const handleExportWo = () => {
  exportCsvBase(deliveryWoData.value, columnsWo, 'report_delivery_Jo.csv')
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-inner">
          <UIcon name="i-heroicons-truck" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Report Delivery Distributor</h1>
          <p class="text-sm font-medium text-slate-500 mt-1">Data Report Delivery & Work Order</p>
        </div>
      </div>
    </div>

    <!-- SECTION 1: REPORT DELIVERY -->
    <div class="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 bg-white">
        <h3 class="text-lg font-bold text-slate-800">Data Report Delivery</h3>
      </div>
      
      <!-- TOOLBAR 1 -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex items-center gap-4 flex-wrap w-full xl:w-auto">
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">CLIENT:</span>
            <USelectMenu
              v-model="selectedClient"
              :options="clients"
              value-attribute="id_client"
              option-attribute="name"
              placeholder="--Pilih Client--"
              searchable
              class="w-56 font-semibold"
            />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">TGL:</span>
            <UInput type="date" v-model="startDate" class="w-36 font-semibold" />
            <span class="text-slate-500 font-bold">~</span>
            <UInput type="date" v-model="endDate" class="w-36 font-semibold" />
          </div>
          
          <UButton 
            icon="i-heroicons-magnifying-glass" 
            color="primary" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm"
            @click="handleFindDelivery"
            :loading="isLoadingDelivery"
          >
            FIND
          </UButton>
        </div>

        <div class="flex gap-2">
          <UButton 
            icon="i-heroicons-document-arrow-down" 
            color="emerald" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm"
            :disabled="deliveryData.length === 0"
            @click="handleExportDelivery"
          >
            EXPORT
          </UButton>
          <UButton 
            icon="i-heroicons-document-chart-bar" 
            color="sky" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm"
            @click="handleExportSummary"
            :loading="isExportingSummary"
          >
            EXPORT SUMMARY
          </UButton>
        </div>
      </div>

      <!-- DATAGRID 1 -->
      <div class="h-[400px] w-full">
        <UTable 
          :rows="deliveryData" 
          :columns="columnsDelivery"
          :loading="isLoadingDelivery"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data report delivery.' }"
          class="w-full h-full"
          :ui="{
            wrapper: 'h-full overflow-auto custom-scrollbar',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <!-- Date Formatting -->
          <template #tgl_kirim-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.tgl_kirim ? String(row.tgl_kirim).replace('T', ' ').substring(0, 19) : '' }}</span>
          </template>
          <template #tgl_terima-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.tgl_terima ? String(row.tgl_terima).replace('T', ' ').substring(0, 19) : '' }}</span>
          </template>

          <!-- Strikethrough for qty_free (DISC) like formatline in CSHTML -->
          <template #qty_free-data="{ row }">
            <span class="font-mono font-medium line-through text-slate-400">{{ row.qty_free || 0 }}</span>
          </template>

          <!-- Numeric Formatting -->
          <template #price_bom-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price_bom || 0) }}</span>
          </template>
          <template #price-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price || 0) }}</span>
          </template>
          <template #total_delivery-data="{ row }">
            <span class="font-mono font-bold text-indigo-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_delivery || 0) }}</span>
          </template>
          <template #total_terima_stlh_reject-data="{ row }">
            <span class="font-mono font-bold text-rose-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_terima_stlh_reject || 0) }}</span>
          </template>
          <template #total_terima-data="{ row }">
            <span class="font-mono font-bold text-emerald-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_terima || 0) }}</span>
          </template>
        </UTable>
      </div>
    </div>


    <!-- SECTION 2: REPORT DELIVERY JO -->
    <div class="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 bg-white">
        <h3 class="text-lg font-bold text-slate-800">Data Report Delivery JO</h3>
      </div>
      
      <!-- TOOLBAR 2 -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex items-center gap-4 flex-wrap w-full xl:w-auto">
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">CLIENT:</span>
            <USelectMenu
              v-model="selectedClientWo"
              :options="clients"
              value-attribute="id_client"
              option-attribute="name"
              placeholder="--Pilih Client--"
              searchable
              class="w-56 font-semibold"
            />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">TGL:</span>
            <UInput type="date" v-model="startDateWo" class="w-36 font-semibold" />
            <span class="text-slate-500 font-bold">~</span>
            <UInput type="date" v-model="endDateWo" class="w-36 font-semibold" />
          </div>
          
          <UButton 
            icon="i-heroicons-magnifying-glass" 
            color="primary" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm"
            @click="handleFindWo"
            :loading="isLoadingWo"
          >
            FIND
          </UButton>
        </div>

        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="deliveryWoData.length === 0"
          @click="handleExportWo"
        >
          EXPORT
        </UButton>
      </div>

      <!-- DATAGRID 2 -->
      <div class="h-[400px] w-full">
        <UTable 
          :rows="deliveryWoData" 
          :columns="columnsWo"
          :loading="isLoadingWo"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data report delivery JO.' }"
          class="w-full h-full"
          :ui="{
            wrapper: 'h-full overflow-auto custom-scrollbar',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <!-- Date Formatting -->
          <template #tgl_kirim-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.tgl_kirim ? String(row.tgl_kirim).replace('T', ' ').substring(0, 19) : '' }}</span>
          </template>

          <!-- Numeric Formatting -->
          <template #price_bom-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price_bom || 0) }}</span>
          </template>
          <template #price-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price || 0) }}</span>
          </template>
          <template #pricex-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.pricex || 0) }}</span>
          </template>
          <template #total_delivery-data="{ row }">
            <span class="font-mono font-bold text-indigo-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_delivery || 0) }}</span>
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
