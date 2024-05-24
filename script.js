// You can change this parameter in order to increase the number of elevators
// However, a really big amount of them is ill advised as it may impact the viewing experience of the html
// The soft limit should be about 16
const elevator_count = 5;

// For sanity reasons I assume that the building has 7 floors, however this should also work with more
const number_of_floors = 7;

class ElevatorSystem {

    // Pickup accepts two parameters: the floor from which the elevator was called, and the direction 
    // in which the caller would like to go

    // The algorithm finds the first AVAILABLE elevator on the closest floor and dispatches it to
    // go to the designated location
    pickup(floor_number, direction){
        if(available_elevators != 0){
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
            console.log(best_elevator)
            this.dispatch_elevator(best_elevator);
        } else {
            // Do something while waiting for elevators
        }  
    }

    async dispatch_elevator(elevator){
        // console.log("The elevator " + elevator.id  + " is now moving to floor " + elevator.destination);
        setTimeout(() => {
            elevator.current_floor = elevator.destination;
            elevator.destination = -1;
            elevator_arrived(elevator, elevator.current_floor);
        }, 3000);
    }
}

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

function elevator_arrived(elevator, floor){
    available_elevators.set(elevator, floor);
}

const elevator_array = [];

const available_elevators = new Map();

for(let i = 0; i < elevator_count; i++){
    elevator_array.push(new Elevator(i));
    let tmp = Math.floor(Math.random() * number_of_floors);
    elevator_array[i].current_floor = tmp;
    elevator_arrived(elevator_array[i], tmp);
}

const main_system = new ElevatorSystem();

console.log([...available_elevators.entries()]);
main_system.pickup(3,1);
setTimeout(() => {
    console.log([...available_elevators.entries()]);
}, 5000)