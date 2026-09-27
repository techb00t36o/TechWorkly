import { useRef } from 'react'

export default function OTPInput({ value, onChange, length = 6 }) {
  const inputRefs = useRef([])

  // When a digit is entered, update the value at that index, then auto-focus
  // the next input field to create a smooth OTP entry experience
  const handleChange = (index, e) => {
    // Strip non-numeric characters to ensure only digits are entered
    const digit = e.target.value.replace(/\D/g, '')
    const newValue = value.split('')
    newValue[index] = digit
    const result = newValue.join('').slice(0, length)
    onChange(result)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // When Backspace is pressed on an empty field, move focus to the previous
  // input to make deletion feel natural
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // On paste, extract only digits, limit to OTP length, update the full value
  // at once, and focus the next empty input
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted)
    if (pasted.length < length) {
      inputRefs.current[pasted.length]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {/* Each input box displays a single character from the `value` string;
        the full OTP is managed as a single string, not an array */}
    {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-12 w-12 rounded-lg border border-neutral-300 text-center text-lg font-semibold text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
        />
      ))}
    </div>
  )
}
