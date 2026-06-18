import * as p from "@clack/prompts"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { getRegistry, fetchComponent } from "../utils/registry"

export async function add(component: string, options: { path: string }) {
  p.intro(chalk.blue(`febs-ui`))

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

    const { files, dependencies } = registry[component]

    // Fetch dan tulis file komponen
    for (const filePath of files) {
      const content = await fetchComponent(filePath)
      const fileName = path.basename(filePath)
      const destDir = path.resolve(process.cwd(), options.path)
      const destPath = path.join(destDir, fileName)

      fs.mkdirSync(destDir, { recursive: true })
      fs.writeFileSync(destPath, content)
    }

    spinner.stop(`${component} added!`)

    // Info dependencies yang perlu diinstall
    if (dependencies.length > 0) {
      p.log.info(
        `Install dependencies: npm install ${dependencies.join(" ")}`
      )
    }

    p.outro(chalk.green(`Done! Check ${options.path}`))
  } catch (err) {
    spinner.stop()
    p.log.error("Something went wrong.")
    console.error(err)
    process.exit(1)
  }
}