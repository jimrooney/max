class Performance {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }
  //
  //
  //
  /*
    

    { weight: 3350, speed: 50, wind: 0, groundRun: 490, TODistance: 870 },
    { weight: 2800, speed: 46, wind: 0, groundRun: 330, TODistance: 655 },
    { weight: 2300, speed: 42, wind: 0, groundRun: 210, TODistance: 500 },

    // Call the function to filter objects that encompass a specific speed (e.g., 45)
      const targetSpeed = 45;
      const matchingObjects = filterObjectsBySpeed(aircrafts, targetSpeed);
      
      // Display the matching objects
      console.log(matchingObjects);

    */

  get50ftDistance(data, speed) {
    //
    // Factor = (Distance-Fast - Distance-Slow) / (Speed-Fast - Speed-Slow)
    // DistanceX = DistanceSlow+ (SpeedX- SpeedSlow) * Factor
    //
    const rows = root.calc.filterDataByProperty(data, speed, "speed") // Find the two rows that encompass the given speed
    const factor =
      (rows[0].TODistance - rows[1].TODistance) /
      (rows[0].speed - rows[1].speed)
    const distance = rows[1].TODistance + (speed - rows[1].speed) * factor
    return distance
  }

  getTakeoffSpeed(data, given) {
    // Given a weight, calculate the takeoff speed
    //
    // Factor = (SpeedHeavy - SpeedLight) / (WeightHeavy - WeightLight)
    // DistanceX = SpeedLight + (Given - WeightLight) * Factor
    //
    const rows = root.calc.filterDataByProperty(data, given, "weight") // Find the two rows that encompass the given speed
    const factor =
      (rows[0].speed - rows[1].speed) / (rows[0].weight - rows[1].weight)
    const speed = rows[1].speed + (given - rows[1].weight) * factor
    return speed
  }
}
