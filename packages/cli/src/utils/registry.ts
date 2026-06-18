const REGISTRY_URL =
  "https://raw.githubusercontent.com/febks/febs-ui/main/registry.json"

const BASE_URL =
  "https://raw.githubusercontent.com/febks/febs-ui/main"

export async function getRegistry() {
  const res = await fetch(REGISTRY_URL)
  return res.json()
}

export async function fetchComponent(filePath: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/${filePath}`)
  if (!res.ok) throw new Error(`Failed to fetch ${filePath}`)
  return res.text()
}