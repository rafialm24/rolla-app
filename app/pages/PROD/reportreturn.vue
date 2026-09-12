<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportReturn } from '~/composables/useReportReturn'

definePageMeta({
  layout: 'dashboard'
})

const {
  stores,
  dcs,
  returnData,
  returnDcData,
  isLoadingReturn,
  isLoadingReturnDc,
  fetchStores,
  fetchDcs,
  fetchReturnToko,
  fetchReturnDc,
  approveReturn,
  disassemblyReturn,
  exportCsvBase
} = useReportReturn()

const selectedStore = ref<string>('')
const selectedDc = ref<string>('')

const startDate = ref<string>('')
const endDate = ref<string>('')

const startDateDc = ref<string>('')
const endDateDc = ref<string>('')

const columnsReturn = [
  { key: 'approve_action', label: 'ACTION' },
  { key: 'kode_store', label: 'KODE STORE' },
  { key: 'name_store', label: 'NAME STORE' },
  { key: 'kode_product', label: 'KODE PRODUK' },
  { key: 'name_produk', label: 'NAMA PRODUK' },
  { key: 'name_prod_cate', label: 'KATEGORY' },
  { key: 'name_prod_uom', label: 'UOM' },
  { key: 'qty', label: 'QTY RETURN' },
  { key: 'price', label: 'PRICE' },
  { key: 'total', label: 'TOTAL' },
  { key: 'usrnm', label: 'USER' },
  { key: 'create_date', label: 'TGL BUAT' },
  { key: 'set_date', label: 'TGL SET' },
  { key: 'keterangan', label: 'KETERANGAN' },
  { key: 'approve', label: 'APPROVE' },
  { key: 'approve_by', label: 'APPROVE BY' },
  { key: 'area_desc', label: 'CABANG' }
]

const columnsReturnDc = [
  { key: 'approve_action', label: 'ACTION' },
  { key: 'kode_dc', label: 'KODE DC' },
  { key: 'name_dc', label: 'NAME DC' },
  { key: 'kode_product', label: 'KODE PRODUK' },
  { key: 'name_produk', label: 'NAMA PRODUK' },
  { key: 'name_prod_cate', label: 'KATEGORY' },
  { key: 'name_prod_uom', label: 'UOM' },
  { key: 'qty', label: 'QTY RETURN' },
  { key: 'price', label: 'PRICE' },
  { key: 'total', label: 'TOTAL' },
  { key: 'usrnm', label: 'USER' },
  { key: 'create_date', label: 'TGL BUAT' },
  { key: 'approve', label: 'APPROVE' },
  { key: 'approve_date', label: 'APPROVE DATE' }
]

