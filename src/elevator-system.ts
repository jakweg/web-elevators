import EventProducer from './event-producer'
import { generateUniqueId } from './util'

export type EventType = 'elevator-added' | 'waiting-passenger-added' | 'passenger-taken' | 'passenger-dropped' | 'elevator-updated'

export interface ElevatorAndPassenger {
    elevator: Elevator
    passenger: Passenger
}

export enum ElevatorDirection {
    Standing = 0,
    GoingUp = 1,
    GoingDown = -1,
}

export class Elevator {
    public constructor(public readonly id: number) {}
    public currentFloor: number = 0
    public direction: ElevatorDirection = ElevatorDirection.Standing
    public nextDirection: ElevatorDirection = ElevatorDirection.Standing
    public destinationLimit: number = Number.MAX_SAFE_INTEGER
    public passengers: Passenger[] = []
}

export interface Passenger {
    readonly id?: number
    readonly name: string
    readonly initialFloor: number
    readonly destinationFloor: number
    readonly direction?: ElevatorDirection
    readonly assignedElevatorId?: number
}

export default class ElevatorSystem extends EventProducer<EventType> {
    // id to Elevator
    private elevators = new Map<number, Elevator>()

    private waitingPassengers: Passenger[] = []

    public addNewElevator(initialFloor?: number) {
        const id = generateUniqueId()
        const obj = new Elevator(id)
        obj.currentFloor = +initialFloor || 0
        this.elevators.set(id, obj)
        this.emit('elevator-added', obj)
    }

    public addNewPassenger({ name, initialFloor, destinationFloor }: Passenger) {
        if (isNaN(initialFloor) || isNaN(destinationFloor)) throw new Error('Invalid passengers parameters')
        if (initialFloor === destinationFloor) throw new Error('Passenger is already on the destination floor')

        const passenger = <Passenger>{
            id: generateUniqueId(),
            direction: destinationFloor < initialFloor ? ElevatorDirection.GoingDown : ElevatorDirection.GoingUp,
            name,
            initialFloor,
            destinationFloor,
        }
        this.waitingPassengers.unshift(passenger)
        this.emit('waiting-passenger-added', passenger)
    }

    public commitNextStep() {
        const changedElevatorIds = new Set<number>()

        for (const elevator of this.elevators.values()) {
            if (elevator.direction !== ElevatorDirection.Standing) {
                // move the elevator
                changedElevatorIds.add(elevator.id)

                elevator.currentFloor += elevator.direction as number

                // drop passengers that wants to be on this floor
                for (let i = elevator.passengers.length - 1; i >= 0; i--) {
                    const passenger = elevator.passengers[i]
                    if (passenger.destinationFloor === elevator.currentFloor) {
                        elevator.passengers.splice(i, 1)
                        this.emit('passenger-dropped', { passenger, elevator })
                    }
                }

                // if the elevator is at the limit floor this means it needs to change the direction
                if (elevator.nextDirection !== ElevatorDirection.Standing && elevator.currentFloor === elevator.destinationLimit) {
                    elevator.direction = elevator.nextDirection
                    elevator.nextDirection = ElevatorDirection.Standing
                    elevator.destinationLimit = Number.MAX_SAFE_INTEGER * elevator.direction
                } else if (elevator.passengers.length === 0) {
                    if (elevator.nextDirection !== ElevatorDirection.Standing) {
                        // even thouh this elevator is empty it needs to go this way anyway
                    } else {
                        // looks like this elevator is empty now, check if there is any passenger in this way that wants to go this way
                        let isSomeone = false
                        const tmp = elevator.currentFloor * elevator.direction
                        for (const passenger of this.waitingPassengers) {
                            if (
                                passenger.initialFloor * elevator.direction >= tmp &&
                                passenger.direction === elevator.direction &&
                                passenger.destinationFloor * elevator.direction <= elevator.destinationLimit * elevator.direction
                            ) {
                                isSomeone = true
                                break
                            }
                        }
                        if (!isSomeone) {
                            //if not then switch direction to standing
                            elevator.direction = ElevatorDirection.Standing
                        }
                    }
                }

                // take passengers that want to go this way and are on this floor and they are within the limit
                for (let i = this.waitingPassengers.length - 1; i >= 0; i--) {
                    const passenger = this.waitingPassengers[i]
                    if (
                        passenger.initialFloor === elevator.currentFloor &&
                        passenger.direction === elevator.direction &&
                        passenger.destinationFloor * elevator.direction < elevator.destinationLimit * elevator.direction
                    ) {
                        elevator.passengers.push(passenger)
                        this.waitingPassengers.splice(i, 1)
                        this.emit('passenger-taken', { passenger, elevator })
                    }
                }
            }
        }

        for (const elevator of this.elevators.values()) {
            if (elevator.direction == ElevatorDirection.Standing) {
                // find a direction to go to
                for (const passenger of this.waitingPassengers) {
                    // check if there is any elevator going to that persion, or will take it in the near future
                    let isAny = false
                    for (const otherElevator of this.elevators.values()) {
                        if (
                            (otherElevator.direction !== ElevatorDirection.Standing &&
                                passenger.initialFloor * otherElevator.direction > otherElevator.currentFloor * otherElevator.direction &&
                                passenger.destinationFloor * elevator.direction <=
                                    otherElevator.destinationLimit * otherElevator.direction &&
                                passenger.direction === otherElevator.direction) ||
                            (otherElevator.direction !== ElevatorDirection.Standing &&
                                otherElevator.nextDirection !== ElevatorDirection.Standing &&
                                passenger.initialFloor * otherElevator.direction <=
                                    otherElevator.destinationLimit * otherElevator.direction &&
                                passenger.direction === otherElevator.nextDirection)
                        ) {
                            isAny = true
                            break
                        }
                    }
                    if (!isAny) {
                        console.log('nope')

                        // if there are none, then make this elevator go for that person
                        elevator.direction = Math.sign(passenger.initialFloor - elevator.currentFloor)
                        elevator.nextDirection = Math.sign(passenger.destinationFloor - passenger.initialFloor)
                        if (elevator.nextDirection === elevator.direction) {
                            elevator.nextDirection = ElevatorDirection.Standing
                            elevator.destinationLimit = Number.MAX_SAFE_INTEGER * elevator.direction
                        } else {
                            // it's good idea to find a person that is on lowest/heighest floor
                            let limit = passenger.initialFloor
                            this.waitingPassengers.forEach(
                                elevator.direction === ElevatorDirection.GoingUp
                                    ? (p) => {
                                          if (p.initialFloor > limit) limit = p.initialFloor
                                      }
                                    : (p) => {
                                          if (p.initialFloor < limit) limit = p.initialFloor
                                      },
                            )

                            elevator.destinationLimit = limit
                        }
                        changedElevatorIds.add(elevator.id)
                        break
                    }
                }
            }
        }
        for (const id of changedElevatorIds) {
            this.emit('elevator-updated', this.elevators.get(id))
        }
    }
}
