class Performance {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }
  byWeight(parameters) {
    console.log("parameters: ", parameters)

    let weight = parameters.weight || 0
    // {
    //   weight: 3350,
    //   speed: 50,
    //   wind: [0, 10, 20],
    //   pressureAltitude: [
    //     { alt: 0, temp: 59, groundRun: [490, 345, 220], TODistance: [870, 660, 465] },
    //     { alt: 2500, temp: 50, groundRun: [595, 415, 235], TODistance: [1015, 765, 550] },
    //   ],
    // },
    // {},

    // ========== Takeoff Speed ==========
    const speed = this.getTakeoffSpeed(parameters.data, weight)

    // ============= Windspeed =============
    let windspeed = parameters.wind?.replace(/[^0-9]/g, "") || 0
    const rows = root.calc.getBetweenRows(parameters.data[0].wind, windspeed)

    // Collapse the data by the windspeed
    const firstColumnIndex = rows[0]
    const secondColumnIndex = rows[1]
    const newData = parameters.data.map((row) => {
      const inputObject = row
      const outputObject = {
        weight: inputObject.weight,
        speed: inputObject.speed,
        wind: inputObject.wind.slice(firstColumnIndex, secondColumnIndex + 1),
        pressureAltitude: inputObject.pressureAltitude.map((row) => ({
          alt: row.alt,
          temp: row.temp,
          groundRun: row.groundRun.slice(
            firstColumnIndex,
            secondColumnIndex + 1
          ),
          TODistance: row.TODistance.slice(
            firstColumnIndex,
            secondColumnIndex + 1
          ),
        })),
      }
      return outputObject // Return the outputObject for each row
    })
    console.log("newData: ", newData) // Now with 2 columns instead of 3

    // ----------------------------------------------------------------
    // Option to use Test data (root.data.test)
    // ----------------------------------------------------------------
    let data = newData
    if (root.demo) {
      console.log("Demo Mode")
      data = root.data.test
      const groundRoll = this.getGroundRoll(data, speed)
      const distance = this.get50ftDistance(data, speed)
      alert(
        `Takeoff Speed: ${Math.round(speed)} kts \nGroundRoll: ${Math.round(
          groundRoll
        )} \nTakeoff Distance (50ft): ${Math.round(distance)}`
      )
      return
    }

    // ****************************************************************
    console.log("parameters.wind: ", parameters.wind) // *** wind at upper limit fails ***
    // ****************************************************************

    const windFactor = root.calc.getRatio(parameters.wind, data[0].wind)
    // data looks like this:
    /*
          [
            {
              pressureAltitude: [
                { alt: 0, temp: 59, groundRun: [490, 345], TODistance: [870, 660] },
                { alt: 2500, temp: 50, groundRun: [595, 415], TODistance: [1015, 765] },
              ],
            }
          ]
    */
    const freezeData = JSON.parse(JSON.stringify(data))
    console.log("freezeData: ", freezeData)
    //
    //  interpolate the groundRun and TODistance values using the windFactor
    //  Subtract the interpolated difference from the higher distance.
    //
    data.forEach((row) => {
      row.pressureAltitude.forEach((pa) => {
        pa.groundRun =
          pa.groundRun[0] - (pa.groundRun[0] - pa.groundRun[1]) * windFactor
        pa.TODistance =
          pa.TODistance[0] - (pa.TODistance[0] - pa.TODistance[1]) * windFactor
      })
    })

    console.log("Collapsed data ", data)

    // We are here ****************************************************************
    // This is where we'll interpolate the data based on temperature and altitude
    // Currently we assume sealevel and standard temperature
    // Find an flatten the preassureAltitude row with an alt of 0
    data.forEach((row) => {
      const firstRow = row.pressureAltitude.find((obj) => obj.alt === 0)
      Object.assign(row, firstRow)
    })
    console.log("Collapsed data ", data)

    /*

    Now to figure out the altitude interpolation factor.
    Take the given altitude and interpolate between the two closest rows
    Then, take that and refactor the standard temperature for that altitude (could also use the standard lapse rate)
    Refactor the TO and 50ft distances for that altitude.
    multiply by the temperature difference factor and the wind factor to get the final values.

    Add altitude to the parameters (need txt input field in GUI)





    parameters:wind 

newData[]:

pressureAltitude [
{alt: 0, temp: 59, groundRun: Array(2), TODistance: Array(2)}
{alt: 2500, temp: 50, groundRun: Array(2), TODistance: Array(2)}
]
speed: 42
weight: 2300
wind [10, 20]
*/

    // ********************************
    // Next, calculate the wind factor and interpolate the data ...
    // Collapsing the ground and takeoff data based on the wind factor leaving a flat row.
    // ********************************
    //                  this needs to turn into that....
    // We can also rewrite the following functions to be this structure:
    // {
    //   weight: 3350,
    //   speed: 50,
    //   wind: [0, 10, 20],
    //   pressureAltitude: [
    //     { alt: 0, temp: 59, groundRun: [490, 345, 220], TODistance: [870, 660, 465] },
    //     { alt: 2500, temp: 50, groundRun: [595, 415, 235], TODistance: [1015, 765, 550] },
    //   ],
    // },
    // {},
    // { weight: 3350, speed: 50, wind: 0, groundRun: 490, TODistance: 870 },
    // { weight: 2800, speed: 46, wind: 0, groundRun: 330, TODistance: 655 },
    // { weight: 2300, speed: 42, wind: 0, groundRun: 210, TODistance: 500 },

    //   data = [{}]

    // const index = 0; // Choose the index you want to use for the arrays

    // const inputObject = {
    //   weight: 3350,
    //   speed: 50,
    //   wind: [0, 10, 20],
    //   pressureAltitude: [
    //     { alt: 0, temp: 59, groundRun: [490, 345, 220], TODistance: [870, 660, 465] },
    //     { alt: 2500, temp: 50, groundRun: [595, 415, 235], TODistance: [1015, 765, 550] },
    //   ],
    // };

    // const outputObject = {
    //   weight: inputObject.weight,
    //   speed: inputObject.speed,
    //   wind: inputObject.wind[index],
    //   groundRun: inputObject.pressureAltitude[index].groundRun[index],
    //   TODistance: inputObject.pressureAltitude[index].TODistance[index],
    // };

    // console.log(outputObject);

    const groundRoll = this.getGroundRoll(data, speed)
    const distance = this.get50ftDistance(data, speed)
    alert(
      `Takeoff Speed: ${Math.round(speed)} kts \nGroundRoll: ${Math.round(
        groundRoll
      )} \nTakeoff Distance (50ft): ${Math.round(distance)}`
    )
  }

  getPerformance(
    data,
    type,
    weight = 0,
    wind = 0,
    temperature = 59,
    surface = "paved",
    condition = "dry"
  ) {
    const speed = this.getTakeoffSpeed(data[type], weight)
    const rows = root.calc.filterDataByProperty(data, speed, "speed") // Find the two rows that encompass the given speed
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
  getGroundRoll(data, speed) {
    //
    // Factor = (Distance-Fast - Distance-Slow) / (Speed-Fast - Speed-Slow)
    // DistanceX = DistanceSlow+ (SpeedX- SpeedSlow) * Factor
    //
    const rows = root.calc.filterDataByProperty(data, speed, "speed") // Find the two rows that encompass the given speed
    const factor =
      (rows[0].groundRun - rows[1].groundRun) / (rows[0].speed - rows[1].speed)
    const distance = rows[1].groundRun + (speed - rows[1].speed) * factor
    return distance
  }

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
