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
}
