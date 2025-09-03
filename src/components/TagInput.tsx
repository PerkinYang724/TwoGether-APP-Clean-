import React, { useState, useEffect } from 'react'
import { Tag, X } from 'lucide-react'
import { t } from '../lib/i18n'

interface TagInputProps {
    onTagSubmit: (tag: string) => void
    onCancel: () => void
    isVisible: boolean
}

export default function TagInput({ onTagSubmit, onCancel, isVisible }: TagInputProps) {
    const [tag, setTag] = useState('')

    console.log('TagInput: Component rendered, isVisible:', isVisible)

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
            // Clear the global flag when component unmounts
            window.__preventNavigation = false
        }
    }, [isVisible])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('TagInput: handleSubmit called with tag:', tag.trim())

        // Set global flag immediately to prevent any navigation
        window.__preventNavigation = true
        console.log('TagInput: Global navigation prevention flag set to true in handleSubmit')

        if (tag.trim()) {
            onTagSubmit(tag.trim())
            setTag('')
        }
    }

    const handleCancel = () => {
        setTag('')
        // Clear the global flag when modal is cancelled
        window.__preventNavigation = false
        onCancel()
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.target === e.currentTarget) {
            console.log('TagInput: Backdrop clicked, closing modal')
            handleCancel()
        }
    }

    if (!isVisible) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                margin: 0,
                padding: '1.5rem'
            }}
            onClick={handleBackdropClick}
            onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            onMouseUp={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            data-modal="tag-input"
        >
            <div
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/20"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="size-5 text-white/70" />
                    <h3 className="text-lg font-medium text-white">
                        {t('enterSubjectTag')}
                    </h3>
                </div>

                <p className="text-white/60 text-sm mb-6">
                    {t('subjectTag')}
                </p>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    console.log('TagInput: Enter key pressed')

                                    // Set global flag immediately to prevent any navigation
                                    window.__preventNavigation = true
                                    console.log('TagInput: Global navigation prevention flag set to true in Enter key')

                                    if (tag.trim()) {
                                        handleSubmit(e as any)
                                    }
                                }
                            }}
                            placeholder={t('subjectTagPlaceholder')}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                            autoFocus
                            maxLength={30}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            disabled={!tag.trim()}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log('TagInput: Submit button clicked')

                                // Set global flag immediately to prevent any navigation
                                window.__preventNavigation = true
                                console.log('TagInput: Global navigation prevention flag set to true in button click')

                                if (tag.trim()) {
                                    handleSubmit(e as any)
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onMouseUp={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            className="flex-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:text-white/30 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            {t('start')}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
