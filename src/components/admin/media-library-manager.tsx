'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateMediaItemAction, deleteMediaItemAction, registerMediaItemAction } from '@/app/admin/actions/cms'
import { uploadMediaFile } from '@/app/admin/actions/catalog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  Plus,
  Trash2,
  Check,
  Copy,
  SlidersHorizontal,
  X,
  Upload,
  Loader2
} from 'lucide-react'

export interface MediaItemRecord {
  id: string
  url: string
  role: string
  alt_text?: string | null
  display_order?: number
  is_archived?: boolean
  created_at?: string
  products?: {
    id: string
    name: string
    slug: string
  } | null
}

interface MediaLibraryManagerProps {
  initialMedia: MediaItemRecord[]
}

const ROLES = [
  { value: 'ALL', label: 'Tous les rôles' },
  { value: 'COVER', label: 'Cover' },
  { value: 'GALLERY', label: 'Gallery' },
  { value: 'DETAIL', label: 'Détail' },
  { value: 'VARIANT', label: 'Variante' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'BACKGROUND', label: 'Background' },
  { value: 'EDITORIAL', label: 'Éditorial' }
]

export function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const router = useRouter()
  const [mediaList, setMediaList] = useState<MediaItemRecord[]>(initialMedia)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [editingItem, setEditingItem] = useState<MediaItemRecord | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Upload/Add Form State
  const [newMediaRole, setNewMediaRole] = useState('GALLERY')
  const [newMediaAlt, setNewMediaAlt] = useState('')
  const [newMediaUrl, setNewMediaUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const filteredMedia = useMemo(() => {
    return mediaList.filter(item => {
      const matchesRole = selectedRole === 'ALL' || item.role === selectedRole
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        item.url.toLowerCase().includes(query) ||
        (item.alt_text && item.alt_text.toLowerCase().includes(query)) ||
        (item.products?.name && item.products.name.toLowerCase().includes(query))

      return matchesRole && matchesSearch
    })
  }, [mediaList, selectedRole, searchQuery])

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleUpdateItem = async () => {
    if (!editingItem) return
    setIsActionLoading(true)

    const res = await updateMediaItemAction(editingItem.id, {
      role: editingItem.role,
      alt_text: editingItem.alt_text || '',
      is_archived: editingItem.is_archived
    })

    setIsActionLoading(false)

    if (res.success) {
      setMediaList(prev =>
        prev.map(m => (m.id === editingItem.id ? { ...m, ...editingItem } : m))
      )
      setEditingItem(null)
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Êtes-vous certain de vouloir supprimer ce média ?')) return
    setIsActionLoading(true)

    const res = await deleteMediaItemAction(id)
    setIsActionLoading(false)

    if (res.success) {
      setMediaList(prev => prev.filter(m => m.id !== id))
      if (editingItem?.id === id) setEditingItem(null)
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadMediaFile(formData)
    setIsUploading(false)

    if (res.success && res.url) {
      setNewMediaUrl(res.url)
    } else {
      alert(res.error || "Erreur lors de l'upload du fichier")
    }
  }

  const handleRegisterNewMedia = async () => {
    if (!newMediaUrl) {
      alert('Veuillez fournir une URL de média ou uploader un fichier.')
      return
    }

    setIsActionLoading(true)
    const res = await registerMediaItemAction({
      url: newMediaUrl,
      role: newMediaRole,
      alt_text: newMediaAlt
    })
    setIsActionLoading(false)

    if (res.success && res.id) {
      const newItem: MediaItemRecord = {
        id: res.id,
        url: newMediaUrl,
        role: newMediaRole,
        alt_text: newMediaAlt,
        display_order: 0,
        is_archived: false,
        products: null
      }
      setMediaList(prev => [newItem, ...prev])
      setIsAddModalOpen(false)
      setNewMediaUrl('')
      setNewMediaAlt('')
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium block">
            KenDji Luxury &bull; Assets Studio
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mt-1">
            Médiathèque &amp; Photothèque
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les visuels de studio, fonds atmosphériques et médias éditoriaux ({mediaList.length} éléments).
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 hover:bg-black text-white px-6 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Ajouter un Média
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par bijou, description alt ou chemin d'image..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Rôle:
          </span>
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setSelectedRole(r.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedRole === r.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            onClick={() => setEditingItem(item)}
            className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col cursor-pointer hover:border-gray-900 transition-all hover:shadow-md"
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Image
                src={item.url}
                alt={item.alt_text || item.products?.name || 'Média'}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-black/80 backdrop-blur-sm text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded">
                  {item.role}
                </span>
              </div>
            </div>

            <div className="p-3 text-xs flex-1 flex flex-col justify-between space-y-1">
              <p className="font-semibold text-gray-900 truncate" title={item.products?.name || item.alt_text || item.url}>
                {item.products?.name || item.alt_text || 'Média Indépendant'}
              </p>
              <p className="text-[11px] text-gray-500 truncate" title={item.url}>
                {item.url}
              </p>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-lg border border-dashed">
            Aucun média ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl border">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-serif font-bold text-gray-900">Détails du Média</h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                <Image
                  src={editingItem.url}
                  alt={editingItem.alt_text || 'Preview'}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs">Rôle du Média</Label>
                  <select
                    value={editingItem.role}
                    onChange={e =>
                      setEditingItem({ ...editingItem, role: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-md border text-xs"
                  >
                    {ROLES.filter(r => r.value !== 'ALL').map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Texte Alternatif (Alt SEO)</Label>
                  <Input
                    value={editingItem.alt_text || ''}
                    onChange={e =>
                      setEditingItem({ ...editingItem, alt_text: e.target.value })
                    }
                    placeholder="Description pour l'accessibilité..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Association Produit</Label>
                  <p className="text-xs text-gray-700 font-medium bg-gray-50 p-2 rounded border truncate">
                    {editingItem.products?.name || 'Non associé (Média Global)'}
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopyUrl(editingItem.id, editingItem.url)}
                    className="w-full text-xs flex items-center justify-center gap-1.5"
                  >
                    {copiedId === editingItem.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> URL Copiée !
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copier l&apos;URL publique
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDeleteItem(editingItem.id)}
                disabled={isActionLoading}
                className="text-xs flex items-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="text-xs"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateItem}
                  disabled={isActionLoading}
                  className="bg-gray-900 hover:bg-black text-white text-xs"
                >
                  {isActionLoading ? 'Mise à jour...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-6 shadow-2xl border">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-serif font-bold text-gray-900">Ajouter un Nouveau Média</h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload Option */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-2 hover:border-gray-500 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="text-xs text-gray-600 font-medium">Uploader depuis l&apos;ordinateur</p>
                <p className="text-[11px] text-gray-400">JPG, PNG, WEBP jusqu&apos;à 5MB</p>
                <label className="inline-block cursor-pointer">
                  <span className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider">
                    {isUploading ? 'Envoi en cours...' : 'Choisir un fichier'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDirectUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-gray-400">ou URL directe</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Chemin ou URL du Média</Label>
                <Input
                  value={newMediaUrl}
                  onChange={e => setNewMediaUrl(e.target.value)}
                  placeholder="/products/product-1/1.jpg ou https://..."
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Rôle</Label>
                  <select
                    value={newMediaRole}
                    onChange={e => setNewMediaRole(e.target.value)}
                    className="w-full h-9 px-3 rounded-md border text-xs"
                  >
                    {ROLES.filter(r => r.value !== 'ALL').map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Texte Alt (SEO)</Label>
                  <Input
                    value={newMediaAlt}
                    onChange={e => setNewMediaAlt(e.target.value)}
                    placeholder="Ex: Parure en or rose..."
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleRegisterNewMedia}
                disabled={isActionLoading || !newMediaUrl}
                className="bg-gray-900 hover:bg-black text-white text-xs"
              >
                {isActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  'Ajouter à la Médiathèque'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
