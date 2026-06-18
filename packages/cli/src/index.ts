#!/usr/bin/env node
import { Command } from "commander"
import { add } from "./commands/add"

const program = new Command()

program
  .name("febs-ui")
  .description("Add febs-ui components to your project")
  .version("1.0.0")

program
  .command("add <component>")
  .description("Add a component to your project")
  .option("-p, --path <path>", "destination path", "src/components/ui")
  .action(add)

program.parse()