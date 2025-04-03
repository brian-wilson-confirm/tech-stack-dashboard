// components/ui/EditableInputCell.tsx
import React from "react"
import { Input } from "@/components/ui/input"

type Props = {
  initialValue: string
  onChange: (value: string) => void
  className?: string
}

export function EditableInputCell({ initialValue, onChange, className }: Props) {
  const [value, setValue] = React.useState(initialValue)

  // 🧠 Only set local value once on mount
  /*const hasMounted = React.useRef(false)

  React.useEffect(() => {
    if (!hasMounted.current) {
      setValue(initialValue)
      hasMounted.current = true
    }
  }, [initialValue])*/

  return (
    <Input
      value={value}
      onChange={(e) => {
        const val = e.target.value
        setValue(val)
        onChange(val)
      }}
      className={className ?? "h-8 w-full"}
    />
  )
}

export default EditableInputCell
