<template>
  <div class="space-y-8">
    
    <!-- Top Section: Data Pembelian (Master-Detail) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Master Table -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-white font-serif">Data Pembelian (Item)</h3>
          <div class="flex items-center space-x-2">
            <input type="date" v-model="startDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
            <span class="text-slate-500">-</span>
            <input type="date" v-model="endDate" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500 w-32" />
            <button @click="fetchMaster" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50" :disabled="pendingMaster">CEK</button>
          </div>
        </div>
        
        <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
          <div v-if="pendingMaster" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
          
          <table class="w-full text-sm text-left text-slate-300 border-collapse relative">
            <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Action</th>
                <th class="px-4 py-3">Nama Produk</th>
                <th class="px-4 py-3 text-right">Qty</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="masterData.length === 0 && !pendingMaster">
                <td colspan="4" class="px-4 py-8 text-center text-slate-500">Tidak ada data pembelian.</td>
              </tr>
              <tr v-for="(item, idx) in masterData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors" :class="{'bg-sky-900/20': selectedItemId === item.id_produk}">
                <td class="px-4 py-2">
                  <button @click="selectItem(item.id_produk)" class="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2 py-1 rounded transition-colors">Show</button>
                </td>
                <td class="px-4 py-2 font-medium">{{ item.name_produk }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.qty) }}</td>
                <td class="px-4 py-2 text-right text-emerald-300">{{ formatNumber(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail Table -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div class="border-b border-slate-700 px-5 py-4">
          <h3 class="text-lg font-bold text-white font-serif uppercase">Detail Pembelian (Item)</h3>
        </div>
        
        <div class="p-0 overflow-y-auto custom-scrollbar h-96 relative">
          <div v-if="pendingDetail" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>

          <table class="w-full text-sm text-left text-slate-300 border-collapse">
            <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Bukti Terima</th>
                <th class="px-4 py-3">Nama Supplier</th>
                <th class="px-4 py-3 text-right">Qty</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!selectedItemId && detailData.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-slate-500">Pilih item untuk melihat detail.</td>
              </tr>
              <tr v-for="(item, idx) in detailData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td class="px-4 py-2 font-mono">{{ item.bukti_terima }}</td>
                <td class="px-4 py-2">{{ item.name_suplier }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.qty) }}</td>
                <td class="px-4 py-2 text-right text-emerald-300">{{ formatNumber(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Data Pembelian All -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div class="border-b border-slate-700 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 class="text-lg font-bold text-white font-serif">Data Pembelian All</h3>
        
        <div class="flex items-center space-x-2">
          <!-- Note: API expects v_periode (e.g. 2026-08) for this endpoint -->
          <input type="month" v-model="allPeriode" class="bg-slate-900 border border-slate-600 text-slate-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:border-sky-500" />
          <button @click="fetchAllData" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-md transition-colors disabled:opacity-50" :disabled="pendingAll">CEK</button>
        </div>
      </div>
      
      <div class="p-0 overflow-y-auto custom-scrollbar h-[400px] relative">
        <div v-if="pendingAll" class="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
        
        <table class="w-full text-sm text-left text-slate-300 border-collapse relative">
          <thead class="text-xs uppercase bg-slate-700 text-slate-300 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3">Kode Produk</th>
                <th class="px-4 py-3 min-w-[200px]">Nama Produk</th>
                <th class="px-4 py-3">Kategori</th>
                <th class="px-4 py-3">Uom</th>
                <th class="px-4 py-3 text-right">Stock Awal</th>
                <th class="px-4 py-3 text-right">Qty Pem</th>
                <th class="px-4 py-3 text-right">Pembelian</th>
                <th class="px-4 py-3 text-right">Qty Keb</th>
                <th class="px-4 py-3 text-right">Kebutuhan</th>
                <th class="px-4 py-3 text-right">Selisih</th>
                <th class="px-4 py-3 text-right">Stock</th>
                <th class="px-4 py-3 text-right">Price Stock</th>
                <th class="px-4 py-3 text-right">Pemakaian Bahan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="allData.length === 0 && !pendingAll">
                <td colspan="13" class="px-4 py-8 text-center text-slate-500">Tidak ada data untuk periode ini.</td>
              </tr>
              <tr v-for="(item, idx) in allData" :key="idx" class="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td class="px-4 py-2 font-mono text-slate-400">{{ item.kode_produk }}</td>
                <td class="px-4 py-2 font-medium">{{ item.name_produk }}</td>
                <td class="px-4 py-2 uppercase text-xs">{{ item.name_prod_cate }}</td>
                <td class="px-4 py-2 uppercase text-xs">{{ item.name_prod_uom }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.stock_awal) }}</td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.qty_pem) }}</td>
                <td class="px-4 py-2 text-right text-emerald-300 min-w-[120px]">
                  <div class="text-[10px] text-slate-500">Rp</div>
                  {{ formatNumber(item.pembelian) }}
                </td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.qty_keb) }}</td>
                <td class="px-4 py-2 text-right text-emerald-300 min-w-[120px]">
                  <div class="text-[10px] text-slate-500">Rp</div>
                  {{ formatNumber(item.kebutuhan) }}
                </td>
                <td class="px-4 py-2 text-right font-bold min-w-[120px]" :class="item.selisih < 0 ? 'text-rose-400' : 'text-emerald-400'">
                  <div class="text-[10px] text-slate-500">Rp</div>
                  {{ formatNumber(item.selisih) }}
                </td>
                <td class="px-4 py-2 text-right">{{ formatNumber(item.stock) }}</td>
                <td class="px-4 py-2 text-right text-sky-300 min-w-[120px]">
                  <div class="text-[10px] text-slate-500">Rp</div>
                  {{ formatNumber(item.price_qty_stock) }}
                </td>
                <td class="px-4 py-2 text-right font-medium text-amber-300">{{ formatNumber(item.hasil) }}</td>
              </tr>
          </tbody>
        </table>
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
const startDate = ref('')
const endDate = ref('')
const selectedItemId = ref<number | null>(null)
const allPeriode = ref('')

