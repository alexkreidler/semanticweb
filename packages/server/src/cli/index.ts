import chalk from "chalk"
import figlet from "figlet"
import { program } from "commander"

import { BasicServer } from "../server/server"

console.log(
    chalk.red(
        figlet.textSync("semantic-web-server", { horizontalLayout: "full" })
    )
)

program
    .name("semantic-web-server")
    .version("0.1.0")
    .description(
        "A fully featured semantic web server for building dynamic applications with multiple client APIs"
    )
    .command("start")
    .description("Starts the server with the default frontends and backends")
    .action(() => {
        BasicServer.start()
    })

program.parse(process.argv)
