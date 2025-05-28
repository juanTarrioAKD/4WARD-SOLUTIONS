'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCategories, getImageUrl } from '@/services/categories';

interface Category {
  id: number;
  name: string;
  image: string;
  price: number;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      <div className="category-section">
        {isLoading ? (
          <div className="text-xl text-center text-white">Cargando categorías...</div>
        ) : error ? (
          <div className="text-xl text-center text-red-600">Error: {error}</div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-4 px-2 scrollbar-thin scrollbar-thumb-[#a16bb7] scrollbar-track-[#3d2342] category-list"
            style={{ maxWidth: '820px' }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card w-[250px] max-w-xs bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex-shrink-0 cursor-pointer border border-[#a16bb7] hover:border-[#e94b5a]"
                onClick={() => console.log(`Selected category: ${category.name}`)}
              >
                <div className="category-image-container relative w-full h-36 rounded-t-xl overflow-hidden group">
                  <Image
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    fill
                    className="object-cover category-image transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 250px) 100vw, 250px"
                  />
                </div>
                <div className="category-info p-4 flex flex-col items-center">
                  <h3 className="category-name text-xl font-semibold text-[#3d2342] mb-2">{category.name}</h3>
                  <span className="category-price text-lg font-bold text-[#e94b5a]">${category.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 