onMounted(() => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const formatYMD = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  startDate.value = formatYMD(firstDay)
  endDate.value = formatYMD(now)
  
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const periode = `${now.getFullYear()}-${mm}`
  
  allPeriode.value = periode
  
  fetchMaster()
  fetchAllData()
})

// === Master/Detail Logic ===
const masterData = ref<any[]>([])
const pendingMaster = ref(false)
const detailData = ref<any[]>([])
const pendingDetail = ref(false)

const fetchMaster = async () => {
  if (!startDate.value || !endDate.value) return
  
  pendingMaster.value = true; selectedItemId.value = null; detailData.value = []
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/pembelian`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: startDate.value, v_end_date: endDate.value }
    })
    masterData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch pembelian master:', err)
  } finally {
    pendingMaster.value = false
  }
}

const selectItem = async (id: number) => {
  selectedItemId.value = id; pendingDetail.value = true
  
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/pembelian-detail`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_prod_id: props.prodId, v_start_date: startDate.value, v_end_date: endDate.value, v_id_item: id }
    })
    detailData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch pembelian detail:', err)
  } finally {
    pendingDetail.value = false
  }
}

// === All Data Logic ===
const allData = ref<any[]>([])
const pendingAll = ref(false)

const fetchAllData = async () => {
  if (!allPeriode.value) return
  pendingAll.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/report-produksi/data-pembelian`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` },
      params: { v_id_prod: props.prodId, v_periode: allPeriode.value }
    })
    allData.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch data pembelian all:', err)
  } finally {
    pendingAll.value = false
  }
}

watch(() => props.prodId, () => {
  fetchMaster(); fetchAllData()
})

const formatNumber = (num: any) => {
  if (!num) return '0'
  return Number(num).toLocaleString('id-ID')
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID')
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 1); }
</style>
