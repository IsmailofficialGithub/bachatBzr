import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Filter, X } from "lucide-react"

export function PriceFilterPopover({ onFilterChange, initialMin = "", initialMax = "" ,onClearFilter}) {
  const [isOpen, setIsOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(initialMin)
  const [maxPrice, setMaxPrice] = useState(initialMax)
  const [errors, setErrors] = useState({})

  // Validate price inputs
  const validatePrices = () => {
    const newErrors = {}
    
    if (minPrice && (isNaN(minPrice) || Number(minPrice) < 0)) {
      newErrors.min = "Minimum price must be a valid positive number"
    }
    
    if (maxPrice && (isNaN(maxPrice) || Number(maxPrice) < 0)) {
      newErrors.max = "Maximum price must be a valid positive number"
    }
    
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      newErrors.range = "Minimum price cannot be greater than maximum price"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle apply filter
  const handleApplyFilter = () => {
    if (validatePrices()) {
      onFilterChange({
        min: minPrice ? Number(minPrice) : null,
        max: maxPrice ? Number(maxPrice) : null
      })
      setIsOpen(false)
    }
  }

  // Handle clear filter
  const handleClearFilter = () => {
    setMinPrice("")
    setMaxPrice("")
    setErrors({})
  if(minPrice || maxPrice) {
    onClearFilter();
    }
    setIsOpen(false)
  }

  // Check if filter is active
  const isFilterActive = minPrice || maxPrice

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={isFilterActive ? "default" : "outline"} 
          size="sm"
          className="relative "
        >
          <Filter className="h-4 w-4 mr-2" />
          Price Filter
          {isFilterActive && (
            <span className="ml-2 bg-white text-black rounded-full px-1.5 py-0.5 text-xs font-medium">
              {minPrice && maxPrice ? `${minPrice}-${maxPrice}` : 
               minPrice ? `${minPrice}+` : 
               maxPrice ? `<${maxPrice}` : ''}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 "
       style={{background:"#f9a253"}}
       >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Price Filter</h4>
            <p className="text-sm text-muted-foreground">
              Set the minimum and maximum price range for products.
            </p>
          </div>
          
          <div className="grid gap-3">
            {/* Min Price Input */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="minPrice">Min Price</Label>
              <div className="col-span-2">
                <div className="relative">
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value)
                      setErrors(prev => ({ ...prev, min: null, range: null }))
                    }}
                    className={`h-8 pl-7 ${errors.min || errors.range ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.min && (
                  <p className="text-xs text-red-500 mt-1">{errors.min}</p>
                )}
              </div>
            </div>

            {/* Max Price Input */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxPrice">Max Price</Label>
              <div className="col-span-2">
                <div className="relative">
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value)
                      setErrors(prev => ({ ...prev, max: null, range: null }))
                    }}
                    className={`h-8 pl-7 ${errors.max || errors.range ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.max && (
                  <p className="text-xs text-red-500 mt-1">{errors.max}</p>
                )}
              </div>
            </div>

            {/* Range Error */}
            {errors.range && (
              <p className="text-xs text-red-500 text-center">{errors.range}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleApplyFilter}
              size="sm"
              className="flex-1"
            >
              Apply Filter
            </Button>
            <Button 
              onClick={handleClearFilter}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
