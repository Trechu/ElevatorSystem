<h1 style="text-align: center;">Elevator System</h1>

## 1. How to open the project?
It is pretty simple, all you have to do is navigate to the folder with the project and either open it with the python host command: `python -m http.server` or simply open the HTML file `index.html` in your browser

## 2. What do the files contain?

- `index.html` - UI which demonstrates the elevator simulation. It is a simple HTML document, with Bootstrap and React elements which help with making the layout pretty
- `sheet.css` - A simple CSS file which contains more specific decorative definitions and helps with visualizing the movement of each elevator
- `script.js` - The main file containing all of the classes and functions required for the project to work

## 3. How does the simulation work?

Firstly, wait for the script to finish setting everything up. 

Once its done, you can call an elevator to the selected floor by pressing either of the buttons under the floor label. The elevator call buttons are indistinguishable for now, as the algorithm for finding the best elevator is really simple and does not take into account the desired direction, but I left them as they are to allow someone (me) to imporve the algorithm and make both of them functional.

When the buttons are pressed, your request is added to the queue (if an elevator was not called to the floor already). If all of the elevators are currently occupied, don't worry, one of them will come pick you up as soon as it is done with processin its request. 

The main system will find the closest available elevator and send it to your floor.

When the elevator finally arives it will patiently wait for you to select your desired floor.

<b> In order to eliminate the need for the elevator to stop along its way to a selected floor, I assume that all of the elevators are single person only, so a situation where one elevator is waiting for an input while a second one is being called to the same floor is perfectly normal :) </b>

When you input the desired floor, the elevator will *give you a lift* to the selected floor, where it will then wait for the next passanger or leave to process another elevator request from the queue.

## 4. How many elevators can it operate?

If you want to change the amount of elevators you can do so by changing two constants inside the code. 
- `sheet.css` - Change `--number-of-elevators` to {desired_elevator_amount}px
- `script.js` - Change `elevator_count` to {desired_elevator_amount}

However, I don't advise to go above 16, as I haven't tested the simulation with higher numbers (although it should work fine).
