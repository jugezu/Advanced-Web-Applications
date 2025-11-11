// run tsc and node dist/app.js
// 1.
console.log("Hello World!")

// 2. 
type TVehicle = {
    model: string,
    color: string,
    year: number,
    power: number
}

let vehicle: TVehicle = {
    model:"Boring generic vehicle",
    color: "Red",
    year: 1993,
    power: 60

}
console.log(vehicle)

// 3.
interface IVehicle {
    model: string,
    color: string,
    year: number,
    power: number
}

interface ICar extends IVehicle {
    bodyType: string,
    wheelCount: number
}

interface IBoat extends IVehicle {
    draft: number
}

interface IPlane extends IVehicle {
    wingspan: number
}

let Car: ICar= { 
    model: "Ford focus", 
    color: "Green", 
    year: 2016, 
    power: 150, 
    bodyType: "Hatchback", 
    wheelCount: 4 
} 

let Plane: IPlane= { 
    model: "Boeing 777", 
    color: "White", 
    year: 2020, 
    power: 170000, 
    wingspan: 65 
}

let Boat: IBoat= { 
    model: "Bella", 
    color: "Black", 
    year: 2022, 
    power: 100, 
    draft: 0.42 
}

console.log(Car,Plane,Boat)

// 4.
class VehicleService<T>{
    private items: T[]= []

    add(item:T):void{
        this.items.push(item)        
    }
    list():T[]{
        return this.items
    }
}


let cars= new VehicleService<ICar>()
let boats= new VehicleService<IBoat>()
cars.add(Car)
boats.add(Boat)

console.log(cars.list())
console.log(boats.list())
