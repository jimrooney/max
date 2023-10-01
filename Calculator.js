class Calculator {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }

  celsiusToFahrenheit(celsius) {
    const fahrenheit = celsius * (9 / 5) + 32
    return fahrenheit
  }
  fahrenheitToCelsius(fahrenheit) {
    const celsius = (fahrenheit - 32) * (5 / 9)
    return celsius
  }

  getRatio(value, bounds) {
    // value (number), [0,1]
    if (bounds.length === 1) return 1
    bounds.sort((a, b) => a - b) // Sort in ascending order.
    let ratio = (value - bounds[0]) / (bounds[1] - bounds[0]) // Adjusted formula
    return ratio
  }

  getRatio2(value, bounds) {
    bounds.sort((a, b) => b - a) // Descending orer
    const Big = bounds[0]
    const Little = bounds[1]
    const Given = value
    const Total = Big - Little
    const Partial = Given - Little
    const Ratio = Partial / Total
    return Ratio
  }
  getBetweenRows(array, value) {
    for (let i = 0; i < array.length - 1; i++) {
      if (value >= array[i] && value < array[i + 1]) {
        return [i, i + 1]
      }
    }
    // Handle the case where value is equal to or greater than the highest element
    if (value >= array[array.length - 1]) {
      return [array.length - 1, array.length + 1] // Return the index of the highest element and -1
    }
    return [-1, -1] // Value is not between any indices
  }
  //----------------------------------------------------------------
  // Returns 2 adjacent rows surrounding the targetValue
  //----------------------------------------------------------------
  findAdjacentRows(objects, targetValue, propertyName) {
    // First, sort the objects by the specified property if they are not already sorted.
    objects.sort(function (a, b) {
      return a[propertyName] - b[propertyName]
    })

    // Initialize an array to store the matching objects.
    let matchingObjects = []

    // Iterate through the sorted objects array to find the two objects that encompass the target value.
    for (let i = 0; i < objects.length - 1; i++) {
      const currentObject = objects[i]
      const nextObject = objects[i + 1]

      // Check if the target value falls between the current object's property value and the next object's property value.
      if (currentObject[propertyName] <= targetValue && targetValue <= nextObject[propertyName]) {
        matchingObjects.push(currentObject, nextObject, i)
        break // Stop searching once we find the encompassing objects.
      }
    }
    matchingObjects = matchingObjects.filter((object) => typeof object === "object")
    // filter out non objects
    return matchingObjects
  }

  // findClosestObjectsByWeight(data, weight) {
  //   const sortedData = data.sort(
  //     (a, b) => Math.abs(a.weight - weight) - Math.abs(b.weight - weight)
  //   )
  //   let belowWeight = null
  //   let aboveWeight = null

  //   for (const obj of sortedData) {
  //     if (obj.weight <= weight) {
  //       belowWeight = obj
  //     } else if (obj.weight > weight) {
  //       aboveWeight = obj
  //     }
  //   }

  //   return [belowWeight, aboveWeight]
  // }

  filterAndExtractSurroundingRows(arr, propertyName, targetValue) {
    console.log("Filtering and extracting: %o %o %o", arr, propertyName, targetValue)
    // Filter the array to get objects close to the targetValue
    const filteredArray = arr.filter((obj) => {
      const alt = parseInt(obj[propertyName], 10)
      targetValue = parseInt(targetValue, 10)
      console.log("targetValue: ", Math.abs(alt - targetValue))
      Math.abs(alt - targetValue) <= 1
    })
    console.log("filteredArray: ", filteredArray)
    // Sort the filtered array by the property value
    filteredArray.sort((a, b) => Math.abs(a[propertyName] - targetValue) - Math.abs(b[propertyName] - targetValue))

    // Find the index of the closest object
    const index = filteredArray.findIndex((obj) => Math.abs(obj[propertyName] - targetValue) === 0)

    // Extract the two rows surrounding the closest object
    const beforeRow = filteredArray[index - 1]
    const afterRow = filteredArray[index + 1]

    return { beforeRow, afterRow }
  }
  calculateWindComponents(runwayDirection, windSpeed, windDirection) {
    // Convert angles to radians
    const runwayRad = (runwayDirection * Math.PI) / 180
    const windRad = (windDirection * Math.PI) / 180

    // Calculate the headwind and crosswind components
    const headwind = windSpeed * Math.cos(windRad - runwayRad)
    const crosswind = windSpeed * Math.sin(windRad - runwayRad)

    return {
      headwind: headwind.toFixed(2), // Round to 2 decimal places
      crosswind: crosswind.toFixed(2),
    }
  }

  // Example usage:
  // const runwayDirection = 120; // Runway direction in degrees
  // const windSpeed = 20; // Wind speed in knots
  // const windDirection = 240; // Wind direction in degrees

  // const components = calculateWindComponents(runwayDirection, windSpeed, windDirection);
  // console.log(`Headwind: ${components.headwind} knots`);
  // console.log(`Crosswind: ${components.crosswind} knots`);

  /*
targetAltitude: 3000
{alt: 5000, temp: 41, groundRun: 505, TODistance: 910}
{alt: 7500, temp: 32, groundRun: 625, TODistance: 1125}

  Given a property, calculate the factor between it and upper or lower bounds.
  Apply that factor to the other values.
  Return the resultant row

  
  */

  /*  
      Value: {alt: '3000'}

      Data: 
      [{…}, {…}, 1] *** (need to find that "1") *** // frozenAltitudeRows:  (3) [{…}, {…}, 1]
      [{alt: 2500, temp: 50, groundRun: 505, TODistance: 890}
      {alt: 5000, temp: 41, groundRun: 610, TODistance: 1055}]

  */

  // Will take the difference between the value's data and apply that ratio to all the other values
  interpolatePAValues(value, data, flat) {
    console.log("InterpolatePAValues: \nvalue: %o\n data: %o", value, data)

    data = data.filter((entry) => Object.keys(data).length > 0) // filter out empty entries
    const obj1 = data[0]
    const obj2 = data[1]
    const result = { ...value }

    // apply the ratio to the gap between the other object values
    for (const key in value) {
      // for each key (should only be one: alt)
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        // both objects have the key

        // find the ratio between the gap between the object values and the key's value.

        // find the ratio between the gap between the object values and the key's value.
        const min = obj1[key]
        const max = obj2[key]
        const given = value[key]

        let ratio = (given - min) / (max - min)

        // apply the ratio
        for (const k in obj2) {
          if (k !== key) {
            result[k] = obj1[k] + (obj2[k] - obj1[k]) * ratio
          }
        }
        console.log("ratio: ", ratio)
      }
    }

    return result
  }

  /*
[ 
{alt: 0, temp: 59, groundRun: 210, TODistance: 500}
{alt: 2500, temp: 50, groundRun: 255, TODistance: 545}
]
*/
  // Ttake the difference between the value's data and apply that ratio to all the other values

  /* The `applyRatioToRow` function takes a ratio and a row of data as input. It applies the ratio to
  the gap between the values in the row and returns a new row with the adjusted values. The function
  iterates over each key in the row and checks if both objects in the row have that key. If they do,
  it applies the ratio to the gap between the values for that key. If the key is an array or the
  ratio is 1, it returns the corresponding value as is. The function returns the new row with the
  adjusted values. */
  applyRatioToRow(ratio, data) {
    // apply the ratio to the gap between the other object values
    let result = {}
    Object.keys(data[0]).forEach((key) => {
      const obj1 = data[0]
      const obj2 = data[1]

      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key) && !Array.isArray(obj1[key]) && ratio !== 1) {
        // both have the key
        let invert = true
        if (key === "temp") invert = false
        result[key] = this.applyRatio(ratio, [obj1[key], obj2[key]], true)
      }

      if (Array.isArray(obj1[key]) || ratio === 1) {
        result[key] = obj1[key][1]
        if (key === "temp") result[key] = obj1[key][0]
      }

      if (ratio === 1) result[key] = obj2[key]

      if (root.debug) console.log("Result: ", result)
    })

    return result
  }

  adjustValuesByTemp(actualTemp, standardTemp, array) {
    if (actualTemp <= standardTemp) {
      return array
    }

    const unitsAbove59 = actualTemp - standardTemp
    const increment = 25 // 25 units above 59
    const increaseFactor = Math.floor(unitsAbove59 / increment)
    const percentageIncrease = 0.1 * increaseFactor

    const resultArray = array.map((value) => {
      return value + percentageIncrease * value
    })

    return resultArray
  }

  calculatePressureAltitude(altitudeInFeet, QNHInhPa) {
    const standardPressureInhPa = 1013.25;
    const expFactor = 1 / 5.256;
    const factor = Math.pow(QNHInhPa / standardPressureInhPa, expFactor);
    const pressureAltitude = (1 - factor) * 145366.45;
    return pressureAltitude;
  }

  calculateDensityAltitude(QNH, altitude, OAT) {
    // Constants for the standard atmosphere.
    const ISA_SEA_LEVEL_TEMP_C = 15 // Standard temperature at sea level in Celsius.
    const ISA_TEMP_LAPSE_RATE_C_PER_METER = -0.0065 // Temperature lapse rate in Celsius per meter.

    // Convert QNH from hPa to Pascals (1 hPa = 100 Pascals).
    const QNH_Pascals = QNH * 100

    // Calculate the pressure altitude (PA) using the barometric formula.
    const PA = (1 - (QNH_Pascals / 101325) ** 0.190284) * 44307.7

    // Calculate the ISA temperature at the given altitude.
    const ISA_temp_C = ISA_SEA_LEVEL_TEMP_C + ISA_TEMP_LAPSE_RATE_C_PER_METER * altitude

    // Calculate the density altitude.
    const densityAltitude = PA + 120 * (OAT - ISA_temp_C)

    return densityAltitude
  }
  convertInHgToQNH(inHg) {
    const QNH_hPa = inHg * 33.8639
    return QNH_hPa
  }

  adjustValuesByRatio(ratio, [obj1, obj2]) {
    const result = {}
    // apply the ratio
    for (const k in obj2) {
      const value1 = parseFloat(obj1[k])
      const value2 = parseFloat(obj2[k])
      if (!isNaN(value1) && !isNaN(value2)) {
        result[k] = value1 + (value2 - value1) * ratio
      } else if (!isNaN(value1)) {
        result[k] = value1
      } else if (!isNaN(value2)) {
        result[k] = value2
      }
    }
    return result
  }

  applyRatio(ratio, data, invert) {
    data.sort((a, b) => b - a)
    if (invert) {
      data.sort((a, b) => a - b)
    }
    if (root.debug) console.log("Apply Ratio: ratio: %o data: %o", ratio, data)
    if (ratio === 1) {
      if (data.length === 1) {
        return data[0]
      } else {
        return data
      }
    }
    const B = data[0]
    const L = data[1]
    const P = (B - L) * ratio
    const ret = B - P
    if (root.debug) console.log("ret: ", ret)
    return ret
  }
}
