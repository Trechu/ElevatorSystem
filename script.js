// You can change this parameter in order to increase the number of elevators
// However, a really big amount of them is ill advised as it may impact the viewing experience of the html
// The soft limit should be about 16
const elevator_count = 5;

// For sanity reasons I assume that the building has 7 floors, however this should also work with more
const number_of_floors = 7;

const floor_array = [];
for(let i = 0; i < number_of_floors; i++){
    floor_array.push(i);
}

const elevator_array = [];
const available_elevators = new Map();

const requests = [];
const requestedFloors = new Map();

document.querySelector("#sim-cont").style.visibility = 'hidden';

class ElevatorSystem {

    // Pickup accepts two parameters: the floor from which the elevator was called, and the direction 
    // in which the caller would like to go

    // The algorithm finds the first AVAILABLE elevator on the closest floor and dispatches it to
    // go to the designated location
    pickup(floor_number, direction){
        if(available_elevators.size != 0){
            // Lets be honest, noone is gonna make a thousand story building ;)
            let current_closest = 1000;
            let best_elevator;
            for(const [key, map] of available_elevators.entries()){
                if( Math.abs(map - floor_number) < current_closest){
                    current_closest = Math.abs(map - floor_number);
                    best_elevator = key;
                } 
            }

            available_elevators.delete(best_elevator);
            best_elevator.destination = floor_number;
            this.dispatch_elevator(best_elevator, 'outside');
        } else {
            // Do something while waiting for elevators
        }  
    }

    // This just simply takes the elevator and iterates it over the floors along the way
    async dispatch_elevator(elevator, mode){
        // requestedFloors.delete(elevator.current_floor);
        setElevatorStatus(elevator.id, -1);
        let starting_point = elevator.current_floor;
        let direction = starting_point - elevator.destination;
        toggleDirectionArrow(elevator.id, direction);
        for(let i = 0; i < Math.abs(starting_point - elevator.destination); i++){
            if(direction > 0){
                moveElevatorElement(elevator.id, elevator.current_floor-1);
                await simulateMovement(2000);
                elevator.current_floor -= 1;
            } else if (direction < 0){
                moveElevatorElement(elevator.id, elevator.current_floor+1);
                await simulateMovement(2000);
                elevator.current_floor += 1;
            }
        }

        toggleDirectionArrow(elevator.id, direction);
        elevator.destination = -1;
        elevatorArrived(elevator, elevator.current_floor);
        setElevatorStatus(elevator.id, 1);
        if(mode == 'outside'){
            toggleButtons(elevator.current_floor);
            document.querySelector(`#selector_${elevator.id}`).style.visibility = 'visible';
            available_elevators.delete(elevator);
        }
    }

    status(){
        // This is a pretty version :)

        // for(const elevator of elevator_array){
        //     if(elevator.destination == -1){
        //         console.log("Elevator " + elevator.id + " on standby."); 
        //     } else {
        //         console.log("Elevator " + elevator.id + " moving to floor " + elevator.destination); 
        //     }
        // }

        let elevator_status = [];
        for(const elevator of elevator_array){
            elevator_status.push([elevator.id, elevator.current_floor, elevator.destination]);
        }

        return elevator_status;
    }
    async listenForRequests(){
        if(requests.length != 0){
            if(available_elevators.size == 0){
                console.log("All elevators are currently busy. Please wait a moment.");
            } else {
                let requested = requests.pop();
                main_system.pickup(requested, 1);
            }
        }
    }
}

const main_system = new ElevatorSystem();


class Elevator {

    id;
    current_floor;
    destination;

    constructor(id){
        this.id = id;
        this.current_floor = 0;
        this.destination = -1;
    }

    get current_floor(){
        return this.current_floor;
    }

    get destination(){
        return this.destination;
    }

    *info(){
        yield this.id;
        yield this.current_floor;
        yield this.destination;
    }

    /**
     * @param {number} new_floor
     */
    set current_floor(new_floor){
        this.current_floor = new_floor;
    }

    /**
     * @param {number} destination
     */
    set destination(destination){
        this.destination = destination;
    }
}

function elevatorArrived(elevator, floor){
    available_elevators.set(elevator, floor);
    requestedFloors.delete(floor);
}

function simulateMovement(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

function toggleDirectionArrow(elevator_id, direction){
    if(direction > 0){
        let arw = document.querySelector("#arrow_down_" + elevator_id);
        if(arw.style.visibility == 'visible'){
            arw.style.visibility = 'hidden';
        } else {
            arw.style.visibility = 'visible';
        }
    } else {
        let arw = document.querySelector("#arrow_up_" + elevator_id);
        if(arw.style.visibility == 'visible'){
            arw.style.visibility = 'hidden';
        } else {
            arw.style.visibility = 'visible';
        }
    }
}

// Toggle elevator buttons
function toggleButtons(id){
    let btn_up = document.querySelector(`#up_${id}`);
    let btn_down = document.querySelector(`#down_${id}`);
    if(btn_up.disabled == false){
        btn_up.disabled = true
        btn_down.disabled = true
    } else {
        btn_up.disabled = false
        btn_down.disabled = false
    }
}

async function moveElevatorElement(elevator_id, destination){
    let div = document.querySelector(`#elevator_${elevator_id}`);
    div.style.top = `${(6 - destination) * 95}px`;
    div.style.transition = `all 2s ease-in-out`
}

function setElevatorStatus(elevator_id, condition){
    let div = document.querySelector(`#status_${elevator_id}`);
    if(condition < 0){
        div.style.backgroundColor = "red";
    } else {
        div.style.backgroundColor = "greenyellow";
    }
}

for(let i = 0; i < elevator_count; i++){
    elevator_array.push(new Elevator(i));
    elevator_array[i].current_floor = 0;
    elevatorArrived(elevator_array[i], 0);
}



// Send a floor request
function sendRequest(floor_number){
    if(requestedFloors.get(floor_number)){
        console.log("An elevator to the given floor has already been requested!");
    } else {
        toggleButtons(floor_number);

        requestedFloors.set(floor_number, 1);
        requests.push(floor_number);
    }
}

// Dispatch an elevator from inside
function sendRequestFromElevator(floor_number, elevator_id){
    document.querySelector(`#selector_${elevator_id}`).style.visibility = 'hidden';
    available_elevators.delete(elevator_array[elevator_id]);
    // requestedFloors.set(floor_number, 1);
    // toggleButtons(floor_number);
    elevator_array[elevator_id].destination = floor_number;
    main_system.dispatch_elevator(elevator_array[elevator_id], 'inside');
}

// This is the main part of the script, which tells the main system to listen for pickup requests



// Set all elevators to the default positon
// For some reason the first animation just doesnt want to work, so this is a little cheat to get it working
setTimeout(()=>{
    for(let i = 0; i < elevator_count; i++){
        moveElevatorElement(i,0);
        setElevatorStatus(i,1);
        document.querySelector(`#selector_${i}`).style.visibility = 'hidden';
    }
    document.querySelector(".loader").style.visibility = 'hidden';
    document.querySelector("#sim-cont").style.visibility = 'visible';
},1000);

setInterval(()=>{
    main_system.listenForRequests();
},500);