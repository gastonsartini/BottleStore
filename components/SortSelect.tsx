'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  currentSort?: string;
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    router.push(`/productos?${params.toString()}`);
  };

  return (
    <select
      className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
      value={currentSort || ''}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Destacados</option>
      <option value="newest">Más recientes</option>
      <option value="price-asc">Menor precio</option>
      <option value="price-desc">Mayor precio</option>
    </select>
  );
}
