
export async function apiFetch(url: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

  let token = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken')
  }
  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as any),
  }

  console.log('API Fetch:', {
    url: fullUrl,
    method: options.method || 'GET',
    isFormData,
    hasBody: !!options.body,
    headers
  })

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  })

  console.log('API Response:', {
    url: fullUrl,
    status: res.status,
    statusText: res.statusText,
    ok: res.ok
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const text = await res.text()
      console.error('API Error Response:', text)
      try {
        const json = JSON.parse(text)
        message = json.message || json.error || message
      } catch {
        message = text || message
      }
    } catch (e) {
      console.error('Error reading response:', e)
    }
    throw new Error(message)
  }
  return res
}
