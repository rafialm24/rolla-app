import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useMesSpk = () => {
  const config = useRuntimeConfig()
  const { accessToken, logout } = useAuth()
  const { activeProdId } = useProduksi()

  // State
  const produkSpkList = ref<any[]>([])
  const totalProdukSpk = ref(0)
  const spkList = ref<any[]>([])
  const totalSpkList = ref(0)
  const mainPowerSpkList = ref<any[]>([])
  const groupAktivitasList = ref<any[]>([])

  // Combo Options
  const comboShift = ref<any[]>([])
  const comboAktifitas = ref<any[]>([])
  const comboBuilding = ref<any[]>([])

  // Loaders
  const isLoadingProduk = ref(false)
  const isLoadingSpk = ref(false)
  const isLoadingMp = ref(false)
  const isLoadingGroup = ref(false)
  const isSaving = ref(false)

  // 1. List Produk SPK
  const fetchProdukSpk = async (keyword = '', page = 1, rows = 10) => {
    isLoadingProduk.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/list-produk-spk?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      produkSpkList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      if (res.total) {
        totalProdukSpk.value = Number(res.total)
      } else {
        totalProdukSpk.value = produkSpkList.value.length
      }
    } catch (err: any) {
      console.error('Error fetchProdukSpk:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingProduk.value = false
    }
  }

  // 2. Set SPK
  const setSpk = async (payload: { v_id_item: number, v_qtyset: string, v_spk_date: string, v_row: number }) => {
    isSaving.value = true
    try {
      const body = {
        v_id_prod: activeProdId.value || 0,
        ...payload
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/set-spk`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error setSpk:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 3. Set SPK New
  const setSpkNew = async (payload: { v_id_item: number, v_qtyset: string, v_spk_date: string, v_row: number }) => {
    isSaving.value = true
    try {
      const body = {
        v_id_prod: activeProdId.value || 0,
        ...payload
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/set-spk-new`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error setSpkNew:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 4. List SPK
  const fetchSpkList = async (spkDate: string, keyword = '', page = 1, rows = 10) => {
    isLoadingSpk.value = true
    try {
      const q = new URLSearchParams()
      if (keyword) q.append('var_where', keyword)
      q.append('var_page_number', page.toString())
      q.append('var_row_page', rows.toString())
      q.append('v_spk_date', spkDate)
      q.append('v_id_prod', String(activeProdId.value || 0))

      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/list-spk?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      spkList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
      if (res.total) {
        totalSpkList.value = Number(res.total)
      } else {
        totalSpkList.value = spkList.value.length
      }
      return res
    } catch (err: any) {
      console.error('Error fetchSpkList:', err)
      if (err.response?.status === 401) logout()
    } finally {
      isLoadingSpk.value = false
    }
  }

  // 5. Fetch Combo Options
  const fetchComboOptions = async (spkDate: string) => {
    try {
      // Shift / Karyawan
      const qShift = new URLSearchParams()
      const todayStr = new Date().toISOString().slice(0, 10)
      qShift.append('v_tanggal', todayStr)
      const resShift: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/main-power-combo-rolla?${qShift.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let dataShift = resShift.rows || resShift.data || resShift || []
      comboShift.value = Array.isArray(dataShift) && dataShift.length > 0 && dataShift[0].rows ? dataShift[0].rows : dataShift

      // Aktifitas
      const resAktifitas: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/get-aktifitas`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let dataAktifitas = resAktifitas.rows || resAktifitas.data || resAktifitas || []
      comboAktifitas.value = Array.isArray(dataAktifitas) && dataAktifitas.length > 0 && dataAktifitas[0].rows ? dataAktifitas[0].rows : dataAktifitas

      // Building
      const resBuilding: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/get-building2`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let dataBuilding = resBuilding.rows || resBuilding.data || resBuilding || []
      comboBuilding.value = Array.isArray(dataBuilding) && dataBuilding.length > 0 && dataBuilding[0].rows ? dataBuilding[0].rows : dataBuilding

    } catch (err) {
      console.error('Error fetchComboOptions:', err)
    }
  }

  // 6. Main Power List for SPK
  const fetchMainPowerSpk = async (idSpk: number) => {
    isLoadingMp.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_spk', idSpk.toString())
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/main-power-list-spk?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      mainPowerSpkList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err) {
      console.error('Error fetchMainPowerSpk:', err)
    } finally {
      isLoadingMp.value = false
    }
  }

  // 7. Update SPK
  const updateSpk = async (payload: { v_id: number, v_id_building: number, v_id_shift: number, v_checkd: boolean }) => {
    try {
      const body = {
        ...payload,
        v_id_prod: activeProdId.value || 0
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/action-update-spk`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error updateSpk:', err)
      return { success: false }
    }
  }

  // 8. Save Main Power SPK
  const saveMainPowerSpk = async (payload: { v_id: number, v_building_id: number, v_aktifitas: number }) => {
    isSaving.value = true
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/save-main-power-spk-new`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error saveMainPowerSpk:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 9. Save PO Order
  const savePoOrder = async (spkDate: string) => {
    isSaving.value = true
    try {
      const body = {
        v_start_date: spkDate,
        v_id_prod: activeProdId.value || 0
      }
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/set-multi-item-produksi-order-spk`, {
        method: 'POST',
        body,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error savePoOrder:', err)
      return { success: false }
    } finally {
      isSaving.value = false
    }
  }

  // 10. Delete Main Power SPK
  const deleteMainPowerSpk = async (id: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/delete-main-power-spk`, {
        method: 'POST',
        body: { v_id: id },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error deleteMainPowerSpk:', err)
      return { success: false }
    }
  }

  // 11. Delete SPK
  const deleteSpk = async (id: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/delete-spk`, {
        method: 'POST',
        body: { v_id: id },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error deleteSpk:', err)
      return { success: false }
    }
  }

  // 12. Create Aktivitas
  const createAktivitas = async (reference: string) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/create-aktivitas`, {
        method: 'POST',
        body: { v_act: reference },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error createAktivitas:', err)
      return { success: false }
    }
  }

  // 13. Save Main Group
  const saveMainGroup = async (payload: { v_aktifitas: number, v_id_shift: number, v_id_user: number }) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/save-main-group`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error saveMainGroup:', err)
      return { success: false }
    }
  }

  // 14. Fetch Main Power List (Group)
  const fetchGroupAktivitas = async (idAktifitas: number) => {
    isLoadingGroup.value = true
    try {
      const q = new URLSearchParams()
      q.append('v_id_akt', idAktifitas.toString())
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/get-main-power-list?${q.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      let data = res.rows || res.data || res || []
      groupAktivitasList.value = Array.isArray(data) && data.length > 0 && data[0].rows ? data[0].rows : data
    } catch (err) {
      console.error('Error fetchGroupAktivitas:', err)
    } finally {
      isLoadingGroup.value = false
    }
  }

  // 15. Delete Main Power Group
  const deleteMainPowerGroup = async (id: number) => {
    try {
      const res: any = await $fetch(`${config.public.apiBase || ''}/produksi/mes/delete-main-power-group`, {
        method: 'POST',
        body: { v_id: id },
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error deleteMainPowerGroup:', err)
      return { success: false }
    }
  }


  return {
    produkSpkList, totalProdukSpk, spkList, totalSpkList, mainPowerSpkList, groupAktivitasList,
    comboShift, comboAktifitas, comboBuilding,
    isLoadingProduk, isLoadingSpk, isLoadingMp, isLoadingGroup, isSaving,
    fetchProdukSpk, setSpk, setSpkNew, fetchSpkList, fetchComboOptions, fetchMainPowerSpk,
    updateSpk, saveMainPowerSpk, savePoOrder, deleteMainPowerSpk, deleteSpk,
    createAktivitas, saveMainGroup, fetchGroupAktivitas, deleteMainPowerGroup
  }
}
