<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDiscountList } from '~/composables/useDiscountList'
import { useProduksi } from '~/composables/useProduksi'

definePageMeta({ layout: 'dashboard' })

const { activeProdId } = useProduksi()
const {
  storeList,
  reportDiscountList,
  isLoadingReport,
  isLoadingStore,
  fetchStoreCombo,
  fetchReportDiscount,
  exportReportDiscountCsv
} = useDiscountList()

// ── Filter State ──────────────────────────────────────────────
const selectedStore = ref<any>(null)
const startDate = ref('')
const endDate = ref('')

// ── Columns ───────────────────────────────────────────────────
const columns = [
  { key: 'sj_num',         label: 'SJ NUMBER'   },
  { key: 'kode_store',     label: 'KODE STORE'  },
  { key: 'name_store',     label: 'NAME STORE'  },
  { key: 'kode_produk',   label: 'KODE PRODUK' },
  { key: 'name_produk',    label: 'NAMA PRODUK' },
  { key: 'name_prod_cate', label: 'KATEGORI'    },
  { key: 'uom',            label: 'UOM'         },
  { key: 'qty',            label: 'QTY'         },
  { key: 'price',          label: 'PRICE'       },
  { key: 'diskon',         label: 'DISCOUNT'    },
  { key: 'total',          label: 'TOTAL'       },
  { key: 'usrnm',          label: 'USER'        },
  { key: 'create_date',    label: 'TGL'         },
  { key: 'approve',        label: 'APPROVE'     },
]

// ── Helpers ───────────────────────────────────────────────────
const fmtRp = (v: any) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(v) || 0)

const fmtDate = (v: any) =>
  v ? String(v).replace('T', ' ').substring(0, 10) : '-'

const getLocalToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── Summary ───────────────────────────────────────────────────
const totalQty  = computed(() => reportDiscountList.value.reduce((s, r) => s + Number(r.qty    || 0), 0))
const totalDisk = computed(() => reportDiscountList.value.reduce((s, r) => s + Number(r.diskon || 0), 0))
const totalAmt  = computed(() => reportDiscountList.value.reduce((s, r) => s + Number(r.total  || 0), 0))

// ── Actions ───────────────────────────────────────────────────
const handleFind = async () => {
  if (!startDate.value || !endDate.value) {
    alert('Pilih tanggal mulai dan tanggal akhir terlebih dahulu.')
    return
  }
  const storeVal = selectedStore.value?.id ? String(selectedStore.value.id) : ''
  await fetchReportDiscount(storeVal, startDate.value, endDate.value)
}

const handleExport = () => {
  exportReportDiscountCsv(reportDiscountList.value, columns, 'report_discount.csv')
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  const today = getLocalToday()
  startDate.value = today
  endDate.value   = today
  await fetchStoreCombo()
})

