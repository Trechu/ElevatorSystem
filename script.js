// You can change this parameter in order to increase the number of elevators
// However, a really big amount of them is ill advised as it may impact the viewing experience of the html
// The soft limit should be about 16
const elevator_count = 5;

class ElevatorSystem {

    // Pickup accepts two parameters: the floor from which the elevator was called, and the direction 
    // in which the caller would like to go
    pickup(floor_number, direction){
        
    }

    async dispatch_elevator(elevator){
        
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

const elevator_array = [];

const available_elevators = new Map();

for(let i = 0; i < elevator_count; i++){
    elevator_array.push(new Elevator(i));
    available_elevators.set(elevator_array[i], elevator_array[i].current_floor);
}

const main_system = new ElevatorSystem();

console.log([...available_elevators.entries()]);