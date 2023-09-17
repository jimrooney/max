class Calculator {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }
  getRatio(value, bounds) {
    bounds.sort((a, b) => b - a)
    return (value - bounds[1]) / (bounds[0] - bounds[1])
  }
  useRatio(ratio, bounds) {
    // Sort the bounds array in descending order
    bounds.sort((a, b) => b - a)
    return (bounds[0] - bounds[1]) * ratio + bounds[1]
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
  // JS Query Select
  //----------------------------------------------------------------
  filterDataByProperty(objects, targetValue, propertyName) {
    // First, sort the objects by the specified property if they are not already sorted.
    objects.sort(function (a, b) {
      return a[propertyName] - b[propertyName]
    })

    // Initialize an array to store the matching objects.
    const matchingObjects = []

    // Iterate through the sorted objects array to find the two objects that encompass the target value.
    for (let i = 0; i < objects.length - 1; i++) {
      const currentObject = objects[i]
      const nextObject = objects[i + 1]

      // Check if the target value falls between the current object's property value and the next object's property value.
      if (
        currentObject[propertyName] <= targetValue &&
        targetValue <= nextObject[propertyName]
      ) {
        matchingObjects.push(currentObject, nextObject, i)
        break // Stop searching once we find the encompassing objects.
      }
    }
    return matchingObjects
  }

  filterAndExtractSurroundingRows(arr, propertyName, targetValue) {
    // Filter the array to get objects close to the targetValue
    const filteredArray = arr.filter(
      (obj) => Math.abs(obj[propertyName] - targetValue) <= 1
    )

    // Sort the filtered array by the property value
    filteredArray.sort(
      (a, b) =>
        Math.abs(a[propertyName] - targetValue) -
        Math.abs(b[propertyName] - targetValue)
    )

    // Find the index of the closest object
    const index = filteredArray.findIndex(
      (obj) => Math.abs(obj[propertyName] - targetValue) === 0
    )

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
  interpolateValues(value, data) {
    console.log("Interpolate: \nvalue: %o\n data: %o", value, data)
    if (data.length !== 1) {
      if (data.length > 1) {
        data.pop()
      } else {
        throw new Error("Input data array must contain exactly two objects.")
      }
    }
    const obj1 = data[0]
    const obj2 = data[1]

    const result = {}

    // apply the ratio to the gap between the other object values
    for (const key in value) {
      // for each key (should only be one: alt)
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        // both objects have the key

        // find the ratio between the gap between the object values and the key's value.

        const gap = obj2[key] - obj1[key]
        const given = value[key]
        const ratio = gap > 0 ? given / gap : given / obj2[key] // if 0 gap, means it's the top value, so use that.

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
  applyRatio(ratio, data) {
    if (root.trace) console.log("Apply Ratio: ratio: %o data: %o", ratio, data)
    if (ratio === 1) return data
    return data.map((row) => row - row * ratio)
  }
}
