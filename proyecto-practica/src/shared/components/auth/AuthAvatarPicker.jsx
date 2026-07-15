import { useRef, useState } from 'react'
import { CameraIcon } from './AuthIcons.jsx'

export const AuthAvatarPicker = ({ onFileSelect, disabled }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    onFileSelect(file)
  }

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-surface transition-colors hover:border-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Foto de perfil"
            className="h-full w-full object-cover"
          />
        ) : (
          <CameraIcon className="h-7 w-7 text-text-secondary transition-colors group-hover:text-secondary" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="text-center text-xs text-text-secondary">
        {previewUrl ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="font-medium text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed"
          >
            Quitar foto
          </button>
        ) : (
          <span>Foto de perfil (opcional, si no subes una se usa un avatar por defecto)</span>
        )}
      </div>
    </div>
  )
}
