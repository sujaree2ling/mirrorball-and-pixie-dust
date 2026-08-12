import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const sizeStyles = {
  default: {
    gap: 'gap-1.5',
    label: 'text-sm',
    input: 'h-12 text-base',
    error: 'text-sm',
  },
  admin: {
    gap: 'gap-1.5',
    label: 'text-sm',
    input: 'h-11 text-[15px]',
    error: 'text-sm',
  },
  compact: {
    gap: 'gap-1',
    label: 'text-xs',
    input: 'h-10 text-sm',
    error: 'text-xs',
  },
}

export function FormField({
  id,
  label,
  error,
  invalid,
  size = 'default',
  className,
  ...props
}) {
  const isInvalid = invalid ?? Boolean(error)
  const styles = sizeStyles[size] ?? sizeStyles.default

  return (
    <div className={cn('flex flex-col', styles.gap, className)}>
      <label
        htmlFor={id}
        className={cn('font-medium text-[#75716B]', styles.label)}
      >
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={isInvalid}
        className={cn(
          'rounded-lg border bg-white px-3 placeholder:text-[#75716B]/60',
          styles.input,
          isInvalid
            ? 'border-[#EB5164] text-[#EB5164]'
            : 'border-[#DAD6D1] text-[#26231E]',
        )}
        {...props}
      />
      {error && <p className={cn('text-[#EB5164]', styles.error)}>{error}</p>}
    </div>
  )
}
