import EventProducer from "./event-producer"
import { generateUniqueId } from "./util"

export type EventType = 'elevator-added' | 'waiting-passenger-added' | 'passenger-taken' | 'passenger-dropped' | 'elevator-updated'

export interface ElevatorAndPassenger {
    elevator: Elevator
    passenger: Passenger
}

export class Elevator {
    public constructor(public readonly id: number,) { }
    public currentFloor: number = 0
    public destinationFloor: number = 0
    public passengers: Passenger[] = []
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
    private waitingPassengersAboutToBeTaken: Passenger[] = []

    public addNewElevator() {
        const id = generateUniqueId()
        const obj = new Elevator(id)
        this.elevators.set(id, obj)
        this.emit('elevator-added', obj)
    }

    public addNewPassenger({ name, initialFloor, destinationFloor }: Passenger) {
        if (isNaN(initialFloor) || isNaN(destinationFloor)) throw new Error('Invalid passengers parameters')

        const passenger = <Passenger>{
            id: generateUniqueId(),
            name, initialFloor, destinationFloor
        }
        this.waitingPassengers.unshift(passenger)
        this.emit('waiting-passenger-added', passenger)
    }

    public commitNextStep() {
        // assign elevators to passengers if someone is waiting
        for (let i = this.waitingPassengers.length - 1; i >= 0; i--) {
            const passenger = this.waitingPassengers[i]
            // find any elevator that is moving this direction
            let foundOne = false
            for (const elevator of this.elevators.values()) {
                // check if is moving
                if (elevator.currentFloor !== elevator.destinationFloor) {
                    // check if (going down and we the passenger is below this elevator and the passenger wants to go down) OR exacly the opposite
                    if ((elevator.destinationFloor < elevator.currentFloor
                        && passenger.initialFloor <= elevator.currentFloor
                        && passenger.destinationFloor < passenger.initialFloor)

                        || (elevator.destinationFloor > elevator.currentFloor
                            && passenger.initialFloor >= elevator.currentFloor
                            && passenger.destinationFloor > passenger.initialFloor)) {
                        // elevator going to this passenger found!
                        this.waitingPassengersAboutToBeTaken.push(passenger)
                        this.waitingPassengers.splice(i, 1)

                        // change elevator's destination floor, because it may by farer away then it's current one
                        if (Math.abs(elevator.destinationFloor - elevator.currentFloor) < Math.abs(passenger.destinationFloor - elevator.currentFloor)) {
                            elevator.destinationFloor = passenger.destinationFloor

                        }

                        // FIXME: it's possible that single elevator gets updated multiple times, but there should be a single event!
                        this.emit('elevator-updated', elevator)
                        foundOne = true
                        break
                    }
                }
            }

            if (!foundOne) {
                // there is no elevator that is going in our direction, use one that is free
                for (const elevator of this.elevators.values()) {
                    // check if is free
                    if (elevator.currentFloor === elevator.destinationFloor) {

                        this.waitingPassengersAboutToBeTaken.push(passenger)
                        this.waitingPassengers.splice(i, 1)

                        elevator.destinationFloor = passenger.initialFloor
                        // FIXME: it's possible that single elevator gets updated multiple times, but there should be a single event!
                        this.emit('elevator-updated', elevator)

                        break;
                    }
                }
            }
        }


        // moving elevators
        for (const elevator of this.elevators.values()) {
            let wasChanged = false

            if (elevator.destinationFloor > elevator.currentFloor) {
                // this elevator is going up
                elevator.currentFloor++
                wasChanged = true
            } else if (elevator.destinationFloor < elevator.currentFloor) {
                // this elevator is going down
                elevator.currentFloor--
                wasChanged = true
            }


            // drop passengers that wants to be on this floor
            for (let i = elevator.passengers.length - 1; i >= 0; i--) {
                const passenger = elevator.passengers[i]
                if (passenger.destinationFloor === elevator.currentFloor) {
                    elevator.passengers.splice(i, 1)
                    this.emit('passenger-dropped', { passenger, elevator })
                }
            }

            // take passengers that want to go up and are on this floor
            // drop passengers that wants to be on this floor
            for (let i = this.waitingPassengersAboutToBeTaken.length - 1; i >= 0; i--) {
                const passenger = this.waitingPassengersAboutToBeTaken[i]
                if (passenger.initialFloor === elevator.currentFloor) {
                    elevator.passengers.push(passenger)
                    this.waitingPassengersAboutToBeTaken.splice(i, 1)
                    this.emit('passenger-taken', { passenger, elevator })
                }
            }


            if (elevator.destinationFloor === elevator.currentFloor) {
                // elevator is on the destination floor
                // check if it has passengers
                if (elevator.passengers.length !== 0) {
                    // looks like it need to continue going the same direction
                    elevator.destinationFloor = elevator.passengers[0].destinationFloor
                    wasChanged = true
                } else {
                    // COMMENTED, because experimenting with different approach
                    // FIXME: remove this

                    // // looks like the elevator is empty, find any waiting passenger to go for //  meaby optimize it?
                    // const floor = this.waitingPassengersAboutToBeTaken[0]?.initialFloor
                    // if (floor !== undefined) {
                    //     // there is at least one waiting passenger, go for it
                    //     elevator.destinationFloor = floor
                    //     wasChanged = true
                    // }
                }
            }

            if (wasChanged) {
                this.emit('elevator-updated', elevator)
            }
        }



    }
}