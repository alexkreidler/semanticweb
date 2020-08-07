import chalk from "chalk"
import figlet from "figlet"
import { program } from "commander"

import { BasicServer } from "../server/server"
import { Oxigraph } from "../backends/oxigraph"
import { HTTPFrontend } from "../frontends/http"

console.log(
    chalk.red(
        figlet.textSync("semantic-web-server", { horizontalLayout: "full" })
    )
)

async function handler(argv) {
    BasicServer.registerBackend("http", new Oxigraph())

    const defaultConfig = {
        mapping: [
            {
                name: "person",
                type: "schema:Person",
            },
            {
                name: "book",
                type: "schema:Book",
            },
        ],
    }
    BasicServer.registerFrontend(
        new HTTPFrontend(defaultConfig, BasicServer.log)
    )

    await BasicServer.start()

    return
}

program
    .name("semantic-web-server")
    .version("0.1.0")
    .description(
        "A fully featured semantic web server for building dynamic applications with multiple client APIs"
    )
    .command("start")
    .description("Starts the server with the default frontends and backends")
    .action(handler)

program.parse(process.argv)
