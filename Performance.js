class Performance {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }
  byWeight(parameters) {
    console.log("parameters: ", JSON.parse(JSON.stringify(parameters)))

    // // *** Maybe set a value here so this condition can be flagged visually in the GUI ***
    // const maxHeadwind = parameters.data[0].wind.slice(
    //   parameters.data[0].wind.length - 1
    // )
    // if (parameters.wind > maxHeadwind) {
    //   alert(
    //     `Wind value (${parameters.wind}kts) is beyond chart values,\nmaximum headwind value (${maxHeadwind}kts) will be used`
    //   )
    // }
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
    console.log("newData: ", JSON.parse(JSON.stringify(newData))) // Now with 2 columns (or 1) instead of 3
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
    console.log("\n\n")
    console.log("parameters.wind: ", parameters.wind)
    console.log("freezeData: ", JSON.parse(JSON.stringify(data)))
    //
    //  interpolate the groundRun and TODistance values using the windFactor
    //  Subtract the interpolated difference from the higher distance.
    //
    // If at the upper limit wind, all arrays will be single value...
    // Hence the || operator (just use the value given)

    const targetAltitude = document.getElementById("altitude").value || 0
    console.log("targetAltitude: ", targetAltitude)

    // ----------------------------------------------------------------
    // Adjust PA values for wind
    // ----------------------------------------------------------------
    console.log("Get Wind Factor: %o %o ", parameters.wind, data[0].wind)
    const windFactor = root.calc.getRatio(parameters.wind, data[0].wind)

    console.log("(ratio) windFactor: ", windFactor)

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
    console.log("Frozen Wind Data: " , JSON.parse(JSON.stringify(data)))
    console.log("Wind adjusted data: ", data) 

    const adjacentRows = root.calc.findAdjacentRows(data, weight, "weight")
    const adjacentWeights = adjacentRows.map((item) => item.weight)
    console.log("Rows: %o Weights: %o", adjacentRows, adjacentWeights)
    const weightRatio = root.calc.getRatio(weight, adjacentWeights)
    console.log("weightRatio: ", weightRatio)
    console.log("FrozenData: " , JSON.parse(JSON.stringify(data)))// I trust the data to this point ********************
    
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

      console.log("PA Ratio: ", ratio)
      console.log("Surrounding Rows: ", surroundingRows)

      const result = root.calc.applyRatioToRow(ratio, surroundingRows)
        console.log("Result: ", result)
      row = { ...row, ...result }
      console.log("Row: ", row)
      return row
    })
    console.log("FrozenData: " , JSON.parse(JSON.stringify(data)))

return

    // Later, for fun, maybe consolodate this into an interpolate function ***
    data = data.map((row) => {
      // First, check if the row has a "pressureAltitude" property and if it's an array
      if (Array.isArray(row.pressureAltitude)) {
        console.log("row ", row)
        const ratio = root.calc.getRatio(
          { alt: targetAltitude },
          row.pressureAltitude
        )
        console.log("Pressure Altitude Ratio: ", ratio)
        // Loop through the "pressureAltitude" array and adjust arrays within each object
        row.pressureAltitude = row.pressureAltitude.map((pa) => {
          for (let key in pa) {
            if (Array.isArray(pa[key])) {
              pa[key] = root.calc.applyRatio(ratio, pa[key])
              console.log("key: &o | pa[key]: %o", key, pa[key])
            }
          }
          return pa
        })
        // row.pressureAltitude = root.calc.interpolatePAValues(
        //   { alt: targetAltitude },
        //   row.pressureAltitude
        // )
      }
      // console.log("row: %o", row)
      // row = { ...row, ...row.pressureAltitude }
      return row
    })

    return

    // We are here ****************************************************************
    // ----------------------------------------------------------------
    // Interpolate for weight
    // ----------------------------------------------------------------

    //    get rows between by weight
    //    Then interpolate by weight and we're done.

    // Can likely use the same technique as above to take the two altitude arrays for each weight and interpolate them into one row.
    // Then we interpolate the three rows into one based on weight.

    // Strip down the altitudes to just the surrounding altitudes
    let ratio

    // Flatten the object (remove arrays and objects, just key:value pairs)
    data = data.map((row) => {
      const keyValueArray = Object.entries(row)
      const filteredArray = keyValueArray.filter(
        ([key, value]) => typeof value !== "object" && !Array.isArray(value)
      )
      row = Object.fromEntries(filteredArray)
      return row
    })
    console.log("Data:: ", JSON.parse(JSON.stringify(data)))

    data = root.calc.findAdjacentRows(data, weight, "weight")
    data = root.calc.interpolateValues({ weight: weight }, data)

    console.log("Result: ", data)

    alert(
      `Takeoff Speed: ${Math.round(data.speed)} kts \nGroundRoll: ${Math.round(
        data.groundRun
      )} \nTakeoff Distance (50ft): ${Math.round(data.TODistance)}`
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
