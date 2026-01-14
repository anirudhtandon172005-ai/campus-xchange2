"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  resultCount: number
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="mb-6 space-y-2">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search items by title..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary"
        />
      </div>
      <p className="text-sm text-muted-foreground px-1">
        Showing {resultCount} {resultCount === 1 ? "item" : "items"}
      </p>
    </div>
  )
}
