import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/api';

const ProductFilters = ({ search, onSearchChange, selectedCategories, onCategoriesChange }) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });


  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearch);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [localSearch]);


  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const toggleCategory = (catId) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];
    onCategoriesChange(updated);
  };

  const clearCategories = () => onCategoriesChange([]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products by name..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>


      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[180px] justify-start gap-2">
            <Filter className="h-4 w-4" />
            {selectedCategories.length > 0
              ? `${selectedCategories.length} selected`
              : 'Filter categories'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found</CommandEmpty>
              <CommandGroup>
                {categories.map((cat) => (
                  <CommandItem key={cat._id} onSelect={() => toggleCategory(cat._id)}>
                    <Checkbox
                      checked={selectedCategories.includes(cat._id)}
                      className="mr-2"
                    />
                    {cat.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {selectedCategories.length > 0 && (
              <>
                <Separator />
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-xs"
                    onClick={clearCategories}
                  >
                    Clear filters
                  </Button>
                </div>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProductFilters;
