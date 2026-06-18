import * as p from "@clack/prompts"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const BASE_DEPENDENCIES = ["clsx", "class-variance-authority", "tailwind-merge"]

function detectPackageManager(): "npm" | "yarn" | "pnpm" {
  const cwd = process.cwd()
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm"
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn"
  return "npm"
}

function getInstallCommand(pm: string, deps: string[]): string {
  const cmd = pm === "npm" ? "install" : "add"
  return `${pm} ${cmd} ${deps.join(" ")}`
}

export async function init() {
  p.intro(chalk.blue("febs-ui init"))

  const cwd = process.cwd()

  // 1. Cek apakah ini React project
  const packageJsonPath = path.join(cwd, "package.json")
  if (!fs.existsSync(packageJsonPath)) {
    p.log.error("No package.json found. Run this in your project root.")
    process.exit(1)
  }

  // 2. Tanya konfigurasi user
  const config = await p.group(
    {
      componentsPath: () =>
        p.text({
          message: "Where do you want to put components?",
          placeholder: "src/components/ui",
          initialValue: "src/components/ui",
        }),
      utilsPath: () =>
        p.text({
          message: "Where do you want to put utils?",
          placeholder: "src/lib/utils",
          initialValue: "src/lib/utils",
        }),
    },
    {
      onCancel: () => {
        p.cancel("Cancelled.")
        process.exit(0)
      },
    }
  )

  // 3. Install dependencies
  const pm = detectPackageManager()
  const spinner = p.spinner()
  spinner.start(`Installing dependencies with ${pm}...`)

  try {
    execSync(getInstallCommand(pm, BASE_DEPENDENCIES), {
      cwd,
      stdio: "ignore",
    })
    spinner.stop("Dependencies installed.")
  } catch (err) {
    spinner.stop()
    p.log.error("Failed to install dependencies.")
    process.exit(1)
  }

  // 4. Bikin folder komponen
  const componentsDir = path.resolve(cwd, config.componentsPath as string)
  fs.mkdirSync(componentsDir, { recursive: true })

  // 5. Bikin utils file (cn helper)
  const utilsDir = path.resolve(cwd, config.utilsPath as string)
  fs.mkdirSync(path.dirname(utilsDir), { recursive: true })

  const utilsContent = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
  fs.writeFileSync(`${utilsDir}.ts`, utilsContent)

  // 6. Bikin config file febs-ui.json
  const configContent = {
    componentsPath: config.componentsPath,
    utilsPath: config.utilsPath,
  }
  fs.writeFileSync(
    path.join(cwd, "febs-ui.json"),
    JSON.stringify(configContent, null, 2)
  )

  p.outro(
    chalk.green(
      `Setup complete! Run "npx @febks/febs-ui add <component>" to add components.`
    )
  )
}