class Performance {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }
  byWeight(parameters) {
    if (!parameters) parameters = root.parameters // use defaults if none are passed in.
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
    let windspeed = parameters.wind.replace(/[^0-9]/g, "") || 0
    const rows = root.calc.getBetweenRows(parameters.data[0].wind, windspeed)

    // Collapse the data by the windspeed // ********* This might not be necessary *********
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
    if (root.debug) console.log("newData: ", JSON.parse(JSON.stringify(newData))) // Now with 2 columns (or 1) instead of 3
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
          if(root.debug) console.log("\n\n")
          if(root.debug) console.log("parameters.wind: ", parameters.wind)
          if(root.debug) console.log("freezeData: ", JSON.parse(JSON.stringify(data)))
    //
    //  interpolate the groundRun and TODistance values using the windFactor
    //  Subtract the interpolated difference from the higher distance.
    //
    // If at the upper limit wind, all arrays will be single value...
    // Hence the || operator (just use the value given)

    const targetAltitude = document.getElementById("altitude").value || 0
    if(root.debug) console.log("targetAltitude: ", targetAltitude)

    // ----------------------------------------------------------------
    // Adjust PA values for wind
    // ----------------------------------------------------------------
    if(root.debug) console.log("Get Wind Factor: %o %o ", parameters.wind, data[0].wind)
    const windFactor = root.calc.getRatio(parameters.wind, data[0].wind)

    if(root.debug) console.log("(ratio) windFactor: ", windFactor)

    data = data.map((row) => {
      // First, check if the row has a "pressureAltitude" property and if it's an array
      if (Array.isArray(row.pressureAltitude)) {
        // Loop through the "pressureAltitude" array and adjust arrays within each object
        row.pressureAltitude = row.pressureAltitude.map((pa) => {
          for (let key in pa) {
            if (Array.isArray(pa[key])) {
              pa[key] = root.calc.applyRatio(windFactor, pa[key])
              if (root.debug) console.log("key: &o | pa[key]: %o", key, pa[key])
            }
          }
          return pa
        })
      }
      return row
    })
    if (root.debug)     console.log("Frozen Wind Data: " , JSON.parse(JSON.stringify(data)))
    if (root.debug)     console.log("Wind adjusted data: ", data) 
    
    // Collapse for PA (2 sets of 2 rows become 2 sets of 1 row)
    // The collapse the two remaining rows for weight
    // First reach into each PA set and get the adjacent rows... then collapse them by ratio by targetAltitude
    // Then with the two last rows, get the adjacent rows based on weight and then collapse them.

    data = data.map((row) => { // collapse PA to 2 surrounding rows
      let surroundingRows = root.calc.findAdjacentRows(
        row.pressureAltitude,
        targetAltitude,
        "alt"
      )
      const paRows = surroundingRows.map((item) => item.alt) // [2]
      const ratio = root.calc.getRatio(targetAltitude,paRows)

      if(root.debug) console.log("PA Ratio: ", ratio)
      if(root.debug) console.log("Surrounding Rows: ", surroundingRows)

      const result = root.calc.applyRatioToRow(ratio, surroundingRows)
      if(root.debug)    console.log("Result: ", result)
      row = { ...row, ...result }
      if(root.debug) console.log("Row: ", row)
      return row
    })

    const adjacentRows = root.calc.findAdjacentRows(data, weight, "weight")
    const adjacentWeights = adjacentRows.map((item) => item.weight)
    if(root.debug) console.log("Rows: %o Weights: %o", adjacentRows, adjacentWeights)
    const weightRatio = root.calc.getRatio(weight, adjacentWeights)

    if(root.debug) console.log("weightRatio: ", weightRatio)
    if(root.debug) console.log("FrozenData: " , JSON.parse(JSON.stringify(data)))

    if(root.debug) console.log("applyRatioToRow: ratio: %o  Data: %o ", weightRatio, adjacentRows)
    data = root.calc.applyRatioToRow(weightRatio, adjacentRows)

    if(root.debug) console.log("FrozenData: " , JSON.parse(JSON.stringify(data)))
    if(root.debug) console.log("Result: ", data)

    const tmpAdjusted = root.calc.adjustValuesByTemp(root.calc.celsiusToFahrenheit(parameters.temp) , data.temp, [data.groundRun, data.TODistance])

    const ret = {
      speed: data.speed,
      groundRun: tmpAdjusted[0],
      TODistance: tmpAdjusted[1],
      data: data,
    }
    return ret
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
    const rows = root.calc.findAdjacentRows(data, speed, "speed") // Find the two rows that encompass the given speed
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
    const rows = root.calc.findAdjacentRows(data, speed, "speed") // Find the two rows that encompass the given speed
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
    const rows = root.calc.findAdjacentRows(data, speed, "speed") // Find the two rows that encompass the given speed
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
    const rows = root.calc.findAdjacentRows(data, given, "weight") // Find the two rows that encompass the given speed
    const factor =
      (rows[0].speed - rows[1].speed) / (rows[0].weight - rows[1].weight)
    const speed = rows[1].speed + (given - rows[1].weight) * factor
    return speed
  }
}
