// Reusable file upload field with drag-to-click and image preview support.
// Uses a hidden input triggered by clicking the visible drop zone.
import { useRef } from 'react'

// eslint-disable-next-line no-unused-vars -- label is used in JSX
export default function UploadField({ label, accept, onChange, preview }) {
  // Ref allows the visible drop zone to trigger the hidden file input
  const inputRef = useRef(null)

  const handleClick = () => {
    // Optional chaining guards against ref being unmounted
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      <div
        onClick={handleClick}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 transition hover:border-primary hover:bg-primary-light"
      >
        {/* Toggle between image preview (existing file) and upload placeholder icon */}
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <svg
            className="h-10 w-10 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        )}
        <p className="mt-2 text-sm font-medium text-neutral-700">
          {preview ? 'Change file' : 'Click to upload'}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          {accept === 'image/*' ? 'PNG, JPG up to 5MB' : 'PDF up to 10MB'}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
