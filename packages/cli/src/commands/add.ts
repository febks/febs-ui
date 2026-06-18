import * as p from "@clack/prompts"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { getRegistry, fetchComponent } from "../utils/registry"

export async function add(component: string) {
  p.intro(chalk.blue("febs-ui"))

  // Read config from febs-ui.json
  const configPath = path.join(process.cwd(), "febs-ui.json")
  if (!fs.existsSync(configPath)) {
    p.log.error(
      'febs-ui not initialized. Run "npx @febks/febs-ui init" first.'
    )
    process.exit(1)
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"))

  const spinner = p.spinner()
  spinner.start(`Fetching ${component}...`)

  try {
    const registry = await getRegistry()

    if (!registry[component]) {
      spinner.stop()
      p.log.error(`Component "${component}" not found.`)
      p.log.info(`Available: ${Object.keys(registry).join(", ")}`)
      process.exit(1)
    }

    const { files } = registry[component]

    for (const filePath of files) {
      const content = await fetchComponent(filePath)
      const fileName = path.basename(filePath)
      const destDir = path.resolve(process.cwd(), config.componentsPath)
      const destPath = path.join(destDir, fileName)

      fs.mkdirSync(destDir, { recursive: true })
      fs.writeFileSync(destPath, content)
    }

    spinner.stop(`${component} added!`)
    p.outro(chalk.green(`Done! Check ${config.componentsPath}`))
  } catch (err) {
    spinner.stop()
    p.log.error(err instanceof Error ? err.message : "Something went wrong.")
    process.exit(1)
  }
}