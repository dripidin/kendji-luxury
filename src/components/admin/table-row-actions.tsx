'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Edit, Archive, Trash2, Eye, Loader2 } from 'lucide-react'

interface TableRowActionsProps {
  editUrl?: string
  viewUrl?: string
  resourceName: string
  itemName: string
  isArchived?: boolean
  onArchive?: () => Promise<{ success: boolean; message?: string; error?: string }>
  onDelete?: () => Promise<{ success: boolean; message?: string; error?: string }>
}

export function TableRowActions({
  editUrl,
  viewUrl,
  resourceName,
  itemName,
  isArchived,
  onArchive,
  onDelete
}: TableRowActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleArchiveConfirm = async () => {
    if (!onArchive) return
    setIsProcessing(true)
    const res = await onArchive()
    setIsProcessing(false)
    setShowArchiveDialog(false)
    if (res.success) {
      router.refresh()
    }
  }

  const handleDeleteConfirm = async () => {
    if (!onDelete) return
    setIsProcessing(true)
    const res = await onDelete()
    setIsProcessing(false)
    setShowDeleteDialog(false)
    if (res.success) {
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {editUrl && (
          <Link href={editUrl}>
            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-gray-700 hover:text-gray-900">
              <Edit className="h-3.5 w-3.5 mr-1" />
              Modifier
            </Button>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">Actions</DropdownMenuLabel>

            {viewUrl && (
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => window.open(viewUrl, '_blank')}>
                <Eye className="h-3.5 w-3.5 mr-2 text-gray-400" />
                Aperçu boutique
              </DropdownMenuItem>
            )}

            {editUrl && (
              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => router.push(editUrl)}>
                <Edit className="h-3.5 w-3.5 mr-2 text-gray-400" />
                Modifier les détails
              </DropdownMenuItem>
            )}

            {onArchive && (
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => setShowArchiveDialog(true)}
              >
                <Archive className="h-3.5 w-3.5 mr-2 text-amber-600" />
                {isArchived ? 'Réactiver' : 'Archiver / Désactiver'}
              </DropdownMenuItem>
            )}

            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Archive / Deactivate Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={(open: boolean) => setShowArchiveDialog(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? `Réactiver "${itemName}" ?` : `Archiver "${itemName}" ?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-500 leading-relaxed">
              {isArchived
                ? `Ce ${resourceName.toLowerCase()} sera de nouveau visible et disponible sur la boutique.`
                : `Ce ${resourceName.toLowerCase()} sera masqué de la boutique publique tout en conservant son historique opérationnel et ses données.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="text-xs">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveConfirm}
              disabled={isProcessing}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
            >
              {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              {isArchived ? 'Confirmer la réactivation' : 'Confirmer l\'archivage'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open: boolean) => setShowDeleteDialog(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Supprimer définitivement &quot;{itemName}&quot; ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-500 leading-relaxed">
              Cette action est irréversible. Si cet élément est lié à des commandes passées, il sera archivé en toute sécurité pour préserver la comptabilité.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="text-xs">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
            >
              {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
