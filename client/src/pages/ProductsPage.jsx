import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProductTable from '@/components/products/ProductTable';
import ProductFilters from '@/components/products/ProductFilters';
import Pagination from '@/components/common/Pagination';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchProducts } from '@/services/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();


  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const categories = searchParams.get('categories')
    ? searchParams.get('categories').split(',')
    : [];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', { page, limit: 10, search, categories }],
    queryFn: () => fetchProducts({ page, limit: 10, search, categories }),
    placeholderData: keepPreviousData,
  });

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value) => {
    updateParams({ search: value, page: '' });
  };

  const handleCategoriesChange = (value) => {
    updateParams({ categories: value, page: '' });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage === 1 ? '' : String(newPage) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          {data?.pagination && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.pagination.totalProducts} product{data.pagination.totalProducts !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
        <Button asChild>
          <Link to="/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        selectedCategories={categories}
        onCategoriesChange={handleCategoriesChange}
      />

      <div className={isFetching && !isLoading ? 'opacity-60 transition-opacity' : ''}>
        <ProductTable products={data?.products} isLoading={isLoading} />
      </div>

      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductsPage;
