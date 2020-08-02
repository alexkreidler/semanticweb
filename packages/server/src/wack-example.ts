// import EventEmitter from "events"

// interface IGreetings {
//     constructor(props)
//     greet(name: string, message: string)
//     handdleGreeting(name: string): string
// }
// export class GreetingsService extends (EventEmitter as IGreetings) {
//     greet(name: string) {
//         this.emit(name)
//     }
// }

// interface Secured {
//     secureDebug(accessToken: string)
// }

// interface Loggable {
//     log(): void
// }

// class DatabaseManager implements Loggable {
//     log(): void {
//         throw new Error("Method not implemented.")
//     }
//     database() {
//         // who cares
//     }
// }

// class HealthData extends DatabaseManager implements Secured {
//     accessToken = "blabla"

//     secureDebug(accessToken) {
//         if (accessToken == this.accessToken) {
//             super.log()
//         }
//     }
// }

// let hd = new HealthData()

// hd.database()

interface Compute {
    data(): number
}

class MoreComplex implements Compute {
    data() {
        return 42
    }
    expensiveComputationBlocksGUI() {}
    // etc, more
}

type K = typeof MoreComplex

class EndClass extends (MoreComplex as Compute) {
    constructor() {
        super()
        super.data()
    }
}
