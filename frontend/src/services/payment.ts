import { API_BASE_URL } from '@/config/config';

interface PaymentPreferenceResponse {
  init_point: string;
  alquiler_id: number;
}

export const createPaymentPreference = async (alquiler_id: number): Promise<PaymentPreferenceResponse> => {
  try {
    console.log('Iniciando creación de preferencia de pago para alquiler:', alquiler_id);
    
    const response = await fetch(`${API_BASE_URL}/api/pagos/crear-preferencia/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ alquiler_id }),
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', {
      status: response.status,
      data: data
    });

    if (!response.ok) {
      throw new Error(data.error || 'Error al procesar el pago');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('Respuesta inválida del servidor');
    }

    if (!data.init_point) {
      throw new Error('No se recibió el enlace de pago');
    }

    return {
      init_point: data.init_point,
      alquiler_id: data.alquiler_id
    };
  } catch (error) {
    console.error('Error al crear preferencia de pago:', error);
    throw error instanceof Error ? error : new Error('Error al procesar el pago');
  }
}; 