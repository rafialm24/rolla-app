<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportListHutang } from '~/composables/useReportListHutang'

definePageMeta({
  layout: 'dashboard'
})

const {
  reportData,
  isLoading,
  totalHutang,
  totalTerbayar,
  totalSisa,
  fetchListHutang,
  ajukanPayment,
  setDpPotongan,
  fetchPrintDetail,
  exportAllToCsv
} = useReportListHutang()

const columns = [
  { key: 'action', label: 'ACTION' },
  { key: 'name_dc', label: 'NAME DC' },
  { key: 'receiving_kode', label: 'NO FAKTUR' },
  { key: 'tanggal_terbit', label: 'TANGGAL TERBIT' },
  { key: 'name_vendor', label: 'NAMA VENDOR' },
  { key: 'tagihan', label: 'TAGIHAN' },
  { key: 'discount', label: 'DISCOUNT' },
  { key: 'dp', label: 'DP' },
  { key: 'potongan', label: 'POTONGAN' },
  { key: 'miscellaneous_expense', label: 'MISCELLANEOUS EXPENSE' },
  { key: 'payreq', label: 'PAY REQ DATE' },
  { key: 'nominal_pem', label: 'NOMINAL PEMBAYARAN' },
  { key: 'sisa_strs', label: 'SISA' },
  { key: 'sisa_global', label: 'SISA BY VENDOR' },
  { key: 'tgl_pembayaran', label: 'TANGGAL PEMBAYARAN' },
  { key: 'metode_pembayaran', label: 'METODE PENGAJUAN' },
  { key: 'rekening', label: 'REKENING' },
  { key: 'nama_rekening', label: 'NAMA REKENING' },
  { key: 'jenis_bank', label: 'JENIS BANK' }
]

onMounted(async () => {
  await fetchListHutang()
})

const handleRevisi = (id: number) => {
  alert('Fitur Revisi belum diimplementasikan di backend API saat ini.')
}

