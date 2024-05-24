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
            this.dispatch_elevator(best_elevator);
        } else {
            // Do something while waiting for elevators
        }  
    }

    async dispatch_elevator(elevator){
        let starting_point = elevator.current_floor;
        let direction = starting_point - elevator.destination;
        for(let i = 0; i < Math.abs(starting_point - elevator.destination); i++){
            if(direction > 0){
                await simulate_movement(2000);
                elevator.current_floor -= 1;
            } else if (direction < 0){
                await simulate_movement(2000);
                elevator.current_floor += 1;
            }
        }
        elevator_arrived(elevator, elevator.current_floor);
        elevator.destination = -1;
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

function simulate_movement(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
