interface ApiClientGetType {
  endpoint: string;
  searchParams?: Record<string, string>;
  withCredentials?: boolean;
}

interface ApiClientPostType {
  endpoint: string;
  body: Record<string, string | number> | FormData;
  withCredentials?: boolean;
}

interface ApiClientDeleteType {
  endpoint: string;
}

interface ApiClientPatchType {
  endpoint: string;
  searchParams: Record<string, string | number>;
  withCredentials?: boolean;
}

type RequestCredentials = 'omit' | 'same-origin' | 'include';

class ApiClient {
  #baseUrl: string;

  constructor() {
    if (
      typeof process.env.API_BASE_URL === 'undefined' ||
      !process.env.API_BASE_URL
    ) {
      throw new Error(
        '환경 변수 BASE_URL이 설정되지 않았습니다. .env 파일을 확인해주세요.',
      );
    }
    this.#baseUrl = process.env.API_BASE_URL;
  }

  async get<T>({
    endpoint,
    searchParams,
    withCredentials,
  }: ApiClientGetType): Promise<T> {
    const url = new URL(`${this.#baseUrl}${endpoint}`);
    url.search = new URLSearchParams(searchParams).toString();

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: withCredentials
        ? 'include'
        : ('same-origin' as RequestCredentials),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    // TODO: 커스텀에러 추가후, 에러 타입별로 구분해 throw 및 try-catch 처리 필요
    return response.json();
  }

  async post({ endpoint, body, withCredentials }: ApiClientPostType) {
    const url = new URL(`${this.#baseUrl}${endpoint}`);
    const isFormData = body instanceof FormData;

    const options = {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
      credentials: withCredentials
        ? 'include'
        : ('same-origin' as RequestCredentials),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      // TODO: 커스텀에러 추가후, 에러 타입별로 구분해 throw 및 try-catch 처리 필요
      const data = await response.json();
      throw new Error(data.message);
    }
    return response;
  }

  async delete({ endpoint }: ApiClientDeleteType) {
    const url = new URL(`${this.#baseUrl}${endpoint}`);

    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      // TODO: 커스텀에러 추가후, 에러 타입별로 구분해 throw 및 try-catch 처리 필요
      const data = await response.json();
      throw new Error(data.message);
    }
  }

  async patch({ endpoint, searchParams, withCredentials }: ApiClientPatchType) {
    const url = new URL(`${this.#baseUrl}${endpoint}`);

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
      credentials: withCredentials
        ? 'include'
        : ('same-origin' as RequestCredentials),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      // TODO: 커스텀에러 추가후, 에러 타입별로 구분해 throw 및 try-catch 처리 필요
      const data = await response.json();
      throw new Error(data.message);
    }
    return response;
  }
}

export const apiClient = new ApiClient();
