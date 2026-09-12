<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-4 lg:p-8 font-sans relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <!-- Header Section -->
      <div class="relative backdrop-blur-xl bg-white/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">Surat Perintah Kerja (SPK)</h1>
            <p class="text-xs font-semibold text-slate-500 tracking-wide mt-0.5 uppercase">Kelola Master Produk & Penugasan Karyawan</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6 relative z-10">
        <!-- MASTER LIST PRODUK SPK -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><UIcon name="i-heroicons-cube" class="w-4 h-4" /></div>
              <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Master List Produk</h3>
            </div>
            <div class="flex items-center gap-2">
              <UInput type="date" v-model="filterDateStart" size="sm" :ui="{ rounded: 'rounded-xl' }" />
              <UButton @click="handleSetOrder" :loading="isSaving" size="sm" color="blue" variant="solid" class="rounded-xl shadow-md shadow-blue-500/20 font-bold uppercase tracking-wider text-[10px]">Set Order</UButton>
              <UButton @click="handleSetOrderNew" :loading="isSaving" size="sm" color="indigo" variant="soft" class="rounded-xl font-bold uppercase tracking-wider text-[10px]">Set Order New</UButton>
            </div>
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <div class="mb-4">
              <UInput v-model="searchProduk" @keyup.enter="loadProduk" icon="i-heroicons-magnifying-glass" placeholder="Cari Produk..." size="md" :ui="{ base: 'w-full sm:w-72 font-semibold text-slate-700', rounded: 'rounded-xl', color: { white: { outline: 'ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500' } } }">
                <template #trailing>
                  <UButton v-show="searchProduk !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false" @click="searchProduk = ''; loadProduk()" />
                </template>
              </UInput>
            </div>
            
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1">
              <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                    <tr>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Produk</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Produk</th>
                      <th class="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kategori</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Stock</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Defect</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">SPK</th>
                      <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Prod</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-32">Qty Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingProduk">
                      <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" /><p class="font-semibold text-xs">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="produkSpkList.length === 0">
                      <td colspan="9" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-xs">Tidak ada data</p></td>
                    </tr>
                    <tr v-else v-for="item in produkSpkList" :key="item.id" class="border-b border-slate-50 hover:bg-blue-50/50 transition-colors whitespace-nowrap">
                      <td class="px-4 py-3 text-slate-500 text-xs font-bold">{{ item.kode_produk }}</td>
                      <td class="px-4 py-3 font-extrabold text-slate-700">{{ item.name_produk }}</td>
                      <td class="px-4 py-3 text-slate-500 text-xs font-medium">{{ item.name_prod_cate }}</td>
                      <td class="px-4 py-3 text-slate-500 text-xs font-bold text-center">{{ item.uom }}</td>
                      <td class="px-4 py-3 text-slate-700 text-xs font-bold text-right">{{ item.qty }}</td>
                      <td class="px-4 py-3 text-rose-500 text-xs font-bold text-right">{{ item.qty_defect }}</td>
                      <td class="px-4 py-3 text-blue-600 text-xs font-bold text-right">{{ item.qty_spk }}</td>
                      <td class="px-4 py-3 text-emerald-600 text-xs font-bold text-right">{{ item.qty_produksi }}</td>
                      <td class="px-4 py-2">
                        <UInput type="number" v-model.number="inputQty[item.id]" size="sm" :ui="{ base: 'text-right font-bold' }" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Pagination Control -->
            <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                <USelect v-model="perPage" :options="[{label:'10', value:10},{label:'20', value:20},{label:'50', value:50},{label:'100', value:100}]" @change="handlePageChange(1)" size="sm" :ui="{ rounded: 'rounded-lg' }" />
              </div>
              <div class="flex items-center gap-2">
                <UButton @click="handlePageChange(1)" :disabled="currentPage === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                <UButton @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                  Page 
                  <UInput type="number" v-model.lazy="pageInput" @change="handlePageChange(pageInput)" size="2xs" :ui="{ base: 'w-12 text-center font-bold', rounded: 'rounded-md' }" /> 
                  of {{ totalPages }}
                </span>
                <UButton @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                <UButton @click="handlePageChange(totalPages)" :disabled="currentPage === totalPages" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
                <div class="w-px h-4 bg-slate-300 mx-1"></div>
                <UButton @click="loadProduk" size="xs" color="blue" variant="ghost" icon="i-heroicons-arrow-path" title="Refresh" />
              </div>
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:block">
                Showing {{ totalProdukSpk > 0 ? (currentPage - 1) * perPage + 1 : 0 }} - {{ Math.min(currentPage * perPage, totalProdukSpk) }} of {{ totalProdukSpk }}
              </div>
            </div>
          </div>
        </div>

        <!-- CREATE AKTIVITAS -->
        <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
          <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><UIcon name="i-heroicons-user-group" class="w-4 h-4" /></div>
            <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Create Group Aktivitas</h3>
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <div class="mb-5 flex flex-col sm:flex-row items-center gap-3">
              <UInput v-model="newAktivitas" placeholder="Nama Aktifitas Baru..." size="md" :ui="{ base: 'w-full font-semibold', rounded: 'rounded-xl' }" class="flex-1" />
              <UButton @click="handleCreateAktivitas" size="md" color="indigo" variant="solid" class="rounded-xl shadow-md shadow-indigo-500/20 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Create Aktivitas</UButton>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Aktifitas</label>
                <div class="relative">
                  <SharedSearchableSelect v-model="selectedGroupAktifitas" @change="loadGroup" :options="comboAktifitas" valueKey="id" labelKey="aktifitas" placeholder="-- Select Aktifitas --" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Karyawan / Shift</label>
                <div class="relative">
                  <SharedSearchableSelect v-model="selectedGroupKaryawan" :options="comboShift" valueKey="usr_id" labelKey="nama_lengkap" placeholder="-- Select Karyawan --" />
                </div>
              </div>
              <div class="md:col-span-2 flex justify-end">
                <UButton @click="handleSaveMainGroup" :disabled="!selectedGroupAktifitas || !selectedGroupKaryawan" size="sm" color="emerald" variant="solid" icon="i-heroicons-plus" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">Tambahkan ke Grup</UButton>
              </div>
            </div>
            
            <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1">
              <div class="overflow-x-auto max-h-64 custom-scrollbar">
                <table class="w-full text-sm text-left">
                  <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Karyawan / Shift</th>
                      <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px] w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="isLoadingGroup">
                      <td colspan="2" class="px-4 py-8 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                    </tr>
                    <tr v-else-if="groupAktivitasList.length === 0">
                      <td colspan="2" class="px-4 py-8 text-center text-slate-400"><UIcon name="i-heroicons-information-circle" class="w-6 h-6 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Pilih aktifitas untuk melihat grup.</p></td>
                    </tr>
                    <tr v-else v-for="item in groupAktivitasList" :key="item.id" class="border-b border-slate-50 hover:bg-indigo-50/50 transition-colors group">
                      <td class="px-4 py-3 font-extrabold text-slate-700">{{ item.nama_shift || item.nama }}</td>
                      <td class="px-4 py-3 text-center">
                        <UButton @click="handleDeleteGroup(item.id)" size="2xs" color="rose" variant="ghost" icon="i-heroicons-trash" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LIST SPK -->
      <div class="backdrop-blur-md bg-white/90 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden mt-6 relative z-10">
        <div class="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><UIcon name="i-heroicons-clipboard-document-list" class="w-4 h-4" /></div>
            <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest">List Surat Perintah Kerja</h3>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SPK Date:</span>
            <UInput type="date" v-model="filterDateSpk" size="sm" :ui="{ rounded: 'rounded-xl' }" />
            <UButton @click="loadSpk" size="sm" color="emerald" variant="solid" icon="i-heroicons-arrow-path" class="rounded-xl shadow-md shadow-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">Get Data</UButton>
            <UButton @click="handleSetPoNumber" :disabled="isSaving" size="sm" color="amber" variant="solid" icon="i-heroicons-document-check" class="rounded-xl shadow-md shadow-amber-500/20 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Set PO Number</UButton>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div class="flex flex-col">
              <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white flex-1 flex flex-col min-h-[300px]">
                <div class="overflow-x-auto custom-scrollbar flex-1 max-h-[400px]">
                  <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
                      <tr>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">PO Number</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Line</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Option</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">SPK Date</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kode Produk</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Produk</th>
                        <th class="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Premix</th>
                        <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">UOM</th>
                        <th class="px-4 py-3 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Qty Order</th>
                        <th class="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-wider text-[10px]">Check</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="isLoadingSpk">
                        <td colspan="10" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                      </tr>
                      <tr v-else-if="spkList.length === 0">
                        <td colspan="10" class="px-4 py-12 text-center text-slate-400"><UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada data</p></td>
                      </tr>
                      <tr v-else v-for="item in spkList" :key="item.id" 
                          @click="selectSpk(item)" 
                          :class="['border-b border-slate-50 cursor-pointer whitespace-nowrap transition-colors', selectedSpk?.id === item.id ? 'bg-emerald-50/80 shadow-inner' : 'hover:bg-slate-50/80']">
                        <td class="px-4 py-3">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-black" :class="(item.po_number || item.nomor_po) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'">{{ item.po_number || item.nomor_po || item.PO_NUMBER || '-' }}</span>
                        </td>
                        <td class="px-4 py-3 text-[10px] font-bold text-slate-500">{{ item.baris || '-' }}</td>
                        <td class="px-4 py-3 flex gap-1">
                          <UButton @click.stop="selectSpk(item)" size="2xs" color="gray" variant="solid" class="text-[9px] font-bold tracking-widest uppercase">MP</UButton>
                          <UButton @click.stop="handleDeleteSpk(item.id)" size="2xs" color="rose" variant="solid" icon="i-heroicons-trash" />
                        </td>
                        <td class="px-4 py-3 text-xs font-semibold text-slate-600">{{ item.spk_date ? item.spk_date : '-' }}</td>
                        <td class="px-4 py-3 text-xs font-bold text-slate-500">{{ item.kode_produk }}</td>
                        <td class="px-4 py-3 font-extrabold text-slate-700">{{ item.name_produk }}</td>
                        <td class="px-4 py-3 text-xs font-semibold text-slate-600">{{ item.name_premix }}</td>
                        <td class="px-4 py-3 text-xs font-bold text-slate-500 text-center">{{ item.uom }}</td>
                        <td class="px-4 py-3 text-xs font-black text-slate-800 text-right">{{ item.qty_order }}</td>
                        <td class="px-4 py-3 text-center">
                          <UCheckbox :model-value="item.checked" disabled color="emerald" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Pagination Control for SPK List -->
              <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rows:</span>
                  <USelect v-model="perPageSpk" :options="[{label:'10', value:10},{label:'20', value:20},{label:'50', value:50},{label:'100', value:100}]" @change="handleSpkPageChange(1)" size="sm" :ui="{ rounded: 'rounded-lg' }" />
                </div>
                <div class="flex items-center gap-2">
                  <UButton @click="handleSpkPageChange(1)" :disabled="currentSpkPage === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-left" />
                  <UButton @click="handleSpkPageChange(currentSpkPage - 1)" :disabled="currentSpkPage === 1" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-left" />
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                    Page 
                    <UInput type="number" v-model.lazy="spkPageInput" @change="handleSpkPageChange(spkPageInput)" size="2xs" :ui="{ base: 'w-12 text-center font-bold', rounded: 'rounded-md' }" /> 
                    of {{ totalSpkPages }}
                  </span>
                  <UButton @click="handleSpkPageChange(currentSpkPage + 1)" :disabled="currentSpkPage === totalSpkPages" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-right" />
                  <UButton @click="handleSpkPageChange(totalSpkPages)" :disabled="currentSpkPage === totalSpkPages" size="xs" color="gray" variant="ghost" icon="i-heroicons-chevron-double-right" />
                  <div class="w-px h-4 bg-slate-300 mx-1"></div>
                  <UButton @click="loadSpk" size="xs" color="emerald" variant="ghost" icon="i-heroicons-arrow-path" title="Refresh" />
                </div>
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:block">
                  Showing {{ totalSpkList > 0 ? (currentSpkPage - 1) * perPageSpk + 1 : 0 }} - {{ Math.min(currentSpkPage * perPageSpk, totalSpkList) }} of {{ totalSpkList }}
                </div>
              </div>
            </div>
            
            <div class="border border-slate-100 rounded-2xl bg-slate-50/50 p-5 flex flex-col h-full shadow-inner relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
              
              <h4 class="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-5">
                <UIcon name="i-heroicons-users" class="w-5 h-5 text-amber-500" />
                Pengaturan Man Power 
                <span v-if="selectedSpk" class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-xs tracking-normal ml-2">#{{ selectedSpk.po_number || selectedSpk.nomor_po || 'UNASSIGNED' }}</span>
              </h4>
              
              <div v-if="!selectedSpk" class="text-sm font-semibold text-slate-400 text-center py-16 flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                <UIcon name="i-heroicons-cursor-arrow-rays" class="w-12 h-12 mb-3 text-slate-300" />
                Pilih salah satu baris SPK di tabel sebelah kiri untuk mengatur Man Power.
              </div>
              
              <div v-else class="flex-1 flex flex-col">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative z-10">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Building</label>
                    <div class="relative">
                      <SharedSearchableSelect v-model="spkBuilding" :options="comboBuilding" placeholder="Pilih Building..." />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Aktifitas</label>
                    <div class="relative">
                      <SharedSearchableSelect v-model="spkAktifitas" :options="comboAktifitas" valueKey="id" labelKey="aktifitas" placeholder="Pilih Aktifitas..." />
                    </div>
                  </div>
                  <div class="sm:col-span-2 flex justify-end mt-1">
                    <UButton @click="handleAddMp" :disabled="!spkBuilding || !spkAktifitas" size="sm" color="amber" variant="solid" icon="i-heroicons-user-plus" class="rounded-xl shadow-md shadow-amber-500/20 font-bold uppercase tracking-wider text-[10px]">Tambah MP</UButton>
                  </div>
                </div>

                <div class="border border-slate-200 rounded-xl overflow-hidden bg-white flex-1 min-h-[200px] shadow-sm relative z-10">
                  <div class="overflow-x-auto custom-scrollbar max-h-64">
                    <table class="w-full text-xs text-left">
                      <thead class="bg-slate-100/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th class="px-3 py-2 text-center font-bold text-slate-500 uppercase tracking-wider text-[9px] w-16">Option</th>
                          <th class="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Building</th>
                          <th class="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Shift</th>
                          <th class="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Aktifitas</th>
                          <th class="px-3 py-2 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Nama Karyawan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="isLoadingMp">
                          <td colspan="5" class="px-3 py-8 text-center text-slate-400"><UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" /><p class="font-semibold text-[10px]">Memuat data...</p></td>
                        </tr>
                        <tr v-else-if="mainPowerSpkList.length === 0">
                          <td colspan="5" class="px-3 py-8 text-center text-slate-400"><UIcon name="i-heroicons-user-minus" class="w-6 h-6 mx-auto mb-2 text-slate-300" /><p class="font-semibold text-[10px]">Tidak ada Man Power yang ditugaskan.</p></td>
                        </tr>
                        <tr v-else v-for="(item, index) in mainPowerSpkList" :key="item.id" class="border-b border-slate-50 hover:bg-amber-50/50 transition-colors group whitespace-nowrap">
                          <td class="px-3 py-2 text-center">
                            <UButton @click="handleDeleteMp(item.id)" size="2xs" color="rose" variant="ghost" icon="i-heroicons-trash" />
                          </td>
                          <td class="px-3 py-2 font-bold text-slate-600">{{ item.building_name || item.building || '-' }}</td>
                          <td class="px-3 py-2 font-bold text-slate-700">{{ item.nama_shift || '-' }}</td>
                          <td class="px-3 py-2 font-semibold text-slate-600">{{ item.aktifitas || '-' }}</td>
                          <td class="px-3 py-2 font-extrabold text-slate-800">{{ item.nama_lengkap || item.nama || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMesSpk } from '~/composables/useMesSpk'
import { useProduksi } from '~/composables/useProduksi'

const {
  produkSpkList, totalProdukSpk, spkList, totalSpkList, mainPowerSpkList, groupAktivitasList,
  comboShift, comboAktifitas, comboBuilding,
  isLoadingProduk, isLoadingSpk, isLoadingMp, isLoadingGroup, isSaving,
  fetchProdukSpk, setSpk, setSpkNew, fetchSpkList, fetchComboOptions, fetchMainPowerSpk,
  updateSpk, saveMainPowerSpk, savePoOrder, deleteMainPowerSpk, deleteSpk,
  createAktivitas, saveMainGroup, fetchGroupAktivitas, deleteMainPowerGroup
} = useMesSpk()

const { activeProdId } = useProduksi()

// Filter State
const today = new Date().toISOString().split('T')[0]
const filterDateStart = ref(today)
const filterDateSpk = ref(today)
const searchProduk = ref('')

// Input State
const inputQty = ref<Record<number, number>>({})

// Group Aktivitas State
const newAktivitas = ref('')
const selectedGroupAktifitas = ref<number | ''>('')
const selectedGroupKaryawan = ref<number | ''>('')

// SPK Man Power State
const selectedSpk = ref<any>(null)
const spkBuilding = ref<number | ''>('')
const spkAktifitas = ref<number | ''>('')
const spkShift = ref<number | ''>('')

// Pagination State
const currentPage = ref(1)
const perPage = ref(10)
const pageInput = ref(1)

const totalPages = computed(() => {
  return Math.ceil(totalProdukSpk.value / perPage.value) || 1
})

const handlePageChange = (page: number) => {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
  pageInput.value = page
  loadProduk()
}

// Actions
const loadProduk = async () => {
  await fetchProdukSpk(searchProduk.value, currentPage.value, perPage.value)
  // reset qty inputs safely
  const newInputQty: Record<number, number> = {}
  produkSpkList.value.forEach(p => {
    newInputQty[p.id] = inputQty.value[p.id] || 0
  })
  inputQty.value = newInputQty
}

const handleSetOrder = async () => {
  for (const item of produkSpkList.value) {
    const qty = inputQty.value[item.id]
    if (qty > 0) {
      await setSpk({
        v_id_item: item.id,
        v_qtyset: qty.toString(),
        v_spk_date: filterDateStart.value,
        v_row: 1
      })
    }
  }
  inputQty.value = {}
  loadProduk()
  alert('Set Order Berhasil!')
}

const handleSetOrderNew = async () => {
  for (const item of produkSpkList.value) {
    const qty = inputQty.value[item.id]
    if (qty > 0) {
      await setSpkNew({
        v_id_item: item.id,
        v_qtyset: qty.toString(),
        v_spk_date: filterDateStart.value,
        v_row: 1
      })
    }
  }
  inputQty.value = {}
  loadProduk()
  alert('Set Order New Berhasil!')
}

// Pagination State for SPK
const currentSpkPage = ref(1)
const perPageSpk = ref(10)
const spkPageInput = ref(1)

const totalSpkPages = computed(() => {
  return Math.ceil(totalSpkList.value / perPageSpk.value) || 1
})

const handleSpkPageChange = (page: number) => {
  if (page < 1) page = 1
  if (page > totalSpkPages.value) page = totalSpkPages.value
  currentSpkPage.value = page
  spkPageInput.value = page
  loadSpk()
}

const loadSpk = async () => {
  await fetchSpkList(filterDateSpk.value, '', currentSpkPage.value, perPageSpk.value)
  selectedSpk.value = null
  mainPowerSpkList.value = []
}

const selectSpk = async (item: any) => {
  selectedSpk.value = item
  await fetchMainPowerSpk(item.id)
}

const handleSetPoNumber = async () => {
  if (confirm('Anda yakin ingin generate PO Number untuk tanggal ' + filterDateSpk.value + '?')) {
    const res = await savePoOrder(filterDateSpk.value)
    if (res.success) {
      alert('Berhasil generate PO Number!')
      loadSpk()
    } else {
      alert('Gagal generate PO Number.')
    }
  }
}

const handleDeleteSpk = async (id: number) => {
  if (confirm('Hapus SPK ini?')) {
    await deleteSpk(id)
    loadSpk()
  }
}

const handleUpdateSpk = async () => {
  if (!selectedSpk.value || !spkBuilding.value || !spkShift.value) return
  const res = await updateSpk({
    v_id: selectedSpk.value.id,
    v_id_building: Number(spkBuilding.value),
    v_id_shift: Number(spkShift.value),
    v_checkd: true // Defaulted based on legacy logic
  })
  if (res.success) {
    alert('SPK Updated!')
    fetchMainPowerSpk(selectedSpk.value.id)
  } else {
    alert('Update SPK Gagal')
  }
}

const handleAddMp = async () => {
  if (!selectedSpk.value || !spkBuilding.value || !spkAktifitas.value) return
  const res = await saveMainPowerSpk({
    v_id: selectedSpk.value.id,
    v_building_id: Number(spkBuilding.value),
    v_aktifitas: Number(spkAktifitas.value)
  })
  if (res.success) {
    fetchMainPowerSpk(selectedSpk.value.id)
  } else {
    alert('Tambah MP Gagal')
  }
}

const handleDeleteMp = async (id: number) => {
  if (confirm('Hapus Man Power ini?')) {
    const res = await deleteMainPowerSpk(id)
    if (res.success && selectedSpk.value) {
      fetchMainPowerSpk(selectedSpk.value.id)
    }
  }
}

const handleCreateAktivitas = async () => {
  if (!newAktivitas.value) return
  const res = await createAktivitas(newAktivitas.value)
  if (res.success) {
    newAktivitas.value = ''
    fetchComboOptions(filterDateSpk.value)
    alert('Aktivitas berhasil dibuat!')
  } else {
    alert('Gagal membuat aktivitas.')
  }
}

const loadGroup = () => {
  if (selectedGroupAktifitas.value) {
    fetchGroupAktivitas(Number(selectedGroupAktifitas.value))
  }
}

const handleSaveMainGroup = async () => {
  if (!selectedGroupAktifitas.value || !selectedGroupKaryawan.value) return
  const res = await saveMainGroup({
    v_aktifitas: Number(selectedGroupAktifitas.value),
    v_id_shift: Number(selectedGroupKaryawan.value),
    v_id_user: 0 // Will default to current user ID in backend
  })
  if (res.success) {
    loadGroup()
  } else {
    alert('Gagal menambahkan karyawan ke grup.')
  }
}

const handleDeleteGroup = async (id: number) => {
  if (confirm('Hapus dari grup?')) {
    const res = await deleteMainPowerGroup(id)
    if (res.success) {
      loadGroup()
    }
  }
}

// Watchers and Lifecycle
watch(() => filterDateSpk.value, (newVal) => {
  if (newVal) fetchComboOptions(newVal)
})

watch(() => activeProdId.value, () => {
  loadProduk()
  loadSpk()
  fetchComboOptions(filterDateSpk.value)
})

onMounted(() => {
  if (activeProdId.value) {
    loadProduk()
    loadSpk()
    fetchComboOptions(filterDateSpk.value)
  }
})
</script>