onMounted(async () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const MM = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${MM}-${dd}`
  
  startDate.value = todayStr
  endDate.value = todayStr
  startDateDc.value = todayStr
  endDateDc.value = todayStr

  await fetchStores()
  await fetchDcs()
})

const handleFindReturn = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Please select both start and end date.')
    return
  }
  await fetchReturnToko(selectedStore.value, startDate.value, endDate.value)
}

const handleExportReturn = () => {
  exportCsvBase(returnData.value, columnsReturn, 'report_Return.csv')
}

const handleFindReturnDc = async () => {
  if (!startDateDc.value || !endDateDc.value) {
    alert('Please select both start and end date.')
    return
  }
  await fetchReturnDc(selectedDc.value, startDateDc.value, endDateDc.value)
}

const handleExportReturnDc = () => {
  exportCsvBase(returnDcData.value, columnsReturnDc, 'report_Return_prod.csv')
}

const handleApprove = async (id: number, maxQty: number, rowQty: number) => {
  if (rowQty > maxQty) {
    alert('Qty Revisi Melebihi Qty Set Return')
    return
  }
  const success = await approveReturn(id, rowQty)
  if (success) {
    await handleFindReturn()
    if (returnDcData.value.length > 0) {
      await handleFindReturnDc()
    }
  }
}

const handleDisassembly = async (id: number, maxQty: number, rowQty: number) => {
  if (rowQty > maxQty) {
    alert('Qty Revisi Melebihi Qty Set Return')
    return
  }
  const success = await disassemblyReturn(id, rowQty)
  if (success) {
    await handleFindReturn()
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
          <UIcon name="i-heroicons-arrow-uturn-left" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Report Return</h1>
          <p class="text-sm font-medium text-slate-500 mt-1">Data Report Return Toko & DC</p>
        </div>
      </div>
    </div>

    <!-- SECTION 1: REPORT RETURN TOKO -->
    <div class="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 bg-white">
        <h3 class="text-lg font-bold text-slate-800">Data Report Return</h3>
      </div>
      
      <!-- TOOLBAR 1 -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex items-center gap-4 flex-wrap w-full xl:w-auto">
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">STORE:</span>
            <USelectMenu
              v-model="selectedStore"
              :options="stores"
              value-attribute="id_store"
              option-attribute="name"
              placeholder="--Pilih Store--"
              searchable
              class="w-64 font-semibold"
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
            @click="handleFindReturn"
            :loading="isLoadingReturn"
          >
            FIND
          </UButton>
        </div>

        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="returnData.length === 0"
          @click="handleExportReturn"
        >
          EXPORT
        </UButton>
      </div>

      <!-- DATAGRID 1 -->
      <div class="h-[400px] w-full">
        <UTable 
          :rows="returnData" 
          :columns="columnsReturn"
          :loading="isLoadingReturn"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data report return.' }"
          class="w-full h-full"
          :ui="{
            wrapper: 'h-full overflow-auto custom-scrollbar',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <template #approve_action-data="{ row }">
            <div class="flex items-center gap-1.5" v-if="!row.approve">
              <UButton 
                size="2xs" 
                color="blue" 
                variant="solid"
                @click="handleApprove(row.id, row.max_qty || row.qty, row.qty)" 
                class="shadow-sm"
              >
                Approve
              </UButton>
              <UButton 
                size="2xs" 
                color="orange" 
                variant="solid"
                @click="handleDisassembly(row.id, row.max_qty || row.qty, row.qty)" 
                class="shadow-sm"
              >
                Disassembly
              </UButton>
            </div>
            <span v-else class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">APPROVED</span>
          </template>

          <template #qty-data="{ row }">
            <UInput v-if="!row.approve" type="number" v-model="row.qty" size="xs" class="w-20" />
            <span v-else class="font-bold">{{ row.qty }}</span>
          </template>
          
          <template #approve-data="{ row }">
            <UIcon v-if="row.approve" name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-500" />
            <UIcon v-else name="i-heroicons-x-circle" class="w-5 h-5 text-rose-500" />
          </template>

          <template #price-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price || 0) }}</span>
          </template>
          <template #total-data="{ row }">
            <span class="font-mono font-bold text-amber-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total || 0) }}</span>
          </template>
          
          <template #create_date-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.create_date ? String(row.create_date).substring(0, 10) : '' }}</span>
          </template>
          <template #set_date-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.set_date ? String(row.set_date).substring(0, 10) : '' }}</span>
          </template>
        </UTable>
      </div>
    </div>


    <!-- SECTION 2: REPORT RETURN DC -->
    <div class="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 bg-white">
        <h3 class="text-lg font-bold text-slate-800">Data Report Return From DC</h3>
      </div>
      
      <!-- TOOLBAR 2 -->
      <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex items-center gap-4 flex-wrap w-full xl:w-auto">
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">DC:</span>
            <USelectMenu
              v-model="selectedDc"
              :options="dcs"
              value-attribute="id_dc"
              option-attribute="name_dc"
              placeholder="--Pilih DC--"
              searchable
              class="w-56 font-semibold"
            />
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-600 uppercase tracking-wider shrink-0">TGL:</span>
            <UInput type="date" v-model="startDateDc" class="w-36 font-semibold" />
            <span class="text-slate-500 font-bold">~</span>
            <UInput type="date" v-model="endDateDc" class="w-36 font-semibold" />
          </div>
          
          <UButton 
            icon="i-heroicons-magnifying-glass" 
            color="primary" 
            variant="solid" 
            class="font-bold tracking-wide shadow-sm"
            @click="handleFindReturnDc"
            :loading="isLoadingReturnDc"
          >
            FIND
          </UButton>
        </div>

        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="returnDcData.length === 0"
          @click="handleExportReturnDc"
        >
          EXPORT
        </UButton>
      </div>

      <!-- DATAGRID 2 -->
      <div class="h-[400px] w-full">
        <UTable 
          :rows="returnDcData" 
          :columns="columnsReturnDc"
          :loading="isLoadingReturnDc"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data report return DC.' }"
          class="w-full h-full"
          :ui="{
            wrapper: 'h-full overflow-auto custom-scrollbar',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-4' }
          }"
        >
          <template #approve_action-data="{ row }">
            <div class="flex items-center gap-1.5" v-if="!row.approve">
              <UButton 
                size="2xs" 
                color="blue" 
                variant="solid"
                @click="handleApprove(row.id, row.max_qty || row.qty, row.qty)" 
                class="shadow-sm"
              >
                Approve
              </UButton>
              <UButton 
                size="2xs" 
                color="orange" 
                variant="solid"
                @click="handleDisassembly(row.id, row.max_qty || row.qty, row.qty)" 
                class="shadow-sm"
              >
                Disassembly
              </UButton>
            </div>
            <span v-else class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">APPROVED</span>
          </template>

          <template #qty-data="{ row }">
            <UInput v-if="!row.approve" type="number" v-model="row.qty" size="xs" class="w-20" />
            <span v-else class="font-bold">{{ row.qty }}</span>
          </template>
          
          <template #approve-data="{ row }">
            <UIcon v-if="row.approve" name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-500" />
            <UIcon v-else name="i-heroicons-x-circle" class="w-5 h-5 text-rose-500" />
          </template>

          <template #price-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.price || 0) }}</span>
          </template>
          <template #total-data="{ row }">
            <span class="font-mono font-bold text-amber-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total || 0) }}</span>
          </template>
          
          <template #create_date-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.create_date ? String(row.create_date).substring(0, 10) : '' }}</span>
          </template>
          <template #approve_date-data="{ row }">
            <span class="font-medium text-slate-700">{{ row.approve_date ? String(row.approve_date).substring(0, 10) : '' }}</span>
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
