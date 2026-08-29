"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  productName: string
  selectedImage?: string
  onSelectImage?: (img: string) => void
}

export function ProductGallery({ images, productName, selectedImage, onSelectImage }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const activeImage = selectedImage || images[activeIdx] || images[0]

  const handleThumbnailClick = (img: string, idx: number) => {
    setActiveIdx(idx)
    if (onSelectImage) {
      onSelectImage(img)
    }
  }

  const handleNext = () => {
    const nextIdx = (activeIdx + 1) % images.length
    setActiveIdx(nextIdx)
    if (onSelectImage) onSelectImage(images[nextIdx])
  }

  const handlePrev = () => {
    const prevIdx = (activeIdx - 1 + images.length) % images.length
    setActiveIdx(prevIdx)
    if (onSelectImage) onSelectImage(images[prevIdx])
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
      
      {/* Thumbnail Rail (Visible if more than 1 image) */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-none max-h-[620px]">
          {images.map((img, idx) => {
            const isCurrent = (selectedImage ? selectedImage === img : activeIdx === idx)
            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => handleThumbnailClick(img, idx)}
                aria-label={`View image ${idx + 1} of ${productName}`}
                className={cn(
                  "relative h-20 w-16 lg:h-24 lg:w-20 shrink-0 bg-[#F2F2EF] overflow-hidden border transition-all duration-300",
                  isCurrent 
                    ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]" 
                    : "border-[#1A1A1A]/10 opacity-70 hover:opacity-100 hover:border-[#1A1A1A]/40"
                )}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="flex-1 relative aspect-[4/5] bg-[#F2F2EF] overflow-hidden border border-[#1A1A1A]/10 group">
        {activeImage ? (
          <div 
            className="w-full h-full relative cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={activeImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={cn(
                "object-cover object-center transition-transform duration-500 ease-out",
                isZoomed ? "scale-150 cursor-zoom-out" : "group-hover:scale-105"
              )}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-[#1A1A1A]/40 font-sans">
            Visual Catalog Ready
          </div>
        )}

        {/* Zoom Hint Indicator */}
        <div className="absolute top-4 right-4 pointer-events-none bg-white/80 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-widest text-[#1A1A1A] border border-[#1A1A1A]/10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye size={12} />
          <span>{isZoomed ? "Reset" : "Zoom"}</span>
        </div>

        {/* Mobile Navigation Arrows */}
        {images.length > 1 && (
          <div className="lg:hidden absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              aria-label="Previous image"
              className="pointer-events-auto p-2 bg-white/80 backdrop-blur-sm border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              aria-label="Next image"
              className="pointer-events-auto p-2 bg-white/80 backdrop-blur-sm border border-[#1A1A1A]/10 text-[#1A1A1A] hover:bg-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Image Index Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-[#1A1A1A]/80 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 backdrop-blur-sm">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

    </div>
  )
}
