<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReportDaily } from '~/composables/useReportDaily'

definePageMeta({ layout: 'dashboard' })

const {
  dailyList, dailyItemList, dailyMatrialList, dailyAdvList, dailySpList,
  isLoadingDaily, isLoadingDailyItem, isLoadingDailyMatrial,
  fetchDaily, fetchDailyItem, fetchDailyMatrial,
  exportCsv, sumField,
} = useReportDaily()

// ── Date State ────────────────────────────────────────────────
const s1Start = ref(''); const s1End = ref('')
const s2Start = ref(''); const s2End = ref('')
const s3Start = ref(''); const s3End = ref('')

const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const validateRange = (start: string, end: string): boolean => {
  if (!start || !end) { alert('Start Date dan End Date wajib diisi'); return false }
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 86400000
  if (diff < 0) { alert('End Date tidak boleh lebih kecil dari Start Date'); return false }
  if (diff > 2) { alert('Maksimal selisih tanggal hanya 2 hari'); return false }
  return true
}

const autoEndDate = (start: string): string => {
  const d = new Date(start); d.setDate(d.getDate() + 2)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// ── Sections open/close ───────────────────────────────────────
const sections = ref({ s1: true, s2: true, s3: true })

// ── Format helpers ────────────────────────────────────────────
const fmtNum = (v: any) =>
  v === null || v === undefined ? '0' : Number(v).toLocaleString('id-ID', { maximumFractionDigits: 0 })

const fmtPct = (v: any) => {
  const n = parseFloat(v) || 0
  return n.toLocaleString('id-ID', { maximumFractionDigits: 0 }) + '%'
}

// ── Section 1: Daily Summary ──────────────────────────────────
const costFields = ['labor','rm','add','sm','tr','total'] as const
const subFields  = ['plan','aktual','varian','percent'] as const

const handleFindDaily = async () => {
  if (!validateRange(s1Start.value, s1End.value)) return
  await fetchDaily(s1Start.value, s1End.value)
}

const dailyColumns = [
  { key: 'tanggal', label: 'DATE' },
  { key: 'plan', label: 'QTY PLAN' }, { key: 'actual', label: 'QTY ACTUAL' }, { key: 'percent', label: 'QTY %' },
  { key: 'lc_plan', label: 'LABOR PLAN' }, { key: 'lc_actual', label: 'LABOR AKTUAL' }, { key: 'lc_varian', label: 'LABOR VARIAN' }, { key: 'lc_persen', label: 'LABOR %' },
  { key: 'rm_plan', label: 'RM PLAN' }, { key: 'rm_actual', label: 'RM AKTUAL' }, { key: 'rm_varian', label: 'RM VARIAN' }, { key: 'rm_percen', label: 'RM %' },
  { key: 'ad_plan', label: 'ADD PLAN' }, { key: 'ad_actual', label: 'ADD AKTUAL' }, { key: 'ad_varian', label: 'ADD VARIAN' }, { key: 'ad_percent', label: 'ADD %' },
  { key: 'sm_plan', label: 'SM PLAN' }, { key: 'sm_actual', label: 'SM AKTUAL' }, { key: 'sm_varian', label: 'SM VARIAN' }, { key: 'sm_percent', label: 'SM %' },
  { key: 'ts_plan', label: 'TR PLAN' }, { key: 'ts_actual', label: 'TR AKTUAL' }, { key: 'ts_varian', label: 'TR VARIAN' }, { key: 'ts_percent', label: 'TR %' },
  { key: 'retur', label: 'RETURN PRODUK' },
  { key: 'total_plan', label: 'TOTAL PLAN' }, { key: 'total_actual', label: 'TOTAL AKTUAL' }, { key: 'varian', label: 'TOTAL VARIAN' }, { key: 'total_persen', label: 'TOTAL %' },
]

// ── Section 2: Daily Item ─────────────────────────────────────
const handleFindDailyItem = async () => {
  if (!validateRange(s2Start.value, s2End.value)) return
  await fetchDailyItem(s2Start.value, s2End.value)
}

const dailyItemColumns = [
  { key: 'kode_produk',  label: 'KODE PRODUK'   },
  { key: 'name_produk',  label: 'NAME PRODUK'   },
  { key: 'plan',         label: 'QTY PLAN'      },
  { key: 'actual',       label: 'QTY ACTUAL'    },
  { key: 'percent',      label: 'QTY %'         },
  { key: 'lc_plan',      label: 'LABOR PLAN'    },
  { key: 'lc_actual',    label: 'LABOR AKTUAL'  },
  { key: 'lc_varian',   label: 'LABOR VARIAN'  },
  { key: 'lc_persen',   label: 'LABOR %'        },
  { key: 'rm_plan',      label: 'RM PLAN'       },
  { key: 'rm_actual',    label: 'RM AKTUAL'     },
  { key: 'rm_varian',    label: 'RM VARIAN'     },
  { key: 'rm_percen',   label: 'RM %'           },
  { key: 'ad_plan',      label: 'ADD PLAN'      },
  { key: 'ad_actual',    label: 'ADD AKTUAL'    },
  { key: 'ad_varian',    label: 'ADD VARIAN'    },
  { key: 'ad_percent',   label: 'ADD %'         },
  { key: 'sm_plan',      label: 'SM PLAN'       },
  { key: 'sm_actual',    label: 'SM AKTUAL'     },
  { key: 'sm_varian',    label: 'SM VARIAN'     },
  { key: 'sm_percent',   label: 'SM %'          },
  { key: 'ts_plan',      label: 'TR PLAN'       },
  { key: 'ts_actual',    label: 'TR AKTUAL'     },
  { key: 'ts_varian',   label: 'TR VARIAN'     },
  { key: 'ts_percent',   label: 'TR %'          },
  { key: 'retur',        label: 'RETURN PRODUK' },
  { key: 'total_plan',   label: 'TOTAL PLAN'    },
  { key: 'total_actual', label: 'TOTAL AKTUAL'  },
  { key: 'varian',       label: 'TOTAL VARIAN'  },
  { key: 'total_persen', label: 'TOTAL %'       },
]

// ── Section 3: Daily Material ─────────────────────────────────
const handleFindDailyMatrial = async () => {
  if (!validateRange(s3Start.value, s3End.value)) return
  await fetchDailyMatrial(s3Start.value, s3End.value)
}

const matrialColumns = [
  { key: 'kode_produk', label: 'KODE PRODUK' }, { key: 'name_produk', label: 'NAME PRODUK' },
  { key: 'lc_plan', label: 'QTY PLAN' }, { key: 'lc_actual', label: 'QTY AKTUAL' }, { key: 'lc_varian', label: 'QTY VARIAN' }, { key: 'lc_persen', label: 'QTY %' },
  { key: 'rm_plan', label: 'NOM PLAN' }, { key: 'rm_actual', label: 'NOM AKTUAL' }, { key: 'rm_varian', label: 'NOM VARIAN' }, { key: 'rm_percen', label: 'NOM %' },
]

// ── Grand totals (computed) ───────────────────────────────────
const numericKeys1 = ['plan','actual','lc_plan','lc_actual','lc_varian','rm_plan','rm_actual','rm_varian','ad_plan','ad_actual','ad_varian','sm_plan','sm_actual','sm_varian','ts_plan','ts_actual','ts_varian','retur','total_plan','total_actual','varian']
const matNumKeys   = ['lc_plan','lc_actual','lc_varian','rm_plan','rm_actual','rm_varian']

onMounted(() => {
  const today = getToday()
  s1Start.value = today; s1End.value = today
  s2Start.value = today; s2End.value = today
  s3Start.value = today; s3End.value = today
})
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-6 font-sans flex flex-col gap-5">

    <!-- HEADER -->
    <div class="flex items-center gap-4 backdrop-blur-xl bg-white/80 p-5 rounded-[2rem] shadow-sm border border-white">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">Report Daily</h1>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Daily Production Cost Report</p>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         SECTION 1: DAILY SUMMARY (per tanggal)
    ══════════════════════════════════════════════════ -->
    <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">

      <!-- Card Header -->
      <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="sections.s1 = !sections.s1">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UIcon name="i-heroicons-calendar-days" class="w-4 h-4" /></div>
          <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Daily Summary <span class="text-blue-500 font-black ml-1">(Per Tanggal)</span></h2>
        </div>
        <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180': !sections.s1}" />
      </div>

      <div v-show="sections.s1">
        <!-- Toolbar -->
        <div class="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap gap-3 items-end justify-between">
          <div class="flex flex-wrap gap-3 items-end">
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
              <UInput type="date" v-model="s1Start" size="md" :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }"
                @change="s1End = autoEndDate(s1Start)" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
              <UInput type="date" v-model="s1End" size="md" :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }" />
            </div>
            <UButton icon="i-heroicons-magnifying-glass" color="primary" variant="solid" size="md"
              class="font-black tracking-wider uppercase rounded-xl px-5 shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
              :loading="isLoadingDaily" @click="handleFindDaily">GET DATA</UButton>
          </div>
          <UButton icon="i-heroicons-document-arrow-down" color="emerald" variant="solid" size="md"
            class="font-black tracking-wider uppercase rounded-xl px-5 shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
            :disabled="dailyList.length === 0"
            @click="exportCsv(dailyList, dailyColumns, 'report_daily_date.csv')">EXPORT</UButton>
        </div>

        <!-- Table -->
        <div class="overflow-auto custom-scrollbar" style="max-height: 480px;">
          <div v-if="isLoadingDaily" class="py-16 text-center"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-blue-400" /></div>
          <div v-else-if="dailyList.length === 0" class="py-16 text-center text-slate-400 font-semibold text-sm">Belum ada data. Klik GET DATA.</div>
          <table v-else class="w-full text-xs whitespace-nowrap border-collapse">
            <thead class="sticky top-0 z-10">
              <!-- Row 1 -->
              <tr class="bg-slate-100 text-slate-800">
                <th rowspan="2" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center">#</th>
                <th rowspan="2" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center">DATE</th>
                <th colspan="3" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center">QTY Produksi</th>
                <th colspan="4" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-blue-700 bg-blue-50">Labor Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-indigo-700 bg-indigo-50">RM Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-violet-700 bg-violet-50">Additive Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-purple-700 bg-purple-50">SM Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-fuchsia-700 bg-fuchsia-50">Transport</th>
                <th rowspan="2" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-orange-700 bg-orange-50">Return Produk</th>
                <th colspan="4" class="px-3 py-2 font-bold uppercase tracking-wide border border-slate-200 text-center text-emerald-700 bg-emerald-50">Total Production Cost</th>
              </tr>
              <!-- Row 2 -->
              <tr class="bg-slate-50 text-slate-700">
                <th class="px-3 py-1.5 border border-slate-200 text-center">PLAN</th>
                <th class="px-3 py-1.5 border border-slate-200 text-center">ACTUAL</th>
                <th class="px-3 py-1.5 border border-slate-200 text-center">%</th>
                <template v-for="cat in ['blue','indigo','violet','purple','fuchsia','emerald']" :key="cat">
                  <th class="px-3 py-1.5 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1.5 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1.5 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1.5 border border-slate-200 text-center">%</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in dailyList" :key="i" class="border-b border-slate-100 hover:bg-blue-50/30 transition-colors" :class="i%2===0?'bg-white':'bg-slate-50/50'">
                <td class="px-3 py-2 text-slate-400 font-semibold border-r border-slate-100">{{ i+1 }}</td>
                <td class="px-3 py-2 font-extrabold text-slate-800 border-r border-slate-100">{{ row.tanggal }}</td>
                <td class="px-3 py-2 text-right font-bold text-slate-700 border-r border-slate-100">{{ fmtNum(row.plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-slate-700 border-r border-slate-100">{{ fmtNum(row.actual) }}</td>
                <td class="px-3 py-2 text-center font-semibold text-slate-500 border-r border-slate-200">{{ fmtPct(row.percent) }}</td>
                <!-- Labor -->
                <td class="px-3 py-2 text-right font-medium text-blue-800 bg-blue-50/30 border-r border-slate-100">{{ fmtNum(row.lc_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-blue-800 bg-blue-50/30 border-r border-slate-100">{{ fmtNum(row.lc_actual) }}</td>
                <td class="px-3 py-2 text-right font-semibold border-r border-slate-100" :class="Number(row.lc_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.lc_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500 border-r border-slate-200">{{ fmtPct(row.lc_persen) }}</td>
                <!-- RM -->
                <td class="px-3 py-2 text-right font-medium text-indigo-800 bg-indigo-50/30 border-r border-slate-100">{{ fmtNum(row.rm_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-indigo-800 bg-indigo-50/30 border-r border-slate-100">{{ fmtNum(row.rm_actual) }}</td>
                <td class="px-3 py-2 text-right font-semibold border-r border-slate-100" :class="Number(row.rm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.rm_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500 border-r border-slate-200">{{ fmtPct(row.rm_percen) }}</td>
                <!-- Additive -->
                <td class="px-3 py-2 text-right font-medium text-violet-800 bg-violet-50/30 border-r border-slate-100">{{ fmtNum(row.ad_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-violet-800 bg-violet-50/30 border-r border-slate-100">{{ fmtNum(row.ad_actual) }}</td>
                <td class="px-3 py-2 text-right font-semibold border-r border-slate-100" :class="Number(row.ad_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.ad_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500 border-r border-slate-200">{{ fmtPct(row.ad_percent) }}</td>
                <!-- SM -->
                <td class="px-3 py-2 text-right font-medium text-purple-800 bg-purple-50/30 border-r border-slate-100">{{ fmtNum(row.sm_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-purple-800 bg-purple-50/30 border-r border-slate-100">{{ fmtNum(row.sm_actual) }}</td>
                <td class="px-3 py-2 text-right font-semibold border-r border-slate-100" :class="Number(row.sm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.sm_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500 border-r border-slate-200">{{ fmtPct(row.sm_percent) }}</td>
                <!-- Transport -->
                <td class="px-3 py-2 text-right font-medium text-fuchsia-800 bg-fuchsia-50/30 border-r border-slate-100">{{ fmtNum(row.ts_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-fuchsia-800 bg-fuchsia-50/30 border-r border-slate-100">{{ fmtNum(row.ts_actual) }}</td>
                <td class="px-3 py-2 text-right font-semibold border-r border-slate-100" :class="Number(row.ts_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.ts_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500 border-r border-slate-200">{{ fmtPct(row.ts_percent) }}</td>
                <!-- Return -->
                <td class="px-3 py-2 text-right font-black text-orange-700 bg-orange-50/30 border-r border-slate-200">{{ fmtNum(row.retur) }}</td>
                <!-- Total -->
                <td class="px-3 py-2 text-right font-medium text-emerald-800 bg-emerald-50/30 border-r border-slate-100">{{ fmtNum(row.total_plan) }}</td>
                <td class="px-3 py-2 text-right font-black text-emerald-800 bg-emerald-50/30 border-r border-slate-100">{{ fmtNum(row.total_actual) }}</td>
                <td class="px-3 py-2 text-right font-semibold border-r border-slate-100" :class="Number(row.varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.total_persen) }}</td>
              </tr>
            </tbody>
            <!-- Footer Grand Total -->
            <tfoot class="sticky bottom-0 bg-slate-800 text-white font-black">
              <tr>
                <td colspan="2" class="px-3 py-2 text-center uppercase tracking-widest text-xs">TOTAL</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'actual')) }}</td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'lc_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'lc_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'lc_varian')) }}</td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'rm_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'rm_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'rm_varian')) }}</td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'ad_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'ad_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'ad_varian')) }}</td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'sm_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'sm_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'sm_varian')) }}</td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'ts_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'ts_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'ts_varian')) }}</td>
                <td class="px-3 py-2"></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'retur')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'total_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'total_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyList,'varian')) }}</td>
                <td class="px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         SECTION 2: DAILY DETAIL (per produk)
    ══════════════════════════════════════════════════ -->
    <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">

      <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="sections.s2 = !sections.s2">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><UIcon name="i-heroicons-cube" class="w-4 h-4" /></div>
          <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Daily Detail <span class="text-indigo-500 font-black ml-1">(Per Produk)</span></h2>
        </div>
        <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180': !sections.s2}" />
      </div>

      <div v-show="sections.s2">
        <div class="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap gap-3 items-end justify-between">
          <div class="flex flex-wrap gap-3 items-end">
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
              <UInput type="date" v-model="s2Start" size="md" :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }"
                @change="s2End = autoEndDate(s2Start)" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
              <UInput type="date" v-model="s2End" size="md" :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }" />
            </div>
            <UButton icon="i-heroicons-magnifying-glass" color="indigo" variant="solid" size="md"
              class="font-black tracking-wider uppercase rounded-xl px-5 shadow-md hover:-translate-y-0.5 transition-all"
              :loading="isLoadingDailyItem" @click="handleFindDailyItem">GET DATA</UButton>
          </div>
          <UButton icon="i-heroicons-document-arrow-down" color="emerald" variant="solid" size="md"
            class="font-black tracking-wider uppercase rounded-xl px-5 shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
            :disabled="dailyItemList.length === 0"
            @click="exportCsv(dailyItemList, dailyItemColumns, 'report_daily_item.csv')">EXPORT</UButton>
        </div>

        <div class="overflow-auto custom-scrollbar" style="max-height: 480px;">
          <div v-if="isLoadingDailyItem" class="py-16 text-center"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-indigo-400" /></div>
          <div v-else-if="dailyItemList.length === 0" class="py-16 text-center text-slate-400 font-semibold text-sm">Belum ada data. Klik GET DATA.</div>
          <table v-else class="w-full text-xs whitespace-nowrap border-collapse">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-100 text-slate-800">
                <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200 text-center">#</th>
                <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200 text-center">KODE PRODUK</th>
                <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200 text-center">NAME PRODUK</th>
                <th colspan="3" class="px-3 py-2 font-bold border border-slate-200 text-center">QTY Produksi</th>
                <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-blue-700 bg-blue-50">Labor Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-violet-700 bg-violet-50">RM Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-purple-700 bg-purple-50">Additive Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-fuchsia-700 bg-fuchsia-50">SM Cost</th>
                <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-pink-700 bg-pink-50">Transport</th>
                <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200 text-center text-orange-700 bg-orange-50">Return Produk</th>
                <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-emerald-700 bg-emerald-50">Total Cost</th>
              </tr>
              <tr class="bg-slate-50 text-slate-700">
                <th class="px-3 py-1 border border-slate-200 text-center">PLAN</th>
                <th class="px-3 py-1 border border-slate-200 text-center">ACTUAL</th>
                <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                <template v-for="n in 6" :key="n">
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in dailyItemList" :key="i" class="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors" :class="i%2===0?'bg-white':'bg-slate-50/50'">
                <td class="px-3 py-2 text-slate-400">{{ i+1 }}</td>
                <td class="px-3 py-2 font-bold text-slate-600">{{ row.kode_produk }}</td>
                <td class="px-3 py-2 font-extrabold text-slate-800">{{ row.name_produk }}</td>
                <td class="px-3 py-2 text-right font-bold">{{ fmtNum(row.plan) }}</td>
                <td class="px-3 py-2 text-right font-bold">{{ fmtNum(row.actual) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.percent) }}</td>
                <td class="px-3 py-2 text-right text-blue-700 bg-blue-50/30">{{ fmtNum(row.lc_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-blue-700 bg-blue-50/30">{{ fmtNum(row.lc_actual) }}</td>
                <td class="px-3 py-2 text-right" :class="Number(row.lc_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.lc_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.lc_persen) }}</td>
                <td class="px-3 py-2 text-right text-violet-700 bg-violet-50/30">{{ fmtNum(row.rm_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-violet-700 bg-violet-50/30">{{ fmtNum(row.rm_actual) }}</td>
                <td class="px-3 py-2 text-right" :class="Number(row.rm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.rm_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.rm_percen) }}</td>
                <td class="px-3 py-2 text-right text-purple-700 bg-purple-50/30">{{ fmtNum(row.ad_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-purple-700 bg-purple-50/30">{{ fmtNum(row.ad_actual) }}</td>
                <td class="px-3 py-2 text-right" :class="Number(row.ad_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.ad_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.ad_percent) }}</td>
                <td class="px-3 py-2 text-right text-fuchsia-700 bg-fuchsia-50/30">{{ fmtNum(row.sm_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-fuchsia-700 bg-fuchsia-50/30">{{ fmtNum(row.sm_actual) }}</td>
                <td class="px-3 py-2 text-right" :class="Number(row.sm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.sm_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.sm_percent) }}</td>
                <td class="px-3 py-2 text-right text-pink-700 bg-pink-50/30">{{ fmtNum(row.ts_plan) }}</td>
                <td class="px-3 py-2 text-right font-bold text-pink-700 bg-pink-50/30">{{ fmtNum(row.ts_actual) }}</td>
                <td class="px-3 py-2 text-right" :class="Number(row.ts_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.ts_varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.ts_percent) }}</td>
                <td class="px-3 py-2 text-right font-black text-orange-700 bg-orange-50/30">{{ fmtNum(row.retur) }}</td>
                <td class="px-3 py-2 text-right text-emerald-700 bg-emerald-50/30">{{ fmtNum(row.total_plan) }}</td>
                <td class="px-3 py-2 text-right font-black text-emerald-700 bg-emerald-50/30">{{ fmtNum(row.total_actual) }}</td>
                <td class="px-3 py-2 text-right" :class="Number(row.varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.varian) }}</td>
                <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.total_persen) }}</td>
              </tr>
            </tbody>
            <tfoot class="sticky bottom-0 bg-indigo-900 text-white font-black">
              <tr>
                <td colspan="3" class="px-3 py-2 text-center uppercase text-xs tracking-widest">TOTAL</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'actual')) }}</td>
                <td></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'lc_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'lc_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'lc_varian')) }}</td>
                <td></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'rm_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'rm_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'rm_varian')) }}</td>
                <td></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'ad_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'ad_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'ad_varian')) }}</td>
                <td></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'sm_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'sm_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'sm_varian')) }}</td>
                <td></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'ts_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'ts_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'ts_varian')) }}</td>
                <td></td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'retur')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'total_plan')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'total_actual')) }}</td>
                <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyItemList,'varian')) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
         SECTION 3: DAILY MATERIAL
    ══════════════════════════════════════════════════ -->
    <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">

      <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex justify-between items-center cursor-pointer select-none" @click="sections.s3 = !sections.s3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><UIcon name="i-heroicons-beaker" class="w-4 h-4" /></div>
          <h2 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Daily Material <span class="text-emerald-500 font-black ml-1">(RM / Additive / Support)</span></h2>
        </div>
        <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="{'rotate-180': !sections.s3}" />
      </div>

      <div v-show="sections.s3">
        <!-- Toolbar Material -->
        <div class="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap gap-3 items-end">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
            <UInput type="date" v-model="s3Start" size="md" :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }"
              @change="s3End = autoEndDate(s3Start)" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
            <UInput type="date" v-model="s3End" size="md" :ui="{ base: 'font-semibold w-36', rounded: 'rounded-xl' }" />
          </div>
          <UButton icon="i-heroicons-magnifying-glass" color="emerald" variant="solid" size="md"
            class="font-black tracking-wider uppercase rounded-xl px-5 shadow-md hover:-translate-y-0.5 transition-all"
            :loading="isLoadingDailyMatrial" @click="handleFindDailyMatrial">GET DATA</UButton>
        </div>

        <!-- Sub-section: RAW MATERIAL -->
        <div class="p-4 border-b border-slate-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> RAW MATERIAL
            </h3>
            <UButton size="xs" color="emerald" variant="soft" icon="i-heroicons-document-arrow-down"
              :disabled="dailyMatrialList.length === 0"
              @click="exportCsv(dailyMatrialList, matrialColumns, 'report_daily_RM.csv')">EXPORT</UButton>
          </div>
          <div class="overflow-auto custom-scrollbar" style="max-height:360px">
            <div v-if="isLoadingDailyMatrial" class="py-10 text-center"><UIcon name="i-heroicons-arrow-path" class="w-7 h-7 animate-spin mx-auto text-emerald-400" /></div>
            <div v-else-if="dailyMatrialList.length === 0" class="py-10 text-center text-slate-400 font-semibold text-sm">Belum ada data. Klik GET DATA.</div>
            <table v-else class="w-full text-xs whitespace-nowrap border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-100 text-slate-800">
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">#</th>
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">KODE PRODUK</th>
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">NAME PRODUK</th>
                  <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-emerald-700 bg-emerald-50">Quantity (gram)</th>
                  <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-teal-700 bg-teal-50">Nominal (Rp)</th>
                </tr>
                <tr class="bg-slate-50 text-slate-700">
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in dailyMatrialList" :key="i" class="border-b border-slate-100 hover:bg-emerald-50/30" :class="i%2===0?'bg-white':'bg-slate-50/50'">
                  <td class="px-3 py-2 text-slate-400">{{ i+1 }}</td>
                  <td class="px-3 py-2 font-bold text-slate-600">{{ row.kode_produk }}</td>
                  <td class="px-3 py-2 font-extrabold text-slate-800">{{ row.name_produk }}</td>
                  <td class="px-3 py-2 text-right text-emerald-700">{{ fmtNum(row.lc_plan) }}</td>
                  <td class="px-3 py-2 text-right font-bold text-emerald-700">{{ fmtNum(row.lc_actual) }}</td>
                  <td class="px-3 py-2 text-right" :class="Number(row.lc_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.lc_varian) }}</td>
                  <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.lc_persen) }}</td>
                  <td class="px-3 py-2 text-right text-teal-700 bg-teal-50/30">{{ fmtNum(row.rm_plan) }}</td>
                  <td class="px-3 py-2 text-right font-bold text-teal-700 bg-teal-50/30">{{ fmtNum(row.rm_actual) }}</td>
                  <td class="px-3 py-2 text-right" :class="Number(row.rm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.rm_varian) }}</td>
                  <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.rm_percen) }}</td>
                </tr>
              </tbody>
              <tfoot class="sticky bottom-0 bg-emerald-900 text-white font-black">
                <tr>
                  <td colspan="3" class="px-3 py-2 text-center uppercase text-xs tracking-widest">TOTAL</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyMatrialList,'lc_plan')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyMatrialList,'lc_actual')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyMatrialList,'lc_varian')) }}</td>
                  <td></td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyMatrialList,'rm_plan')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyMatrialList,'rm_actual')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyMatrialList,'rm_varian')) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Sub-section: ADDITIVE -->
        <div class="p-4 border-b border-slate-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-violet-500 inline-block"></span> ADDITIVE
            </h3>
            <UButton size="xs" color="violet" variant="soft" icon="i-heroicons-document-arrow-down"
              :disabled="dailyAdvList.length === 0"
              @click="exportCsv(dailyAdvList, matrialColumns, 'report_daily_adv.csv')">EXPORT</UButton>
          </div>
          <div class="overflow-auto custom-scrollbar" style="max-height:360px">
            <div v-if="isLoadingDailyMatrial" class="py-10 text-center"><UIcon name="i-heroicons-arrow-path" class="w-7 h-7 animate-spin mx-auto text-violet-400" /></div>
            <div v-else-if="dailyAdvList.length === 0" class="py-10 text-center text-slate-400 font-semibold text-sm">Belum ada data. Klik GET DATA.</div>
            <table v-else class="w-full text-xs whitespace-nowrap border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-100 text-slate-800">
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">#</th>
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">KODE PRODUK</th>
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">NAME PRODUK</th>
                  <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-violet-700 bg-violet-50">Quantity (gram)</th>
                  <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-purple-700 bg-purple-50">Nominal (Rp)</th>
                </tr>
                <tr class="bg-slate-50 text-slate-700">
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in dailyAdvList" :key="i" class="border-b border-slate-100 hover:bg-violet-50/30" :class="i%2===0?'bg-white':'bg-slate-50/50'">
                  <td class="px-3 py-2 text-slate-400">{{ i+1 }}</td>
                  <td class="px-3 py-2 font-bold text-slate-600">{{ row.kode_produk }}</td>
                  <td class="px-3 py-2 font-extrabold text-slate-800">{{ row.name_produk }}</td>
                  <td class="px-3 py-2 text-right text-violet-700">{{ fmtNum(row.lc_plan) }}</td>
                  <td class="px-3 py-2 text-right font-bold text-violet-700">{{ fmtNum(row.lc_actual) }}</td>
                  <td class="px-3 py-2 text-right" :class="Number(row.lc_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.lc_varian) }}</td>
                  <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.lc_persen) }}</td>
                  <td class="px-3 py-2 text-right text-purple-700 bg-purple-50/30">{{ fmtNum(row.rm_plan) }}</td>
                  <td class="px-3 py-2 text-right font-bold text-purple-700 bg-purple-50/30">{{ fmtNum(row.rm_actual) }}</td>
                  <td class="px-3 py-2 text-right" :class="Number(row.rm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.rm_varian) }}</td>
                  <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.rm_percen) }}</td>
                </tr>
              </tbody>
              <tfoot class="sticky bottom-0 bg-violet-900 text-white font-black">
                <tr>
                  <td colspan="3" class="px-3 py-2 text-center uppercase text-xs tracking-widest">TOTAL</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyAdvList,'lc_plan')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyAdvList,'lc_actual')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyAdvList,'lc_varian')) }}</td>
                  <td></td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyAdvList,'rm_plan')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyAdvList,'rm_actual')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailyAdvList,'rm_varian')) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Sub-section: SUPPORT -->
        <div class="p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> SUPPORT
            </h3>
            <UButton size="xs" color="blue" variant="soft" icon="i-heroicons-document-arrow-down"
              :disabled="dailySpList.length === 0"
              @click="exportCsv(dailySpList, matrialColumns, 'report_daily_sm.csv')">EXPORT</UButton>
          </div>
          <div class="overflow-auto custom-scrollbar" style="max-height:360px">
            <div v-if="isLoadingDailyMatrial" class="py-10 text-center"><UIcon name="i-heroicons-arrow-path" class="w-7 h-7 animate-spin mx-auto text-blue-400" /></div>
            <div v-else-if="dailySpList.length === 0" class="py-10 text-center text-slate-400 font-semibold text-sm">Belum ada data. Klik GET DATA.</div>
            <table v-else class="w-full text-xs whitespace-nowrap border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-100 text-slate-800">
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">#</th>
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">KODE PRODUK</th>
                  <th rowspan="2" class="px-3 py-2 font-bold border border-slate-200">NAME PRODUK</th>
                  <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-blue-700 bg-blue-50">Quantity (gram)</th>
                  <th colspan="4" class="px-3 py-2 font-bold border border-slate-200 text-center text-sky-700 bg-sky-50">Nominal (Rp)</th>
                </tr>
                <tr class="bg-slate-50 text-slate-700">
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Plan</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Aktual</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">Varian</th>
                  <th class="px-3 py-1 border border-slate-200 text-center">%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in dailySpList" :key="i" class="border-b border-slate-100 hover:bg-blue-50/30" :class="i%2===0?'bg-white':'bg-slate-50/50'">
                  <td class="px-3 py-2 text-slate-400">{{ i+1 }}</td>
                  <td class="px-3 py-2 font-bold text-slate-600">{{ row.kode_produk }}</td>
                  <td class="px-3 py-2 font-extrabold text-slate-800">{{ row.name_produk }}</td>
                  <td class="px-3 py-2 text-right text-blue-700">{{ fmtNum(row.lc_plan) }}</td>
                  <td class="px-3 py-2 text-right font-bold text-blue-700">{{ fmtNum(row.lc_actual) }}</td>
                  <td class="px-3 py-2 text-right" :class="Number(row.lc_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.lc_varian) }}</td>
                  <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.lc_persen) }}</td>
                  <td class="px-3 py-2 text-right text-sky-700 bg-sky-50/30">{{ fmtNum(row.rm_plan) }}</td>
                  <td class="px-3 py-2 text-right font-bold text-sky-700 bg-sky-50/30">{{ fmtNum(row.rm_actual) }}</td>
                  <td class="px-3 py-2 text-right" :class="Number(row.rm_varian)<0?'text-rose-600':'text-emerald-600'">{{ fmtNum(row.rm_varian) }}</td>
                  <td class="px-3 py-2 text-center text-slate-500">{{ fmtPct(row.rm_percen) }}</td>
                </tr>
              </tbody>
              <tfoot class="sticky bottom-0 bg-blue-900 text-white font-black">
                <tr>
                  <td colspan="3" class="px-3 py-2 text-center uppercase text-xs tracking-widest">TOTAL</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailySpList,'lc_plan')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailySpList,'lc_actual')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailySpList,'lc_varian')) }}</td>
                  <td></td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailySpList,'rm_plan')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailySpList,'rm_actual')) }}</td>
                  <td class="px-3 py-2 text-right">{{ fmtNum(sumField(dailySpList,'rm_varian')) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
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
</style>
