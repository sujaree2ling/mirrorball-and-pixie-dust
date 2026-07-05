import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function FormField({ id, label, error, invalid, className, ...props }) {
  const isInvalid = invalid ?? Boolean(error)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-[#75716B]">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={isInvalid}
        className={cn(
          'h-12 rounded-lg border bg-white text-base placeholder:text-[#75716B]/60',
          isInvalid
            ? 'border-[#EB5164] text-[#EB5164]'
            : 'border-[#DAD6D1] text-[#26231E]',
        )}
        {...props}
      />
      {error && <p className="text-sm text-[#EB5164]">{error}</p>}
    </div>
  )
}
