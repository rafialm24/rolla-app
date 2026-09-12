import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useProduksi } from './useProduksi'

export const useReportDaily = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()
  const { activeProdId } = useProduksi()

  // ── State ────────────────────────────────────────────────────
  const dailyList = ref<any[]>([])
  const dailyItemList = ref<any[]>([])
  const dailyMatrialList = ref<any[]>([])
  const dailyAdvList = ref<any[]>([])
  const dailySpList = ref<any[]>([])

  const isLoadingDaily = ref(false)
  const isLoadingDailyItem = ref(false)
  const isLoadingDailyMatrial = ref(false)

  // ── Helper fetch ─────────────────────────────────────────────
  const buildQ = (startDate: string, endDate: string, extra: Record<string, string> = {}) => {
    const q = new URLSearchParams()
    q.append('v_start_date', startDate)
    q.append('v_end_date', endDate)
    for (const [k, v] of Object.entries(extra)) q.append(k, v)
    q.append('v_prod_id', String(activeProdId.value || 0))
    return q.toString()
  }

  // 1. Daily Summary (per tanggal)
  const fetchDaily = async (startDate: string, endDate: string) => {
    isLoadingDaily.value = true
    dailyList.value = []
    try {
      const res: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/report/daily/get?${buildQ(startDate, endDate)}`,
        { headers: { Authorization: `Bearer ${accessToken.value}` } }
      )
      let data = res.data || res.rows || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        dailyList.value = data[0].rows
      } else {
        dailyList.value = Array.isArray(data) ? data : []
      }
      return { success: true }
    } catch (err) {
      console.error('Error fetchDaily:', err)
      dailyList.value = []
      return { success: false }
    } finally {
      isLoadingDaily.value = false
    }
  }

  // 2. Daily Detail (per item/produk)
  const fetchDailyItem = async (startDate: string, endDate: string) => {
    isLoadingDailyItem.value = true
    dailyItemList.value = []
    try {
      const res: any = await $fetch(
        `${config.public.apiBase || ''}/produksi/report/daily/item?${buildQ(startDate, endDate)}`,
        { headers: { Authorization: `Bearer ${accessToken.value}` } }
      )
      let data = res.data || res.rows || res || []
      if (Array.isArray(data) && data.length > 0 && data[0].rows) {
        dailyItemList.value = data[0].rows
      } else {
        dailyItemList.value = Array.isArray(data) ? data : []
      }
      return { success: true }
    } catch (err) {
      console.error('Error fetchDailyItem:', err)
      dailyItemList.value = []
      return { success: false }
    } finally {
      isLoadingDailyItem.value = false
    }
  }

  // 3. Daily Material — 3 tabel (mix_id: 1=RM, 2=Support, 3=Additive)
  const fetchDailyMatrial = async (startDate: string, endDate: string) => {
    isLoadingDailyMatrial.value = true
    dailyMatrialList.value = []
    dailyAdvList.value = []
    dailySpList.value = []
    try {
      const [resRm, resAdv, resSp] = await Promise.all([
        $fetch(`${config.public.apiBase || ''}/produksi/report/daily/matrial?${buildQ(startDate, endDate, { v_mix_id: '1' })}`,
          { headers: { Authorization: `Bearer ${accessToken.value}` } }),
        $fetch(`${config.public.apiBase || ''}/produksi/report/daily/matrial?${buildQ(startDate, endDate, { v_mix_id: '3' })}`,
          { headers: { Authorization: `Bearer ${accessToken.value}` } }),
        $fetch(`${config.public.apiBase || ''}/produksi/report/daily/matrial?${buildQ(startDate, endDate, { v_mix_id: '2' })}`,
          { headers: { Authorization: `Bearer ${accessToken.value}` } }),
      ])
      const extract = (r: any) => {
        let d = (r as any).data || (r as any).rows || r || []
        if (Array.isArray(d) && d.length > 0 && d[0].rows) return d[0].rows
        return Array.isArray(d) ? d : []
      }
      dailyMatrialList.value = extract(resRm)
      dailyAdvList.value = extract(resAdv)
      dailySpList.value = extract(resSp)
      return { success: true }
    } catch (err) {
      console.error('Error fetchDailyMatrial:', err)
      return { success: false }
    } finally {
      isLoadingDailyMatrial.value = false
    }
  }

  // ── Export CSV ───────────────────────────────────────────────
  const exportCsv = (data: any[], columns: { key: string; label: string }[], filename: string) => {
    if (!data.length) return
    const header = columns.map(c => c.label).join(',')
    const rows = data.map(row =>
      columns.map(c => {
        const v = row[c.key] ?? ''
        return `"${String(v).replace(/"/g, '""')}"`
      }).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Grand total helper ────────────────────────────────────────
  const sumField = (data: any[], key: string): number =>
    data.reduce((s, r) => s + (parseFloat(r[key]) || 0), 0)

  return {
    dailyList,
    dailyItemList,
    dailyMatrialList,
    dailyAdvList,
    dailySpList,
    isLoadingDaily,
    isLoadingDailyItem,
    isLoadingDailyMatrial,
    fetchDaily,
    fetchDailyItem,
    fetchDailyMatrial,
    exportCsv,
    sumField,
  }
}
