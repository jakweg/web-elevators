import ElevatorSystem, { Elevator, Passenger } from "./elevator-system";

// show main box when JS is enabled
document.querySelector('main').style.display = null;

const system = new ElevatorSystem();
const elevatorsListDiv = document.getElementById('elevators-list')
const waitingPassengersListDiv = document.getElementById('waiting-passengers-list')

// DOM events:
document.getElementById('add-elevator-btn').addEventListener('click', () => system.addNewElevator())
document.getElementById('add-passenger-btn').addEventListener('click', () => {
    system.addNewPassenger({
        name: prompt('Give a passenger name', '') || '',
        initialFloor: +prompt('That floor is that passenger on?'),
        destinationFloor: +prompt('That floor is that passenger going to go?'),
    })
})


// system events
system.addEventListener('elevator-added', (elevator: Elevator) => {
    const elevatorDiv = document.createElement('div');
    elevatorDiv.id = `elevator_id_${elevator.id}`
    elevatorDiv.classList.add('elevator')

    {
        const el = document.createElement('div')
        el.classList.add('elevator-id-value')
        el.innerText = `${elevator.id}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.classList.add('elevator-id-title')
        el.innerText = `Elevator ID`
        elevatorDiv.appendChild(el)
    }


    {
        const el = document.createElement('div')
        el.classList.add('current-floor-value')
        el.innerText = `${elevator.currentFloor}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.classList.add('current-floor-title')
        el.innerText = `Current floor`
        elevatorDiv.appendChild(el)
    }


    {
        const el = document.createElement('div')
        el.classList.add('destination-floor-value')
        el.innerText = `${elevator.destinationFloor}`
        elevatorDiv.appendChild(el)
    }
    {
        const el = document.createElement('div')
        el.classList.add('destination-floor-title')
        el.innerText = `Destination floor`
        elevatorDiv.appendChild(el)
    }

    elevatorsListDiv.appendChild(elevatorDiv);
})


system.addEventListener('waiting-passenger-added', (passenger: Passenger) => {
    const elevatorDiv = document.createElement('div');
    elevatorDiv.id = `waiting_passenger_id_${passenger.id}`
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

    waitingPassengersListDiv.appendChild(elevatorDiv);
})


system.addNewElevator()
system.addNewElevator()

system.addNewPassenger({
    name: 'Jakub', initialFloor: 2, destinationFloor: 5
})
system.addNewPassenger({
    name: 'Piotr', initialFloor: 6, destinationFloor: 3
})