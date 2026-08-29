import { getGlobalSettings } from '@/lib/settings'
import { SettingsManager } from '@/components/admin/settings-manager'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getGlobalSettings({ unmaskSecrets: true })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <SettingsManager initialSettings={settings} />
    </div>
  )
}
