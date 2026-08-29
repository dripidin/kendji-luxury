'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HomepageContent } from '@/lib/cms'
import { saveHomepageContentAction } from '@/app/admin/actions/cms'
import { Product, Collection, BACKGROUND_ASSETS } from '@/lib/catalog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react'

interface ContentManagerProps {
  initialContent: HomepageContent
  products: Product[]
  collections: Collection[]
}

export function ContentManager({
  initialContent,
  products,
  collections
}: ContentManagerProps) {
  const router = useRouter()
  const [content, setContent] = useState<HomepageContent>(initialContent)
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'featured' | 'trust' | 'finalCta'>('hero')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    const res = await saveHomepageContentAction(content)
    setIsSaving(false)

    if (res.success) {
      setSaveSuccess(true)
      router.refresh()
      setTimeout(() => setSaveSuccess(false), 4000)
    } else {
      setSaveError(res.error || 'Erreur lors de la sauvegarde.')
    }
  }

  const bgAssetsList = Object.values(BACKGROUND_ASSETS)

  return (
    <div className="space-y-8">
      {/* Header & Global Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium block">
            KenDji Luxury &bull; Editorial Studio
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mt-1">
            Gestion du Contenu Accueil (CMS)
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Personnalisez les sections éditoriales, accroches et médias de la page d&apos;accueil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Enregistré avec succès
            </span>
          )}
          {saveError && (
            <span className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md">
              {saveError}
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2 text-xs uppercase tracking-widest transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enregistrement...
              </>
            ) : (
              'Enregistrer les Modifications'
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-4 rounded-t-lg overflow-x-auto scrollbar-none">
        {[
          { id: 'hero', label: '1. Section Hero' },
          { id: 'story', label: '2. Story & Éditorial' },
          { id: 'featured', label: '3. Produits & Collections' },
          { id: 'trust', label: '4. Engagements & Confiance' },
          { id: 'finalCta', label: '5. Bannière Finale' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`py-4 px-6 text-xs uppercase tracking-wider font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero */}
      {activeTab === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Section Hero Principale</CardTitle>
            <CardDescription>
              L&apos;élément d&apos;impact visuel inaugural de la boutique en ligne.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hero-headline">Titre Principal (Headline)</Label>
                <Input
                  id="hero-headline"
                  value={content.hero.headline}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, headline: e.target.value }
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hero-product">Bijou Signature en Vedette (Hero Product)</Label>
                  {content.hero.featured_product_slug && (
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, featured_product_slug: '' }
                        })
                      }
                      className="text-[11px] text-red-600 hover:text-red-800 underline font-medium"
                    >
                      Effacer la sélection (Mode Automatique)
                    </button>
                  )}
                </div>
                <select
                  id="hero-product"
                  value={content.hero.featured_product_slug || ''}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, featured_product_slug: e.target.value }
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Sélection automatique (Pièce vedette prioritaire)</option>
                  {products.map(p => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} ({Number(p.price).toLocaleString('fr-FR')} DA)
                    </option>
                  ))}
                </select>

                {/* Selected Product Live Preview Card */}
                {(() => {
                  const selectedProd = products.find(p => p.slug === content.hero.featured_product_slug)
                  if (!selectedProd) return null
                  return (
                    <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-gray-50/80 mt-2">
                      <div className="relative h-14 w-14 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                        <Image
                          src={selectedProd.coverImage}
                          alt={selectedProd.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-900 truncate">
                            {selectedProd.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Actif Hero
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono">
                          SKU: {selectedProd.id} &bull; Catégorie: {selectedProd.category}
                        </p>
                        <p className="text-xs font-mono font-bold text-gray-900">
                          {Number(selectedProd.price).toLocaleString('fr-FR')} DA
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-subheadline">Sous-titre / Accroche Éditoriale</Label>
              <Textarea
                id="hero-subheadline"
                rows={3}
                value={content.hero.subheadline}
                onChange={e =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheadline: e.target.value }
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hero-cta-label">Texte du Bouton Principal</Label>
                <Input
                  id="hero-cta-label"
                  value={content.hero.primary_cta_label}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primary_cta_label: e.target.value }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-cta-url">Lien du Bouton Principal</Label>
                <Input
                  id="hero-cta-url"
                  value={content.hero.primary_cta_url}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, primary_cta_url: e.target.value }
                    })
                  }
                />
              </div>
            </div>

            {/* Background Media Picker */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-amber-600" />
                Arrière-plan Atmosphérique Hero (6 fonds signatures)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {bgAssetsList.map(bg => (
                  <button
                    key={bg.code}
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, background_media: bg.path }
                      })
                    }
                    className={`relative aspect-[4/3] rounded border-2 overflow-hidden text-left transition-all ${
                      content.hero.background_media === bg.path
                        ? 'border-gray-900 ring-2 ring-gray-900/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={bg.path}
                      alt={bg.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-1.5">
                      <span className="text-[9px] text-white font-medium truncate">
                        {bg.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Story & Editorial */}
      {activeTab === 'story' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Récit de Marque (Brand Story)</CardTitle>
              <CardDescription>
                Présentez la genèse et les valeurs de savoir-faire joaillier de KenDji.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="story-title">Titre du Récit</Label>
                <Input
                  id="story-title"
                  value={content.brand_story.title}
                  onChange={e =>
                    setContent({
                      ...content,
                      brand_story: { ...content.brand_story, title: e.target.value }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story-body">Texte du Récit</Label>
                <Textarea
                  id="story-body"
                  rows={4}
                  value={content.brand_story.body}
                  onChange={e =>
                    setContent({
                      ...content,
                      brand_story: { ...content.brand_story, body: e.target.value }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moment Éditorial (Editorial Moment)</CardTitle>
              <CardDescription>
                Une pause poétique et contemplative valorisant l&apos;élégance du bijou.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editorial-title">Titre Éditorial</Label>
                <Input
                  id="editorial-title"
                  value={content.editorial_moment.title}
                  onChange={e =>
                    setContent({
                      ...content,
                      editorial_moment: { ...content.editorial_moment, title: e.target.value }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editorial-body">Texte Éditorial</Label>
                <Textarea
                  id="editorial-body"
                  rows={3}
                  value={content.editorial_moment.body}
                  onChange={e =>
                    setContent({
                      ...content,
                      editorial_moment: { ...content.editorial_moment, body: e.target.value }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Featured Products & Collections */}
      {activeTab === 'featured' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Signature à l&apos;Honneur</CardTitle>
              <CardDescription>
                Mettez en avant un univers de collection spécifique sur l&apos;accueil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feat-collection">Collection Vedette</Label>
                <select
                  id="feat-collection"
                  value={content.featured_collection.collection_slug}
                  onChange={e =>
                    setContent({
                      ...content,
                      featured_collection: {
                        ...content.featured_collection,
                        collection_slug: e.target.value
                      }
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {collections.map(c => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feat-col-title">Titre Personnalisé (Optionnel)</Label>
                  <Input
                    id="feat-col-title"
                    placeholder="Signature Motifs"
                    value={content.featured_collection.title_override || ''}
                    onChange={e =>
                      setContent({
                        ...content,
                        featured_collection: {
                          ...content.featured_collection,
                          title_override: e.target.value
                        }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feat-col-desc">Description Personnalisée (Optionnel)</Label>
                  <Input
                    id="feat-col-desc"
                    value={content.featured_collection.description_override || ''}
                    onChange={e =>
                      setContent({
                        ...content,
                        featured_collection: {
                          ...content.featured_collection,
                          description_override: e.target.value
                        }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pièces Vedettes de la Page d&apos;Accueil</CardTitle>
                  <CardDescription className="mt-1">
                    La section « Créations Emblématiques » affiche dynamiquement tous les bijoux publiés marqués <strong>« Vedette Accueil »</strong> (is_featured = true) dans le catalogue.
                  </CardDescription>
                </div>
                <Link
                  href="/admin/products"
                  className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded border border-gray-300 hover:border-gray-900 transition-colors"
                >
                  Gérer dans le Catalogue &rarr;
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 mb-4 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Synchronisation Directe avec le Catalogue
                </p>
                <p>
                  Vous pouvez activer ou désactiver la mise en vedette de n&apos;importe quel bijou d&apos;un simple clic sur l&apos;étoile dans la liste des <Link href="/admin/products" className="underline font-medium">Produits</Link> ou dans son formulaire d&apos;édition.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
                {products.map(prod => {
                  const isSelected = prod.isFeatured || (content.featured_products?.product_slugs || []).includes(prod.slug)
                  return (
                    <div
                      key={prod.slug}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/40'
                          : 'border-gray-200 opacity-70'
                      }`}
                    >
                      <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={prod.coverImage}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-900 truncate">{prod.name}</p>
                        <p className="text-[11px] text-gray-500">{Number(prod.price).toLocaleString('fr-FR')} DA</p>
                      </div>
                      <div className="text-right">
                        {isSelected ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            ★ En Vedette
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            Non
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Trust */}
      {activeTab === 'trust' && (
        <Card>
          <CardHeader>
            <CardTitle>Engagements de Confiance & Réassurance COD</CardTitle>
            <CardDescription>
              Arguments clés affichés sur la page d&apos;accueil pour maximiser le taux de conversion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="trust-title">Titre de la Section Confiance</Label>
              <Input
                id="trust-title"
                value={content.trust_section.title}
                onChange={e =>
                  setContent({
                    ...content,
                    trust_section: { ...content.trust_section, title: e.target.value }
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              {content.trust_section.items.map((item, idx) => (
                <div key={idx} className="space-y-3 p-4 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      Engagement #{idx + 1}
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Titre</Label>
                    <Input
                      value={item.title}
                      onChange={e => {
                        const nextItems = [...content.trust_section.items]
                        nextItems[idx] = { ...item, title: e.target.value }
                        setContent({
                          ...content,
                          trust_section: { ...content.trust_section, items: nextItems }
                        })
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      rows={2}
                      value={item.description}
                      onChange={e => {
                        const nextItems = [...content.trust_section.items]
                        nextItems[idx] = { ...item, description: e.target.value }
                        setContent({
                          ...content,
                          trust_section: { ...content.trust_section, items: nextItems }
                        })
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Final CTA */}
      {activeTab === 'finalCta' && (
        <Card>
          <CardHeader>
            <CardTitle>Bannière d&apos;Appel à l&apos;Action Finale</CardTitle>
            <CardDescription>
              Le dernier contact visuel en bas de page pour convertir le visiteur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cta-title">Titre Final</Label>
                <Input
                  id="cta-title"
                  value={content.final_cta.title}
                  onChange={e =>
                    setContent({
                      ...content,
                      final_cta: { ...content.final_cta, title: e.target.value }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-btn-text">Texte du Bouton</Label>
                <Input
                  id="cta-btn-text"
                  value={content.final_cta.cta_label}
                  onChange={e =>
                    setContent({
                      ...content,
                      final_cta: { ...content.final_cta, cta_label: e.target.value }
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta-desc">Description</Label>
              <Textarea
                id="cta-desc"
                rows={2}
                value={content.final_cta.description}
                onChange={e =>
                  setContent({
                    ...content,
                    final_cta: { ...content.final_cta, description: e.target.value }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
