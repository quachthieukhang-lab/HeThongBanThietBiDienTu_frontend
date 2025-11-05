export async function uploadFile(file: File, backendUrl: string) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${backendUrl}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.url || data.path
}
