"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Filter } from "lucide-react"

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  category: string
  type: string
  minPrice: string
  maxPrice: string
  urgentOnly: boolean
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    type: "all",
    minPrice: "",
    maxPrice: "",
    urgentOnly: false,
  })

  useEffect(() => {
    onFilterChange?.(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full md:hidden mb-4 gap-2 bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      <Card className={`p-4 space-y-4 ${isOpen ? "block" : "hidden"} md:block`}>
        <h3 className="font-semibold text-foreground">Filter Items</h3>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="misc">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Listing Type</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sell">For Sale</SelectItem>
              <SelectItem value="borrow">For Borrow</SelectItem>
              <SelectItem value="recycle">Free/Recycle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <span className="text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="urgent"
            checked={filters.urgentOnly}
            onChange={(e) => handleFilterChange("urgentOnly", e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="urgent" className="font-normal cursor-pointer">
            Urgent listings only
          </Label>
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => {
            setFilters({
              category: "all",
              type: "all",
              minPrice: "",
              maxPrice: "",
              urgentOnly: false,
            })
          }}
        >
          Reset Filters
        </Button>
      </Card>
    </div>
  )
}
