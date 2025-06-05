'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Category, getCategories } from '@/services/categories';
import { Publication, getPublications, createPublication, deletePublication } from '@/services/publications';
import { getCurrentUser } from '@/services/auth';
import BackButton from '@/components/common/BackButton';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function GestionPublicaciones() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      if (!user || user.rol !== 3) {
        router.push('/');
      }
    };

    checkAuth();
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, publicationsData] = await Promise.all([
        getCategories(),
        getPublications()
      ]);
      console.log('Loaded categories:', categoriesData);
      console.log('Loaded publications:', publicationsData);
      setCategories(categoriesData);
      setPublications(publicationsData);
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedCategoryId) {
      setError('Por favor seleccione una categoría');
      return;
    }

    try {
      setIsSubmitting(true);
      const newPublication = await createPublication({ categoria: selectedCategoryId });
      console.log('New publication created:', newPublication);
      
      if (!newPublication.categoria) {
        throw new Error('La publicación no contiene los datos de la categoría');
      }

      setPublications(prevPublications => [...prevPublications, newPublication]);
      
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== selectedCategoryId)
      );
      
      setSelectedCategoryId('');
      setError(null);
    } catch (error: any) {
      console.error('Error creating publication:', error);
      setError(error.message || 'Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsSubmitting(true);
      await deletePublication(id);
      await fetchData();
      setShowDeleteConfirm(null);
    } catch (error) {
      setError('Error al eliminar la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3d2342] p-8">
        <div className="text-center">
          <p className="text-white text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Filter out categories that already have publications
  const availableCategories = categories.filter(
    category => !publications.some(pub => pub.categoria.id === category.id)
  );

  return (
    <div className="min-h-screen bg-[#3d2342] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gestión de Publicaciones de Categorías</h1>
          <div className="flex gap-4 items-center">
            <FormControl variant="outlined" sx={{
              width: '350px',
              backgroundColor: '#2d1830',
              borderRadius: '0.375rem',
              '& .MuiOutlinedInput-root': {
                color: '#a16bb7',
                height: '48px',
                '& fieldset': {
                  borderColor: '#a16bb7',
                  borderRadius: '0.375rem',
                },
                '&:hover fieldset': {
                  borderColor: '#e94b5a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#e94b5a',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#a16bb7',
                '&.Mui-focused': {
                  color: '#e94b5a',
                },
              },
              '& .MuiSelect-icon': {
                color: '#a16bb7',
              },
              '& .MuiMenuItem-root': {
                color: '#a16bb7',
                fontSize: '1rem',
              },
            }}>
              <InputLabel id="category-select-label">Categoría</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value as number)}
                label="Categoría"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#2d1830',
                      '& .MuiMenuItem-root': {
                        color: '#a16bb7',
                        fontSize: '1rem',
                        padding: '12px 16px',
                        '&:hover': {
                          backgroundColor: '#3d2342',
                          color: '#e94b5a',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#3d2342',
                          color: '#e94b5a',
                          '&:hover': {
                            backgroundColor: '#4d2d52',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" sx={{ 
                  color: '#a16bb7',
                  fontSize: '1rem',
                  fontStyle: 'italic'
                }}>
                  Seleccione una categoría
                </MenuItem>
                {availableCategories.map((category) => (
                  <MenuItem 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button
              onClick={handleCreate}
              disabled={!selectedCategoryId || isSubmitting}
              className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creando...' : 'Crear Publicación'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((publication) => (
            <div
              key={publication.id}
              className="bg-[#2d1830] rounded-lg overflow-hidden shadow-xl"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {publication.categoria?.nombre || 'Categoría sin nombre'}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">
                    ${publication.categoria?.precio || 0}/día
                  </span>
                  <button
                    onClick={() => setShowDeleteConfirm(publication.id)}
                    className="px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
                  >
                    Dar de baja
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2d1830] p-8 rounded-lg shadow-xl z-50 w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Confirmar Baja</h3>
            <p className="text-[#a16bb7] mb-6">
              ¿Estás seguro de que deseas dar de baja esta publicación? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-white hover:text-[#e94b5a] transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Dando de baja...' : 'Dar de baja'}
              </button>
            </div>
          </div>
        </>
      )}

      <BackButton />
    </div>
  );
}