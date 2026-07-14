'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, PauseCircle, PlayCircle } from 'lucide-react'
import { toast } from 'sonner'

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

interface DayHours {
  open: string
  close: string
  closed: boolean
}

export default function AdminSettingsPage() {
  const [maxSandwiches, setMaxSandwiches] = useState(10)
  const [maxPerDay, setMaxPerDay] = useState(0)
  const [openingHours, setOpeningHours] = useState<Record<string, DayHours>>({})
  const [storePaused, setStorePaused] = useState(false)
  const [pauseMessage, setPauseMessage] = useState('')
  const [announcementEnabled, setAnnouncementEnabled] = useState(false)
  const [announcementNl, setAnnouncementNl] = useState('')
  const [announcementEn, setAnnouncementEn] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const res = await fetch('/api/admin/settings')
    const data = await res.json()

    if (data.settings) {
      if (data.settings.max_sandwiches_per_slot) {
        setMaxSandwiches(data.settings.max_sandwiches_per_slot.value || 10)
      }
      if (data.settings.opening_hours) {
        setOpeningHours(data.settings.opening_hours)
      }
      if (data.settings.max_sandwiches_per_day) {
        setMaxPerDay(data.settings.max_sandwiches_per_day.value || 0)
      }
      if (data.settings.store_paused) {
        setStorePaused(data.settings.store_paused.value || false)
        setPauseMessage(data.settings.store_paused.message || '')
      }
      if (data.settings.announcement) {
        setAnnouncementEnabled(data.settings.announcement.enabled || false)
        setAnnouncementNl(data.settings.announcement.text_nl || '')
        setAnnouncementEn(data.settings.announcement.text_en || '')
      }
    }
    setLoading(false)
  }

  async function saveSetting(key: string, value: any) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    return res.ok
  }

  async function handleSaveAll() {
    setSaving(true)

    const results = await Promise.all([
      saveSetting('max_sandwiches_per_slot', { value: maxSandwiches }),
      saveSetting('max_sandwiches_per_day', { value: maxPerDay }),
      saveSetting('opening_hours', openingHours),
      saveSetting('store_paused', { value: storePaused, message: pauseMessage }),
      saveSetting('announcement', {
        enabled: announcementEnabled,
        text_nl: announcementNl,
        text_en: announcementEn,
      }),
    ])

    if (results.every(Boolean)) {
      toast.success('Settings saved')
    } else {
      toast.error('Some settings could not be saved')
    }
    setSaving(false)
  }

  async function toggleStorePause() {
    const newValue = !storePaused
    setStorePaused(newValue)
    await saveSetting('store_paused', { value: newValue, message: pauseMessage })
    toast.success(newValue ? 'Store paused' : 'Store resumed')
  }

  function updateDayHours(day: string, field: keyof DayHours, value: string | boolean) {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-3xl uppercase tracking-wider text-espresso">Settings</h1>
          <p className="text-gray-500 font-lato mt-1">Manage your store settings</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-tomato text-white rounded-lg font-oswald uppercase tracking-wider hover:bg-red-700 transition disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      {/* Store Pause */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso">Store status</h2>
          <button
            onClick={toggleStorePause}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-oswald uppercase text-sm tracking-wider transition ${
              storePaused
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {storePaused ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            {storePaused ? 'Paused' : 'Open'}
          </button>
        </div>
        {storePaused && (
          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Message for customers
            </label>
            <input
              type="text"
              value={pauseMessage}
              onChange={(e) => setPauseMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
              placeholder="E.g.: We are temporarily closed due to..."
            />
          </div>
        )}
      </div>

      {/* Max Sandwiches */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso mb-4">Capacity</h2>
        <div className="space-y-6">
          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Maximum sandwiches per time slot (15 min)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={maxSandwiches}
              onChange={(e) => setMaxSandwiches(parseInt(e.target.value) || 1)}
              className="w-32 px-4 py-2 border border-gray-300 rounded font-lato text-lg focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
            />
            <p className="text-gray-400 text-xs mt-1 font-lato">
              When this number is reached, the time slot will no longer be shown to customers.
            </p>
          </div>
          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Maximum sandwiches per day
            </label>
            <input
              type="number"
              min={0}
              max={1000}
              value={maxPerDay}
              onChange={(e) => setMaxPerDay(parseInt(e.target.value) || 0)}
              className="w-32 px-4 py-2 border border-gray-300 rounded font-lato text-lg focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
            />
            <p className="text-gray-400 text-xs mt-1 font-lato">
              When this number is reached, no more orders will be accepted. 0 = unlimited.
            </p>
          </div>
        </div>
      </div>

      {/* Announcement / daily special */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso">Announcement</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer"
            />
            <span className="font-lato text-sm text-gray-600">{announcementEnabled ? 'Visible on website' : 'Off'}</span>
          </label>
        </div>
        <p className="text-gray-400 text-xs mb-4 font-lato">
          Show a banner on the website — e.g. a daily special or holiday notice. Don&apos;t forget to press Save.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Text (Nederlands)
            </label>
            <input
              type="text"
              value={announcementNl}
              onChange={(e) => setAnnouncementNl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
              placeholder="Bijv.: Vandaag: verse Porchetta schiacciata!"
            />
          </div>
          <div>
            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">
              Text (English)
            </label>
            <input
              type="text"
              value={announcementEn}
              onChange={(e) => setAnnouncementEn(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
              placeholder="E.g.: Today: fresh Porchetta schiacciata!"
            />
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso mb-4">Opening hours</h2>
        <div className="space-y-3">
          {DAYS.map(({ key, label }) => {
            const day = openingHours[key] || { open: '08:00', close: '16:00', closed: false }
            return (
              <div key={key} className="flex items-center gap-4">
                <span className="w-28 font-oswald text-sm uppercase tracking-wider text-espresso">{label}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!day.closed}
                    onChange={(e) => updateDayHours(key, 'closed', !e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-tomato focus:ring-tomato cursor-pointer"
                  />
                  <span className="font-lato text-xs text-gray-500">{day.closed ? 'Closed' : 'Open'}</span>
                </label>
                {!day.closed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.open}
                      onChange={(e) => updateDayHours(key, 'open', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm font-lato focus:border-tomato outline-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="time"
                      value={day.close}
                      onChange={(e) => updateDayHours(key, 'close', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm font-lato focus:border-tomato outline-none"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
