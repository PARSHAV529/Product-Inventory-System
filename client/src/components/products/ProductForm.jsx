import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronsUpDown, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createProduct } from '@/services/api';
import { toast } from 'sonner';

const ProductForm = () => {
  const navigate = useNavigate();
  const [catOpen, setCatOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create product');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      quantity: '',
      categories: [],
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
    };

    createMutation.mutate(payload, {
      onSuccess: () => navigate('/'),
      onError: (err) => {

        const msg = err.response?.data?.message;
        if (msg && msg.toLowerCase().includes('name already exists')) {
          setError('name', { message: msg });
        }


        const serverErrors = err.response?.data?.errors;
        if (serverErrors?.length) {
          serverErrors.forEach((e) => {
            setError(e.field, { message: e.message });
          });
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          {...register('name', {
            required: 'Product name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
          })}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>


      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the product"
          rows={3}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 5, message: 'Description must be at least 5 characters' },
            maxLength: { value: 500, message: 'Description cannot exceed 500 characters' },
          })}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>


      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          placeholder="0"
          min="0"
          {...register('quantity', {
            required: 'Quantity is required',
            validate: (val) => {
              const num = Number(val);
              if (isNaN(num)) return 'Must be a number';
              if (num < 0) return 'Cannot be negative';
              if (!Number.isInteger(num)) return 'Must be a whole number';
              return true;
            },
          })}
          className={errors.quantity ? 'border-destructive' : ''}
        />
        {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
      </div>


      <div className="space-y-2">
        <Label>Categories</Label>
        <Controller
          name="categories"
          control={control}
          rules={{
            validate: (val) => val.length > 0 || 'Select at least one category',
          }}
          render={({ field }) => (
            <>
              <Popover open={catOpen} onOpenChange={setCatOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-between font-normal ${
                      errors.categories ? 'border-destructive' : ''
                    }`}
                  >
                    {field.value.length > 0
                      ? `${field.value.length} categor${field.value.length === 1 ? 'y' : 'ies'} selected`
                      : 'Select categories'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                      <CommandEmpty>
                        {catsLoading ? 'Loading...' : 'No categories found'}
                      </CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => {
                          const isSelected = field.value.includes(cat._id);
                          return (
                            <CommandItem
                              key={cat._id}
                              onSelect={() => {
                                const updated = isSelected
                                  ? field.value.filter((id) => id !== cat._id)
                                  : [...field.value, cat._id];
                                field.onChange(updated);
                              }}
                            >
                              <Checkbox checked={isSelected} className="mr-2" />
                              {cat.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>


              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {field.value.map((catId) => {
                    const cat = categories.find((c) => c._id === catId);
                    if (!cat) return null;
                    return (
                      <Badge key={catId} variant="secondary" className="gap-1">
                        {cat.name}
                        <button
                          type="button"
                          onClick={() => field.onChange(field.value.filter((id) => id !== catId))}
                          className="ml-0.5 rounded-full hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </>
          )}
        />
        {errors.categories && (
          <p className="text-sm text-destructive">{errors.categories.message}</p>
        )}
      </div>


      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Add Product'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
