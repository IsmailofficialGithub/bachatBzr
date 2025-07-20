import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import theme from "../../data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Filter, X } from "lucide-react"

export function PriceFilterPopover({ 
  onFilterChange, 
  initialMin = "", 
  initialMax = "", 
  initialSizes = [],
  onClearFilter 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(initialMin)
  const [maxPrice, setMaxPrice] = useState(initialMax)
  const [sizeInput, setSizeInput] = useState("")
  const [selectedSizes, setSelectedSizes] = useState(initialSizes)
  const [errors, setErrors] = useState({})

  // Predefined size options (you can customize these based on your needs)
  const predefinedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

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

  // Add size to selected sizes
  const addSize = () => {
    if (sizeInput.trim() && !selectedSizes.includes(sizeInput.trim())) {
      setSelectedSizes([...selectedSizes, sizeInput.trim()])
      setSizeInput("")
    }
  }

  // Remove size from selected sizes
  const removeSize = (sizeToRemove) => {
    setSelectedSizes(selectedSizes.filter(size => size !== sizeToRemove))
  }

  // Toggle predefined size
  const togglePredefinedSize = (size) => {
    if (selectedSizes.includes(size)) {
      removeSize(size)
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  // Handle apply filter
  const handleApplyFilter = () => {
    if (validatePrices()) {
      onFilterChange({
        min: minPrice ? Number(minPrice) : null,
        max: maxPrice ? Number(maxPrice) : null,
        sizes: selectedSizes.length > 0 ? selectedSizes : null
      })
      setIsOpen(false)
    }
  }

  // Handle clear filter
  const handleClearFilter = () => {
    setMinPrice("")
    setMaxPrice("")
    setSizeInput("")
    setSelectedSizes([])
    setErrors({})
    if(minPrice || maxPrice || selectedSizes.length > 0) {
      onClearFilter();
    }
    setIsOpen(false)
  }

  // Handle size input key press
  const handleSizeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSize()
    }
  }

  // Check if filter is active
  const isFilterActive = minPrice || maxPrice || selectedSizes.length > 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={isFilterActive ? "default" : "outline"} 
          size="sm"
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {isFilterActive && (
            <span className="ml-2 bg-white text-black rounded-full px-1.5 py-0.5 text-xs font-medium">
              {[
                minPrice && maxPrice ? `$${minPrice}-${maxPrice}` : 
                minPrice ? `$${minPrice}+` : 
                maxPrice ? `<$${maxPrice}` : '',
                selectedSizes.length > 0 ? `${selectedSizes.length} sizes` : ''
              ].filter(Boolean).join(', ')}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" style={{background:theme.color.primary}}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Product Filter</h4>
            <p className="text-sm text-muted-foreground">
              Set price range and select sizes for products.
            </p>
          </div>
          
          <div className="grid gap-4">
            {/* Price Filter Section */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Price Range</h5>
              
              {/* Min Price Input */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="minPrice">Min ($)</Label>
                <div className="col-span-2">
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value)
                      setErrors(prev => ({ ...prev, min: null, range: null }))
                    }}
                    className={`h-8 ${errors.min || errors.range ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                  />
                  {errors.min && (
                    <p className="text-xs text-red-500 mt-1">{errors.min}</p>
                  )}
                </div>
              </div>

              {/* Max Price Input */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxPrice">Max ($)</Label>
                <div className="col-span-2">
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value)
                      setErrors(prev => ({ ...prev, max: null, range: null }))
                    }}
                    className={`h-8 ${errors.max || errors.range ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                  />
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

            {/* Size Filter Section */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Size</h5>
              
              {/* Predefined Size Buttons */}
              <div className="flex flex-wrap gap-2">
                {predefinedSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePredefinedSize(size)}
                    className="h-8 px-3 text-xs"
                  >
                    {size}
                  </Button>
                ))}
              </div>

              {/* Custom Size Input */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="sizeInput">Custom</Label>
                <div className="col-span-2 flex gap-2">
                  <Input
                    id="sizeInput"
                    type="text"
                    placeholder="e.g., 42, XL, 10.5"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={handleSizeKeyPress}
                    className="h-8 flex-1"
                  />
                  <Button
                    onClick={addSize}
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                    disabled={!sizeInput.trim() || selectedSizes.includes(sizeInput.trim())}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Selected Sizes */}
              {selectedSizes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs">Selected Sizes:</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedSizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {size}
                        <button
                          onClick={() => removeSize(size)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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