const handlePrint = async (id: number) => {
  const result = await fetchPrintDetail(id)
  if (!result || result.length === 0) {
    alert('Data nota/bon tidak ditemukan.')
    return
  }

  const first = result[0]
  let rows = ''
  let totalHarga = 0
  for (let i = 0; i < result.length; i++) {
    totalHarga += parseFloat(result[i].total_price || 0)
    rows += `<tr>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${i + 1}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${result[i].name_produk || ''}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${result[i].qty || 0}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">${result[i].uoms || ''}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">Rp ${Number(result[i].price || 0).toLocaleString('id-ID')}</td>
      <td style="border: 1px solid #000; padding: 8px; text-align: center;">Rp ${Number(result[i].total || 0).toLocaleString('id-ID')}</td>
    </tr>`
  }
  
  const totalRow = `<tr>
    <td colspan="5" style="border: 1px solid #000; padding: 8px; font-weight: bold;">TOTAL</td>
    <td style="border: 1px solid #000; text-align: center; padding: 8px; font-weight: bold;">Rp ${Number(first.total_all || 0).toLocaleString('id-ID')}</td>
  </tr>`

  const html = `
    <html>
      <head>
        <title>Print Bon / Nota</title>
      </head>
      <body style="font-family: 'Times New Roman', Times, serif; font-size: 12px; margin: 20px;" onload="window.print(); window.close();">
        <div style="text-align: center;">
          <h3 style="margin: 3px 0; font-size: 16px; font-weight: bold;">${first.name_dc || ''}</h3>
          <h5 style="margin: 3px 0; font-size: 14px;">${first.alamat || ''}</h5>
        </div>
        <hr style="border: 1px solid #000; margin-top: 15px; margin-bottom: 15px;">
        
        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
          <table style="width: 50%; border-collapse: collapse; text-align: center;" border="1">
              <tr><td style="padding: 6px; font-weight: bold;">SUPPLIER</td><td style="padding: 6px;">${first.name_vendor || ''}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">REKENING</td><td style="padding: 6px;">${first.rek || ''}</td></tr>
              <tr><td style="padding: 6px; font-weight: bold;">FAKTUR</td><td style="padding: 6px;">${first.faktur || ''}</td></tr>
              <tr><td colspan="2" style="padding: 6px; text-align: center;">${first.tgl || ''}</td></tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px;">
          <thead>
              <tr style="background-color: #f2f2f2;">
                  <th style="border: 1px solid #000; padding: 6px;">NO</th>
                  <th style="border: 1px solid #000; padding: 6px;">ITEM BARANG</th>
                  <th style="border: 1px solid #000; padding: 6px;">Qty</th>
                  <th style="border: 1px solid #000; padding: 6px;">UOM</th>
                  <th style="border: 1px solid #000; padding: 6px;">HARGA</th>
                  <th style="border: 1px solid #000; padding: 6px;">TOTAL</th>
              </tr>
          </thead>
          <tbody>
              ${rows}
              ${totalRow}
          </tbody>
        </table>

        <table style="width: 50%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
          <tr><td style="padding: 4px; width: 150px;">KETERANGAN</td><td style="width: 10px;">:</td><td style="color: red; font-weight: bold;">${first.type_pay || ''}</td></tr>
          <tr><td style="padding: 4px;">DISCOUNT</td><td>:</td><td>Rp ${Number(first.diskon || 0).toLocaleString('id-ID')}</td></tr>
          <tr><td style="padding: 4px;">DP</td><td>:</td><td>Rp ${Number(first.dp || 0).toLocaleString('id-ID')}</td></tr>
          <tr><td style="padding: 4px;">POTONGAN</td><td>:</td><td>Rp ${Number(first.potongan || 0).toLocaleString('id-ID')}</td></tr>
          <tr><td style="padding: 4px; font-weight: bold;">SISA HARUS DIBAYAR</td><td>:</td><td style="font-weight: bold;">Rp ${Number(first.sisa || 0).toLocaleString('id-ID')}</td></tr>
        </table>

        <table style="width: 100%; text-align: center; border-collapse: collapse; margin-top: 40px; font-size: 12px;">
          <tr>
            <td style="width: 50%;">Pengirim</td>
            <td style="width: 50%;">Penerima</td>
          </tr>
          <tr>
            <td style="height: 80px;"></td>
            <td></td>
          </tr>
          <tr>
            <td>( ${first.name_vendor || '..........................'} )</td>
            <td>( ${first.username || 'Yantong'} )</td>
          </tr>
        </table>
      </body>
    </html>
  `
  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-8 font-sans flex flex-col gap-6">
    
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
          <UIcon name="i-heroicons-clipboard-document-list" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Master List Hutang</h1>
          <p class="text-sm font-medium text-slate-500 mt-1">Daftar Hutang Produksi</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <UButton 
          icon="i-heroicons-arrow-path" 
          color="white" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm text-slate-600"
          @click="fetchListHutang"
          :loading="isLoading"
        >
          REFRESH
        </UButton>
        <UButton 
          icon="i-heroicons-document-arrow-down" 
          color="emerald" 
          variant="solid" 
          class="font-bold tracking-wide shadow-sm"
          :disabled="reportData.length === 0"
          @click="exportAllToCsv('report_list_hutang_produksi.csv')"
        >
          EXPORT ALL
        </UButton>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      <!-- DATAGRID -->
      <div class="flex-1 overflow-auto custom-scrollbar relative min-h-[400px]">
        <UTable 
          :rows="reportData" 
          :columns="columns"
          :loading="isLoading"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Tidak ada data list hutang.' }"
          class="w-full"
          :ui="{
            wrapper: 'absolute inset-0',
            th: { base: 'whitespace-nowrap font-bold text-slate-700 bg-slate-50 top-0 sticky z-10 shadow-sm', padding: 'py-3 px-4' },
            td: { base: 'whitespace-nowrap text-slate-600', padding: 'py-2 px-3' }
          }"
        >
          <!-- ACTION COLUMN -->
          <template #action-data="{ row }">
            <div class="flex items-center gap-1.5">
              <UButton 
                size="2xs" 
                color="gray" 
                variant="solid"
                @click="handleRevisi(row.id)" 
                :disabled="row.metode_pembayaran === 'Cash' || row.metode_pembayaran === 'Transfer' || Number(row.sisa) === 0"
                class="shadow-sm"
              >
                Revisi
              </UButton>
              <UButton 
                size="2xs" 
                color="blue" 
                variant="solid"
                @click="ajukanPayment(row.id, row.metode_pembayaran_id, row.discount)" 
                :disabled="row.metode_pembayaran === 'Cash' || Number(row.sisa) === 0"
                class="shadow-sm"
              >
                Ajukan
              </UButton>
              <UButton 
                size="2xs" 
                color="orange" 
                variant="solid"
                @click="setDpPotongan(row.id, row.dp, 1)" 
                :disabled="Number(row.dp) !== 0 || Number(row.sisa) === 0"
                class="shadow-sm"
              >
                Set DP
              </UButton>
              <UButton 
                size="2xs" 
                color="rose" 
                variant="solid"
                @click="setDpPotongan(row.id, row.potongan, 2)" 
                :disabled="Number(row.potongan) !== 0 || Number(row.sisa) === 0"
                class="shadow-sm"
              >
                Set Ptg
              </UButton>
              <UButton 
                size="2xs" 
                color="emerald" 
                variant="solid"
                @click="handlePrint(row.id)"
                class="shadow-sm"
              >
                Print
              </UButton>
            </div>
          </template>

          <!-- INPUT COLUMNS -->
          <template #discount-data="{ row }">
            <UInput 
              type="number" 
              v-model="row.discount" 
              :disabled="row.metode_pembayaran === 'Cash'" 
              size="sm" 
              class="w-24" 
            />
          </template>
          
          <template #dp-data="{ row }">
            <UInput 
              type="number" 
              v-model="row.dp" 
              size="sm" 
              class="w-28" 
            />
          </template>

          <template #potongan-data="{ row }">
            <UInput 
              type="number" 
              v-model="row.potongan" 
              size="sm" 
              class="w-28" 
            />
          </template>

          <template #metode_pembayaran-data="{ row }">
            <USelectMenu 
              v-model="row.metode_pembayaran_id" 
              :options="[{id: 1, label: 'Cash'}, {id: 2, label: 'Transfer'}]" 
              value-attribute="id"
              option-attribute="label"
              size="sm"
              class="w-32"
              :disabled="row.metode_pembayaran === 'Transfer' || row.metode_pembayaran === '2' || row.metode_pembayaran_id === 2"
            />
          </template>

          <!-- DATE FORMATTING -->
          <template #tanggal_terbit-data="{ row }">
            <span class="font-medium">{{ row.tanggal_terbit ? row.tanggal_terbit.substring(0, 10) : '' }}</span>
          </template>
          <template #payreq-data="{ row }">
            <span class="font-medium">{{ row.payreq ? row.payreq.substring(0, 10) : '' }}</span>
          </template>
          <template #tgl_pembayaran-data="{ row }">
            <span class="font-medium">{{ row.tgl_pembayaran ? row.tgl_pembayaran.substring(0, 10) : '' }}</span>
          </template>

          <!-- NUMERIC FORMATTING -->
          <template #tagihan-data="{ row }">
            <span class="font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.tagihan || 0) }}</span>
          </template>
          <template #nominal_pem-data="{ row }">
            <span class="font-mono text-emerald-600 font-semibold">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.nominal_pem || 0) }}</span>
          </template>
          <template #sisa_strs-data="{ row }">
            <span class="font-mono text-rose-600 font-bold">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.sisa_strs || 0) }}</span>
          </template>
          <template #sisa_global-data="{ row }">
            <span class="font-mono text-indigo-600">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.sisa_global || 0) }}</span>
          </template>

        </UTable>
      </div>
      
      <!-- FOOTER SUMMARY -->
      <div class="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        <div class="flex-1 flex justify-center border-r border-slate-200">
          <div class="text-center">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Hutang</div>
            <div class="text-xl font-black text-rose-600 font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalHutang) }}</div>
          </div>
        </div>
        <div class="flex-1 flex justify-center border-r border-slate-200">
          <div class="text-center">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Terbayar</div>
            <div class="text-xl font-black text-emerald-600 font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalTerbayar) }}</div>
          </div>
        </div>
        <div class="flex-1 flex justify-center">
          <div class="text-center">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Sisa</div>
            <div class="text-xl font-black text-indigo-600 font-mono">{{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalSisa) }}</div>
          </div>
        </div>
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
