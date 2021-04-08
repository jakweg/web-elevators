import EventProducer from "./event-producer"

export type EventType = 'elevator-added' | 'waiting-passenger-added'

export class Elevator {
    public constructor(public readonly id: number,) { }
    public currentFloor: number = 0
    public destinationFloor: number = 0
}

export interface Passenger {
    // public constructor(
    //     public readonly name: string,
    //     public readonly initialFloor: number ,
    //     public readonly destinationFloor: number ) { }
    readonly id?: number
    readonly name: string
    readonly initialFloor: number
    readonly destinationFloor: number
}

export default class ElevatorSystem extends EventProducer<EventType> {
    // id to Elevator
    private elevators = new Map<number, Elevator>()

    private waitingPassengers: Passenger[] = []

    public addNewElevator() {
        const id = Math.random() * 1_000_000 | 0
        if (this.elevators.has(id))
            return this.addNewElevator();
        const obj = new Elevator(id)
        this.elevators.set(id, obj)
        this.emit('elevator-added', obj)
    }

    public addNewPassenger({ name, initialFloor, destinationFloor }: Passenger) {
        if (isNaN(initialFloor) || isNaN(destinationFloor)) throw new Error('Invalid passengers parameters')

        const passenger = <Passenger>{
            id: Math.random() * 1_000_000 | 0,
            name, initialFloor, destinationFloor
        }
        this.waitingPassengers.push(passenger)
        this.emit('waiting-passenger-added', passenger)
    }
}