class Calculator {
  constructor() {}
  hello(message) {
    message = !message || message
    alert(message.toString())
    console.log("hello")
    return "hello"
  }
  getRatio(value, bounds) {
    return (bounds[1] - bounds[0]) / value // Returns the percentage value is of the range
  }
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
        matchingObjects.push(currentObject, nextObject)
        break // Stop searching once we find the encompassing objects.
      }
    }

    return matchingObjects
  }
}
