import { useState } from 'react'

export default function TagInput({ label, tags, onChange, placeholder = 'Add a skill' }) {
  const [input, setInput] = useState('')

  // Add a tag only if the trimmed input is non-empty and not already in the list;
  // always clear the input after attempting to add
  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag))
  }

  // Enter adds the current tag; Backspace on an empty input removes the last tag
  // (common tag-input UX pattern)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-300 px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 hover:text-primary-dark"
            >
              ×
            </button>
          </span>
        ))}
          {/* Also add the tag on blur so typing + clicking away still captures input;
              only show placeholder when there are no tags to avoid overlap */}
          <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
        />
      </div>
    </div>
  )
}
