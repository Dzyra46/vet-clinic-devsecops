/**
 * Centralized error handler untuk API responses
 */

export interface ApiError {
  status: number;
  message: string;
  code: string;
}

export function handleApiError(error: any): ApiError {
  // Handle Fetch API errors
  if (error instanceof TypeError) {
    return {
      status: 0,
      message: 'Network error. Pastikan koneksi internet stabil.',
      code: 'NETWORK_ERROR',
    };
  }

  // Handle Response errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          status,
          message: data.error || 'Request tidak valid',
          code: 'BAD_REQUEST',
        };
      case 401:
        return {
          status,
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          code: 'UNAUTHORIZED',
        };
      case 403:
        return {
          status,
          message: 'Anda tidak memiliki akses ke resource ini.',
          code: 'FORBIDDEN',
        };
      case 404:
        return {
          status,
          message: 'Resource tidak ditemukan.',
          code: 'NOT_FOUND',
        };
      case 429:
        return {
          status,
          message: 'Terlalu banyak request. Coba lagi dalam beberapa detik.',
          code: 'RATE_LIMITED',
        };
      case 500:
        return {
          status,
          message: 'Server error. Coba lagi nanti.',
          code: 'SERVER_ERROR',
        };
      default:
        return {
          status,
          message: data.error || 'Terjadi kesalahan',
          code: 'UNKNOWN_ERROR',
        };
    }
  }

  // Generic error
  return {
    status: 500,
    message: error.message || 'Terjadi kesalahan tidak terduga.',
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Validate API response dan throw error jika perlu
 */
export async function validateResponse(response: Response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw {
      response: {
        status: response.status,
        data,
      },
    };
  }
  return response;
}

/**
 * Safe JSON parse dengan fallback
 */
export async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch {
    return { error: 'Invalid response format' };
  }
}