const REGISTRY_URL =
  "https://raw.githubusercontent.com/febks/febs-ui/main/registry.json"

const BASE_URL =
  "https://raw.githubusercontent.com/febks/febs-ui/main"

export async function getRegistry() {
  const res = await fetch(REGISTRY_URL)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry (${res.status}). URL: ${REGISTRY_URL}`
    )
  }

  const text = await res.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      `Registry is not valid JSON. Got: ${text.slice(0, 100)}...`
    )
  }
}

export async function fetchComponent(filePath: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/${filePath}`)
  if (!res.ok) throw new Error(`Failed to fetch ${filePath}`)
  return res.text()
}