'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/storefront/product/product-card'
import { StorefrontProduct } from '@/lib/storefront-catalog'
import { Category } from '@/lib/catalog'
import { SlidersHorizontal, Sparkles } from 'lucide-react'

interface CatalogGridProps {
  initialProducts: StorefrontProduct[]
  categories?: Category[]
  activeCategorySlug?: string
  pageTitle?: string
  pageSubtitle?: string
  showCategoryFilters?: boolean
}

export function CatalogGrid({
  initialProducts,
  categories = [],
  activeCategorySlug,
  pageTitle = 'Toutes les Créations',
  pageSubtitle = 'Découvrez l’intégralité de la collection joaillière KenDji Luxury.',
  showCategoryFilters = true
}: CatalogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategorySlug || 'all')
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default')

  // Filter products by category if on Shop All
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts]

    if (showCategoryFilters && selectedCategory !== 'all') {
      list = list.filter(p => p.categorySlug === selectedCategory)
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [initialProducts, selectedCategory, sortBy, showCategoryFilters])

  return (
    <div className="space-y-12">
      {/* Header & Controls */}
      <div className="border-b border-[#1A1A1A]/10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/60 font-sans block mb-2">
              Haute Joaillerie &bull; KenDji Luxury
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">
              {pageTitle}
            </h1>
            <p className="text-sm text-[#1A1A1A]/70 font-sans mt-2 max-w-2xl">
              {pageSubtitle}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[#1A1A1A]/60 font-sans flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Trier :
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'default' | 'price_asc' | 'price_desc')}
              className="bg-white border border-[#1A1A1A]/20 rounded px-3 py-2 text-xs font-sans uppercase tracking-wider text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] cursor-pointer"
            >
              <option value="default">Sélection Signature (Défaut)</option>
              <option value="price_asc">Prix : Croissant</option>
              <option value="price_desc">Prix : Décroissant</option>
            </select>
          </div>
        </div>

        {/* Category Pills (on Shop All) */}
        {showCategoryFilters && categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-8 pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:border-[#1A1A1A]/40'
              }`}
            >
              Toutes ({initialProducts.length})
            </button>
            {categories.map(cat => {
              const count = initialProducts.filter(p => p.categorySlug === cat.slug).length
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/80 hover:border-[#1A1A1A]/40'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Product Count Indicator */}
      <div className="flex justify-between items-center text-xs text-[#1A1A1A]/60 font-sans">
        <span>
          Affichage de <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> création
          {filteredProducts.length > 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1 text-[#1A1A1A]/70">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          Livraison 58 Wilayas disponible
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="border border-dashed border-[#1A1A1A]/20 rounded-lg py-20 text-center space-y-4">
          <p className="font-serif text-2xl text-[#1A1A1A]">Aucune création trouvée</p>
          <p className="text-sm text-[#1A1A1A]/60 max-w-md mx-auto">
            Aucun bijou ne correspond aux critères sélectionnés.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all')
              setSortBy('default')
            }}
            className="inline-block bg-[#1A1A1A] text-white text-xs uppercase tracking-widest px-6 py-3 rounded"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      )}
    </div>
  )
}