watch(activeProdId, async () => {
  await fetchStoreCombo()
  reportDiscountList.value = []
})
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans flex flex-col gap-6">

    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl bg-white/80 p-6 rounded-[2rem] shadow-sm border border-white">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <UIcon name="i-heroicons-receipt-percent" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Report Discount</h1>
          <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Data Report Discount Produksi</p>
        </div>
      </div>
    </div>

    <!-- CARD UTAMA -->
    <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">

      <!-- Toolbar Filter -->
      <div class="p-5 border-b border-slate-100 bg-slate-50/60">
        <div class="flex flex-col xl:flex-row gap-4 items-start xl:items-end justify-between">

          <div class="flex flex-wrap gap-4 items-end">

            <!-- Store -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Store</label>
              <USelectMenu
                v-model="selectedStore"
                :options="storeList"
                value-attribute="id"
                option-attribute="name"
                placeholder="-- Semua Store --"
                searchable
                :loading="isLoadingStore"
                class="w-64"
                :ui="{ base: 'font-semibold text-slate-700' }"
              />
            </div>

            <!-- Date Range -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tanggal</label>
              <div class="flex items-center gap-2">
                <UInput type="date" v-model="startDate" size="md"
                  :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }" />
                <span class="text-slate-400 font-bold">~</span>
                <UInput type="date" v-model="endDate" size="md"
                  :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }" />
              </div>
            </div>

            <!-- FIND -->
            <UButton
              icon="i-heroicons-magnifying-glass"
              color="primary"
              variant="solid"
              size="md"
              class="font-black tracking-wider uppercase shadow-md shadow-blue-500/20 rounded-xl px-6 transition-all hover:-translate-y-0.5"
              :loading="isLoadingReport"
              @click="handleFind"
            >FIND</UButton>
          </div>

          <!-- EXPORT -->
          <UButton
            icon="i-heroicons-document-arrow-down"
            color="emerald"
            variant="solid"
            size="md"
            class="font-black tracking-wider uppercase shadow-md shadow-emerald-500/20 rounded-xl px-6 transition-all hover:-translate-y-0.5"
            :disabled="reportDiscountList.length === 0"
            @click="handleExport"
          >EXPORT CSV</UButton>
        </div>
      </div>

      <!-- Summary Badges -->
      <Transition name="fade">
        <div v-if="reportDiscountList.length > 0" class="px-5 py-3 border-b border-slate-100 bg-white flex flex-wrap gap-3 items-center">
          <div class="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Rows</span>
            <span class="text-sm font-black text-slate-700">{{ reportDiscountList.length.toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-1.5">
            <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Total QTY</span>
            <span class="text-sm font-black text-indigo-700">{{ totalQty.toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex items-center gap-2 bg-rose-50 rounded-xl px-3 py-1.5">
            <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Total Discount</span>
            <span class="text-sm font-black text-rose-700">{{ fmtRp(totalDisk) }}</span>
          </div>
          <div class="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-1.5">
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Grand Total</span>
            <span class="text-sm font-black text-emerald-700">{{ fmtRp(totalAmt) }}</span>
          </div>
        </div>
      </Transition>

      <!-- Table Area -->
      <div class="flex-1 overflow-hidden">

        <!-- Loading -->
        <div v-if="isLoadingReport" class="py-20 text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 animate-spin mx-auto mb-3 text-rose-400" />
          <p class="text-sm font-semibold text-slate-400">Memuat data report discount...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="reportDiscountList.length === 0" class="py-20 text-center">
          <UIcon name="i-heroicons-receipt-percent" class="w-14 h-14 mx-auto mb-3 text-slate-200" />
          <p class="text-sm font-semibold text-slate-400">Belum ada data. Gunakan filter lalu klik <span class="font-black text-blue-500">FIND</span>.</p>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-auto custom-scrollbar" style="max-height: calc(100vh - 400px)">
          <table class="w-full text-xs whitespace-nowrap">
            <thead class="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
              <tr>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">#</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">SJ NUMBER</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">KODE STORE</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">NAME STORE</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">KODE PRODUK</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">NAMA PRODUK</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">KATEGORI</th>
                <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM</th>
                <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">QTY</th>
                <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">PRICE</th>
                <th class="px-4 py-3 text-right font-bold text-rose-500 uppercase tracking-wider text-[10px]">DISCOUNT</th>
                <th class="px-4 py-3 text-right font-bold text-emerald-600 uppercase tracking-wider text-[10px]">TOTAL</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">USER</th>
                <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">TGL</th>
                <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">APPROVE</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in reportDiscountList"
                :key="i"
                class="border-b border-slate-50 hover:bg-rose-50/30 transition-colors"
              >
                <td class="px-4 py-2.5 text-slate-400 font-semibold">{{ i + 1 }}</td>
                <td class="px-4 py-2.5 font-extrabold text-slate-800">{{ row.sj_num }}</td>
                <td class="px-4 py-2.5 font-semibold text-slate-500">{{ row.kode_store }}</td>
                <td class="px-4 py-2.5 font-medium text-slate-700">{{ row.name_store }}</td>
                <td class="px-4 py-2.5 font-semibold text-slate-500">{{ row.kode_produk }}</td>
                <td class="px-4 py-2.5 font-bold text-slate-800">{{ row.name_produk }}</td>
                <td class="px-4 py-2.5 text-slate-500">{{ row.name_prod_cate }}</td>
                <td class="px-4 py-2.5 text-center">
                  <span class="inline-block bg-slate-100 text-slate-600 font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">{{ row.uom }}</span>
                </td>
                <td class="px-4 py-2.5 text-right font-black text-slate-700">{{ Number(row.qty || 0).toLocaleString('id-ID') }}</td>
                <td class="px-4 py-2.5 text-right font-medium text-slate-600">{{ fmtRp(row.price) }}</td>
                <td class="px-4 py-2.5 text-right font-black text-rose-600 bg-rose-50/40">{{ fmtRp(row.diskon) }}</td>
                <td class="px-4 py-2.5 text-right font-black text-emerald-700 bg-emerald-50/40">{{ fmtRp(row.total) }}</td>
                <td class="px-4 py-2.5 text-slate-600 font-medium">{{ row.usrnm }}</td>
                <td class="px-4 py-2.5 text-slate-500 font-medium">{{ fmtDate(row.create_date) }}</td>
                <td class="px-4 py-2.5 text-center">
                  <UBadge
                    v-if="row.approve === true || row.approve === 1"
                    color="emerald"
                    variant="solid"
                    size="xs"
                    class="font-black uppercase tracking-wider text-[9px] shadow-sm shadow-emerald-500/20"
                  >Approved</UBadge>
                  <UBadge
                    v-else
                    color="orange"
                    variant="soft"
                    size="xs"
                    class="font-black uppercase tracking-wider text-[9px]"
                  >Pending</UBadge>
                </td>
              </tr>
            </tbody>
            <!-- Grand Total Footer -->
            <tfoot class="bg-slate-100/80 border-t-2 border-slate-300 sticky bottom-0 z-10">
              <tr>
                <td colspan="8" class="px-4 py-2.5 text-right text-[10px] font-black text-slate-600 uppercase tracking-widest">GRAND TOTAL</td>
                <td class="px-4 py-2.5 text-right font-black text-slate-800">{{ totalQty.toLocaleString('id-ID') }}</td>
                <td class="px-4 py-2.5"></td>
                <td class="px-4 py-2.5 text-right font-black text-rose-700 bg-rose-100/60">{{ fmtRp(totalDisk) }}</td>
                <td class="px-4 py-2.5 text-right font-black text-emerald-800 bg-emerald-100/60">{{ fmtRp(totalAmt) }}</td>
                <td colspan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
