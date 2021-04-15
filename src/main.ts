import ElevatorSystem, { ElevatorDirection } from './elevator-system'

// show main box when JS is enabled
document.querySelector('main').style.display = null

const system = new ElevatorSystem()
const elevatorsListDiv = document.getElementById('elevators-list')
const waitingPassengersListDiv = document.getElementById('waiting-passengers-list')

// Handle adding elevators:
document.getElementById('add-elevator-btn').addEventListener('click', () => {
    document.getElementById('add-elevator-error').classList.add('gone')
    document.getElementById('add-elevator-layout').classList.remove('gone')
    document.getElementById('add-passenger-layout').classList.add('gone')
})
document.getElementById('add-elevator-cancel-btn').addEventListener('click', () => {
    document.getElementById('add-elevator-layout').classList.add('gone')
})
document.getElementById('add-elevator-confirm-btn').addEventListener('click', () => {
    const initialFloor = (document.getElementById('initial-elevator-floor-input') as HTMLInputElement).value

    let error: string
    if (!initialFloor || isNaN(+initialFloor)) error = 'Invalid initial floor'

    const errorElement = document.getElementById('add-elevator-error')
    if (error) {
        errorElement.classList.remove('gone')
        errorElement.innerText = error
    } else {
        errorElement.innerText = ''
        errorElement.classList.add('gone')
        document.getElementById('add-elevator-layout').classList.add('gone')

        system.addNewElevator({
            initialFloor: +initialFloor,
        })
    }
})

// handling adding passengers
document.getElementById('add-passenger-btn').addEventListener('click', () => {
    document.getElementById('add-passenger-error').classList.add('gone')
    document.getElementById('add-passenger-layout').classList.remove('gone')
    document.getElementById('add-elevator-layout').classList.add('gone')
})
document.getElementById('add-passenger-cancel-btn').addEventListener('click', () => {
    document.getElementById('add-passenger-layout').classList.add('gone')
})
document.getElementById('add-passenger-confirm-btn').addEventListener('click', () => {
    const name = (document.getElementById('passenger-name-input') as HTMLInputElement).value
    const initialFloor = (document.getElementById('initial-floor-input') as HTMLInputElement).value
    const destinationFloor = (document.getElementById('destination-floor-input') as HTMLInputElement).value

    let error: string
    if (!name) error = 'Invalid passenger name'
    else if (!initialFloor || isNaN(+initialFloor)) error = 'Invalid initial floor'
    else if (!destinationFloor || isNaN(+destinationFloor)) error = 'Invalid destination floor'
    else if (+destinationFloor === +initialFloor) error = 'Initial floor must be different then destination one'

    const errorElement = document.getElementById('add-passenger-error')
    if (error) {
        errorElement.classList.remove('gone')
        errorElement.innerText = error
    } else {
        errorElement.innerText = ''
        errorElement.classList.add('gone')
        document.getElementById('add-passenger-layout').classList.add('gone')

        system.addNewPassenger({
            destinationFloor: +destinationFloor,
            initialFloor: +initialFloor,
            name: name,
        })
    }
})

// next step of simulation
document.getElementById('next-step-btn').addEventListener('click', () => system.commitNextStep())

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

// system events
system.addEventListener('elevator-added', ({ elevator }) => {
    const elevatorDiv = document.createElement('div')
    elevatorDiv.id = `elevator-id-${elevator.id}`
    elevatorDiv.classList.add('elevator')

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

    {
        const el = document.createElement('div')
        el.classList.add('passengers-inside-list')
        elevatorDiv.appendChild(el)
    }

    elevatorsListDiv.appendChild(elevatorDiv)
})

system.addEventListener('elevator-updated', ({ elevator }) => {
    const elevatorDiv = document.getElementById(`elevator-id-${elevator.id}`)
    ;(elevatorDiv.querySelector('.current-floor-value') as HTMLDivElement).innerText = `${elevator.currentFloor}`
    ;(elevatorDiv.querySelector('.direction-value') as HTMLDivElement).innerText = `${formatDirection(elevator.direction)}`
})

system.addEventListener('waiting-passenger-added', ({ passenger }) => {
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

system.addEventListener('passenger-taken', ({ passenger, elevator }) => {
    document.getElementById(`waiting-passenger-id-${passenger.id}`).remove()
    const listOfInsiders = document.querySelector(`#elevator-id-${elevator.id} .passengers-inside-list`)

    const el = document.createElement('div')
    el.id = `passenger_${passenger.id}`
    el.classList.add('passenger-inside')
    el.innerText = `${passenger.name} (${passenger.destinationFloor})`
    listOfInsiders.appendChild(el)
})
