import ElevatorSystem, { Elevator, Passenger, ElevatorAndPassenger, ElevatorDirection } from './elevator-system'

// show main box when JS is enabled
document.querySelector('main').style.display = null

const system = new ElevatorSystem()
// window.system = system
const elevatorsListDiv = document.getElementById('elevators-list')
const waitingPassengersListDiv = document.getElementById('waiting-passengers-list')

const formatDirection = (dir: ElevatorDirection): string => {
    switch (dir) {
        case ElevatorDirection.GoingUp:
            return 'up'
        case ElevatorDirection.GoingDown:
            return 'down'
        case ElevatorDirection.Standing:
            return 'none'
    }
}

// DOM events:
document.getElementById('add-elevator-btn').addEventListener('click', () => {
    system.addNewElevator(+prompt('What floor is that elevator initially on?'))
})

document.getElementById('add-passenger-btn').addEventListener('click', () => {
    system.addNewPassenger({
        name: prompt('Give a passenger name', '') || '',
        initialFloor: +prompt('That floor is that passenger on?'),
        destinationFloor: +prompt('That floor is that passenger going to go?'),
    })
})

document.getElementById('next-step-btn').addEventListener('click', () => system.commitNextStep())

// system events
system.addEventListener('elevator-added', (elevator: Elevator) => {
    const elevatorDiv = document.createElement('div')
    elevatorDiv.id = `elevator-id-${elevator.id}`
    elevatorDiv.classList.add('elevator')

    //   {
    //     const el = document.createElement("div");
    //     el.classList.add("elevator-id-value");
    //     el.innerText = `${elevator.id}`;
    //     elevatorDiv.appendChild(el);
    //   }
    //   {
    //     const el = document.createElement("div");
    //     el.classList.add("elevator-id-title");
    //     el.innerText = `Elevator ID`;
    //     elevatorDiv.appendChild(el);
    //   }

    {
        const el = document.createElement('div')
        el.classList.add('current-floor-value')
        el.innerText = `${elevator.currentFloor}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.innerText = `Current floor`
        elevatorDiv.appendChild(el)
    }

    {
        const el = document.createElement('div')
        el.classList.add('direction-value')
        el.innerText = `${formatDirection(elevator.direction)}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.innerText = `Direction`
        elevatorDiv.appendChild(el)
    }

    // {
    //     const el = document.createElement('div')
    //     el.classList.add('limit-floor-value')
    //     el.innerText = `${elevator.destinationLimit}`
    //     elevatorDiv.appendChild(el)
    // }
    // {
    //     const el = document.createElement('div')
    //     el.innerText = `Floor limit`
    //     elevatorDiv.appendChild(el)
    // }

    // {
    //     const el = document.createElement('div')
    //     el.classList.add('next-direction-value')
    //     el.innerText = `${formatDirection(elevator.nextDirection)}`
    //     elevatorDiv.appendChild(el)
    // }
    // {
    //     const el = document.createElement('div')
    //     el.innerText = `Next direction`
    //     elevatorDiv.appendChild(el)
    // }

    {
        const el = document.createElement('div')
        el.classList.add('passengers-inside-list')
        elevatorDiv.appendChild(el)
    }

    elevatorsListDiv.appendChild(elevatorDiv)
})

system.addEventListener('elevator-updated', (elevator: Elevator) => {
    const elevatorDiv = document.getElementById(`elevator-id-${elevator.id}`)
    ;(elevatorDiv.querySelector('.current-floor-value') as HTMLDivElement).innerText = `${elevator.currentFloor}`
    ;(elevatorDiv.querySelector('.direction-value') as HTMLDivElement).innerText = `${formatDirection(elevator.direction)}`
    // (elevatorDiv.querySelector('.limit-floor-value') as HTMLDivElement).innerText = `${elevator.destinationLimit}`;
    // (elevatorDiv.querySelector('.next-direction-value') as HTMLDivElement).innerText = `${formatDirection(elevator.nextDirection)}`;
})

system.addEventListener('waiting-passenger-added', (passenger: Passenger) => {
    const elevatorDiv = document.createElement('div')
    elevatorDiv.id = `waiting-passenger-id-${passenger.id}`
    elevatorDiv.classList.add('waiting-passenger')

    {
        const el = document.createElement('div')
        el.innerText = `${passenger.name}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.innerText = `Name`
        elevatorDiv.appendChild(el)
    }

    {
        const el = document.createElement('div')
        el.innerText = `${passenger.initialFloor}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.innerText = `Waiting at`
        elevatorDiv.appendChild(el)
    }

    {
        const el = document.createElement('div')
        el.innerText = `${passenger.destinationFloor}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.innerText = `Destination floor`
        elevatorDiv.appendChild(el)
    }

    waitingPassengersListDiv.appendChild(elevatorDiv)
})

system.addEventListener('passenger-taken', ({ passenger, elevator }: ElevatorAndPassenger) => {
    document.getElementById(`waiting-passenger-id-${passenger.id}`).remove()
    const listOfInsiders = document.querySelector(`#elevator-id-${elevator.id} .passengers-inside-list`)

    const el = document.createElement('div')
    el.id = `passenger_${passenger.id}`
    el.classList.add('passenger-inside')
    el.innerText = `${passenger.name}`
    listOfInsiders.appendChild(el)
})

system.addEventListener('passenger-dropped', ({ passenger, elevator }: ElevatorAndPassenger) => {
    document.querySelector(`#elevator-id-${elevator.id} #passenger_${passenger.id}`).remove()
})

// system.addNewElevator();
// system.addNewElevator();

// system.addNewPassenger({
//   name: "Jakub",
//   initialFloor: 2,
//   destinationFloor: 4,
// });
// system.addNewPassenger({
//   name: "Paweł",
//   initialFloor: 6,
//   destinationFloor: 3,
// });
// system.addNewPassenger({
//   name: "Piotr",
//   initialFloor: 7,
//   destinationFloor: 3,
// });
