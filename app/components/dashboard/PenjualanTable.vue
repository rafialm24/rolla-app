<template>
  <div class="space-y-8">
    
    <!-- 1. Data Penjualan (Store) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Master: Penjualan Store -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-white font-serif">Data Penjualan (Store)</h3>
          <div class="flex items-center space-x-2">
            <input type="date" v-model="storeStartDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
            <span class="text-slate-500">-</span>
            <input type="date" v-model="storeEndDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
            <button @click="fetchStore" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50" :disabled="pendingStore">CEK</button>
          </div>
        </div>
        
        <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
          <div v-if="pendingStore" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
          
          <table class="w-full text-sm text-left text-slate-300 border-collapse relative">
            <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Action</th>
                <th class="px-4 py-3">Kode Store</th>
                <th class="px-4 py-3">Nama Store</th>
                <th class="px-4 py-3 text-right">Omset</th>
                <th class="px-4 py-3 text-right">Retur</th>
                <th class="px-4 py-3 text-right">Persen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="storeData.length === 0 && !pendingStore">
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">Tidak ada data penjualan.</td>
              </tr>
              <tr v-for="(item, idx) in storeData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors" :class="{'bg-sky-900/20': selectedStoreId === item.id_store}">
                <td class="px-4 py-2">
                  <button @click="selectStore(item.id_store)" class="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2 py-1 rounded transition-colors">Show</button>
                </td>
                <td class="px-4 py-2 font-mono">{{ item.kode_store }}</td>
                <td class="px-4 py-2">{{ item.name_store }}</td>
                <td class="px-4 py-2 text-right text-sky-300">{{ formatNumber(item.omset) }}</td>
                <td class="px-4 py-2 text-right text-rose-300">{{ formatNumber(item.price) }}</td>
                <td class="px-4 py-2 text-right font-bold">{{ formatNumber(item.persen) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail: Penjualan Store -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="border-b border-slate-700 px-5 py-4">
          <h3 class="text-lg font-bold text-white font-serif uppercase">Detail Penjualan (Store)</h3>
        </div>
        
        <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
          <div v-if="pendingStoreDetail" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>

          <table class="w-full text-sm text-left text-slate-300 border-collapse">
            <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Nama Produk</th>
                <th class="px-4 py-3">UOM</th>
                <th class="px-4 py-3 text-right">Qty</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!selectedStoreId && storeDetailData.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-slate-500">Pilih store untuk melihat detail.</td>
              </tr>
              <tr v-for="(item, idx) in storeDetailData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td class="px-4 py-2">
                  <div class="font-medium">{{ item.name_produk }}</div>
                  <div class="text-xs text-slate-500 font-mono">{{ item.kode_produk }}</div>
                </td>
                <td class="px-4 py-2">{{ item.name_prod_uom }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.qty) }}</td>
                <td class="px-4 py-2 text-right text-emerald-300">{{ formatNumber(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 2. Data Penjualan per Cabang -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Master: Penjualan Cabang -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-white font-serif">Data Penjualan (Cabang)</h3>
          <div class="flex items-center space-x-2">
            <input type="date" v-model="cabangStartDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
            <span class="text-slate-500">-</span>
            <input type="date" v-model="cabangEndDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
            <button @click="fetchCabang" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50" :disabled="pendingCabang">CEK</button>
          </div>
        </div>
        
        <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
          <div v-if="pendingCabang" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
          
          <table class="w-full text-sm text-left text-slate-300 border-collapse relative">
            <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Action</th>
                <th class="px-4 py-3">Kode Cabang</th>
                <th class="px-4 py-3">Nama Cabang</th>
                <th class="px-4 py-3 text-right">Omset</th>
                <th class="px-4 py-3 text-right">Retur</th>
                <th class="px-4 py-3 text-right">Persen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cabangData.length === 0 && !pendingCabang">
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">Tidak ada data cabang.</td>
              </tr>
              <tr v-for="(item, idx) in cabangData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors" :class="{'bg-amber-900/20': selectedCabangId === item.id_cabang}">
                <td class="px-4 py-2">
                  <button @click="selectCabang(item.id_cabang)" class="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded transition-colors">Show</button>
                </td>
                <td class="px-4 py-2 font-mono">{{ item.kode_cab }}</td>
                <td class="px-4 py-2">{{ item.name_cabang }}</td>
                <td class="px-4 py-2 text-right text-sky-300">{{ formatNumber(item.omset) }}</td>
                <td class="px-4 py-2 text-right text-rose-300">{{ formatNumber(item.retur) }}</td>
                <td class="px-4 py-2 text-right font-bold">{{ formatNumber(item.persen) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail: Penjualan Cabang -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="border-b border-slate-700 px-5 py-4">
          <h3 class="text-lg font-bold text-white font-serif uppercase">Detail Penjualan (Cabang)</h3>
        </div>
        
        <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
          <div v-if="pendingCabangDetail" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>

          <table class="w-full text-sm text-left text-slate-300 border-collapse">
            <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Nama Produk</th>
                <th class="px-4 py-3">UOM</th>
                <th class="px-4 py-3 text-right">Qty</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!selectedCabangId && cabangDetailData.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-slate-500">Pilih cabang untuk melihat detail.</td>
              </tr>
              <tr v-for="(item, idx) in cabangDetailData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td class="px-4 py-2">
                  <div class="font-medium">{{ item.name_produk }}</div>
                </td>
                <td class="px-4 py-2">{{ item.name_prod_uom }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.qty) }}</td>
                <td class="px-4 py-2 text-right text-emerald-300">{{ formatNumber(item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  prodId: {
    type: Number,
    required: true
  }
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

// State
const storeStartDate = ref('')
const storeEndDate = ref('')
const selectedStoreId = ref<number | null>(null)

const cabangStartDate = ref('')
const cabangEndDate = ref('')
const selectedCabangId = ref<number | null>(null)

onMounted(() => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const fDayStr = firstDay.toISOString().split('T')[0]
  const nDayStr = now.toISOString().split('T')[0]
  
  storeStartDate.value = fDayStr; storeEndDate.value = nDayStr
  cabangStartDate.value = fDayStr; cabangEndDate.value = nDayStr
  
  fetchStore()
  fetchCabang()
})

// === Store logic ===
const storeData = ref<any[]>([])
const pendingStore = ref(false)
const storeDetailData = ref<any[]>([])
const pendingStoreDetail = ref(false)

const fetchStore = async () => {
  if (!storeStartDate.value || !storeEndDate.value) return
  pendingStore.value = true; selectedStoreId.value = null; storeDetailData.value = []
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/return-max`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: storeStartDate.value, v_end_date: storeEndDate.value }
    })
    storeData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch store data:', err)
  } finally {
    pendingStore.value = false
  }
}

const selectStore = async (id: number) => {
  selectedStoreId.value = id; pendingStoreDetail.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/penjualan-detail`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: storeStartDate.value, v_end_date: storeEndDate.value, v_store: id }
    })
    storeDetailData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch store detail:', err)
  } finally {
    pendingStoreDetail.value = false
  }
}

// === Cabang logic ===
const cabangData = ref<any[]>([])
const pendingCabang = ref(false)
const cabangDetailData = ref<any[]>([])
const pendingCabangDetail = ref(false)

const fetchCabang = async () => {
  if (!cabangStartDate.value || !cabangEndDate.value) return
  pendingCabang.value = true; selectedCabangId.value = null; cabangDetailData.value = []
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/sales-cabang`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: cabangStartDate.value, v_end_date: cabangEndDate.value }
    })
    cabangData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch cabang data:', err)
  } finally {
    pendingCabang.value = false
  }
}

const selectCabang = async (id: number) => {
  selectedCabangId.value = id; pendingCabangDetail.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/sales-cabang-detail`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: cabangStartDate.value, v_end_date: cabangEndDate.value, v_cab: id }
    })
    cabangDetailData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch cabang detail:', err)
  } finally {
    pendingCabangDetail.value = false
  }
}

watch(() => props.prodId, () => {
  fetchStore(); fetchCabang()
})

const formatNumber = (num: any) => {
  if (!num) return '0'
  return Number(num).toLocaleString('id-ID')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 1); }
</style>
