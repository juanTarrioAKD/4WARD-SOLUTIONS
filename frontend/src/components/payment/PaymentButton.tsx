import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { createPaymentPreference } from '@/services/payment';
import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PaymentButtonProps {
  alquilerId: number;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentButton({ alquilerId, className = '', onSuccess, onError }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mp, setMp] = useState<any>(null);

  useEffect(() => {
    const loadMercadoPago = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.type = 'text/javascript';
        
        script.onload = () => {
          const mp = new window.MercadoPago('TEST-f1a573c4-e8cd-4e70-a22c-b3a322fb06f0', {
            locale: 'es-AR'
          });
          setMp(mp);
          console.log('SDK de Mercado Pago cargado correctamente');
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Error al cargar SDK:', error);
        setError('Error al cargar el SDK de Mercado Pago');
      }
    };

    loadMercadoPago();

    return () => {
      const script = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeCardPaymentBrick = async (preferenceId: string, amount: number) => {
    if (!mp) {
      console.error('MercadoPago no está inicializado');
      return;
    }

    try {
      const bricksBuilder = mp.bricks();
      
      const settings = {
        initialization: {
          amount: amount,
          preferenceId: preferenceId
        },
        callbacks: {
          onReady: () => {
            console.log('Brick listo');
            setIsLoading(false);
          },
          onSubmit: async (cardFormData: any) => {
            console.log('Pago enviado:', cardFormData);
            try {
              window.location.href = `${window.location.origin}/pagos/success?alquiler_id=${alquilerId}`;
            } catch (error) {
              setError('Error al procesar el pago');
              onError?.(new Error('Error al procesar el pago'));
            }
          },
          onError: (error: any) => {
            console.error('Error en el pago:', error);
            setError('Error al procesar el pago: ' + (error.message || 'Error desconocido'));
            onError?.(new Error(error.message || 'Error al procesar el pago'));
          }
        },
        locale: 'es-AR',
        customization: {
          paymentMethods: {
            maxInstallments: 1
          },
          visual: {
            style: {
              theme: 'default'
            }
          }
        }
      };

      await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
    } catch (error) {
      console.error('Error al inicializar el brick:', error);
      setError('Error al inicializar el formulario de pago');
    }
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowForm(true);

      console.log('Iniciando proceso de pago para alquiler:', alquilerId);
      
      const preference = await createPaymentPreference(alquilerId);
      console.log('Preferencia de pago creada:', preference);

      if (!preference || !preference.init_point) {
        throw new Error('No se pudo obtener el enlace de pago');
      }

      // Obtener el token de autenticación
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Obtener el monto del backend usando la URL correcta y el token
      const response = await fetch(`${API_BASE_URL}/api/alquileres/${alquilerId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del alquiler');
      }

      const alquilerData = await response.json();
      const amount = alquilerData.monto_total;

      if (!amount) {
        throw new Error('No se pudo obtener el monto del alquiler');
      }

      const preferenceId = preference.init_point.split('pref_id=')[1];
      await initializeCardPaymentBrick(preferenceId, amount);
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(error as Error);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
        <p className="font-semibold">Modo de prueba:</p>
        <p>Para realizar pagos de prueba, usa la siguiente tarjeta:</p>
        <p>Número: 5031 7557 3453 0604</p>
        <p>CVV: 123</p>
        <p>Vencimiento: 11/25</p>
        <p>Titular: APRO</p>
      </div>
      {!showForm ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          disabled={isLoading}
          fullWidth
          className={`px-6 py-3 bg-[#00b1ea] text-white font-semibold rounded-md hover:bg-[#0095c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
        </Button>
      ) : null}
      <div id="cardPaymentBrick_container" className="mt-4"></div>
    </div>
  );
} 