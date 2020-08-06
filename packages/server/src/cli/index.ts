import chalk from "chalk"
import figlet from "figlet"
import { program } from "commander"

import { BasicServer } from "../server/server"
import { QuadStore } from "../backends/node-quadstore"

console.log(
    chalk.red(
        figlet.textSync("semantic-web-server", { horizontalLayout: "full" })
    )
)

async function handler(argv) {
    console.log("in handler")

    BasicServer.registerBackend("http", new QuadStore())
    await BasicServer.start()

    console.log("after start")

    await BasicServer.stop()
    console.log("after cleanup")

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

console.log("after parse")
