import chalk from "chalk"
import figlet from "figlet"
import { program } from "commander"

console.log(
    chalk.red(
        figlet.textSync("semantic-web-server", { horizontalLayout: "full" })
    )
)

program
    .version("0.1.0")
    .description(
        "A fully featured semantic web server for building dynamic applications with multiple client APIs"
    )
    .option("-p, --peppers", "Add peppers")
    .option("-P, --pineapple", "Add pineapple")
    .option("-b, --bbq", "Add bbq sauce")
    .option("-c, --cheese <type>", "Add the specified type of cheese [marble]")
    .option("-C, --no-cheese", "You do not want any cheese")
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp()
}
