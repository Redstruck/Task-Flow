import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
  label?: string
}

export function DatePicker({ date, onDateChange, placeholder = "Select date", label }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(date || new Date())
  const [value, setValue] = React.useState(formatDate(date))

  React.useEffect(() => {
    setValue(formatDate(date))
    if (date) {
      setMonth(date)
    }
  }, [date])

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor="date" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm border border-gray-200/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-gray-300 pr-10"
          onChange={(e) => {
            const inputDate = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(inputDate)) {
              onDateChange(inputDate)
              setMonth(inputDate)
            } else if (e.target.value === '') {
              onDateChange(undefined)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100 rounded-lg"
            >
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-xl"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                onDateChange(selectedDate)
                setValue(formatDate(selectedDate))
                setOpen(false)
              }}
              className="rounded-xl"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}