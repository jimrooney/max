let currentDraggable = null
let startX,
  startY,
  initialTranslateX = 0,
  initialTranslateY = 0
let dragging = false

document.addEventListener("DOMContentLoaded", function () {
  const draggableContainer = document.getElementById("draggableContainer")

  // Touch and Mouse Start
  const startEvent = (e) => {
    const target = e.target
    if (target.classList.contains("draggable")) {
      currentDraggable = target
      startX = e.clientX || e.touches[0].clientX
      startY = e.clientY || e.touches[0].clientY
      const transformStyle = window.getComputedStyle(currentDraggable).transform
      const matrix = new DOMMatrix(transformStyle)
      initialTranslateX = matrix.m41 || 0
      initialTranslateY = matrix.m42 || 0
      dragging = true
      e.preventDefault()
    }
  }

  const moveEvent = (e) => {
    if (dragging) {
      const clientX = e.clientX || e.touches[0].clientX
      const clientY = e.clientY || e.touches[0].clientY
      const offsetX = clientX - startX
      const offsetY = clientY - startY

      // Check if the current draggable element has the "constraint" attribute set to "y"
      const constraint = currentDraggable.getAttribute("constraint")

      // Update the translate values based on the constraint
      let newTranslateX = initialTranslateX
      let newTranslateY = initialTranslateY

      switch (constraint) {
        case "x":
          newTranslateX += offsetX
          break
        case "y":
          newTranslateY += offsetY
          break
        default:
          newTranslateX += offsetX
          newTranslateY += offsetY
      }

      currentDraggable.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px`

      // Prevent the default touchmove behavior to prevent scrolling
      e.preventDefault()
      updateEvent(currentDraggable)
    }
  }
  const updateEvent = (obj) => {
    // Get bounding client rect to get on-screen position
    const rect = obj.getBoundingClientRect() // rect contains top, left, bottom, right, x, y properties
    const control = obj.getAttribute("control") // gets what this object controls, like "altitude"
    const constraint = obj.getAttribute("constraint")
    const display = document.getElementById(control) // the display box on the div
    const screenHeight = window.innerHeight
    const screenWidth = window.innerWidth

    const bounds = {
      wind: getBounds(root.parameters.data[0].wind),
    }

    const divStyle = window.getComputedStyle(obj.parentNode)
    const container = {
      width: parseInt(divStyle.getPropertyValue("width"), 10),
      height: parseInt(divStyle.getPropertyValue("height"), 10),
      style: divStyle,
    }

    const factor = rect.y / parseInt(container.height)
    const xfactor = rect.x / parseInt(container.width)

    const flip = container.height - parseInt(container.height) * factor // flip vertical, so higher on the screen = higher altitude
    const objHeightPercent = flip * 10 //(rect.y / screenHeight) * 10000;

    // updates the tracked dragger's output display value
    switch (constraint) {
      case "x":
        display.value = parseInt(xfactor * bounds.wind[1], 10)
        break
      case "y":
        display.value = objHeightPercent
        break
    }

    let output = JSON.stringify(root.data.C185.takeoff)
    document.getElementById("output").value = output
    const parameters = {
      data: root.data.C185.takeoff,
      weight: document.querySelector("#weight").value, //|| 2400,
      wind: document.querySelector("#headwind").value || 0,
      altitude: document.querySelector("#altitude").value || 0,
    }


// **********************************************************************************************************
// passing in parameters...
    const result = root.performance.byWeight(parameters) // do the calculations
// **********************************************************************************************************






    // Just displaying raw data to a text field for now ********************************
    const out = `Speed: ${Math.round(result.speed)}
\nGround Run: ${Math.round(result.groundRun)}
\nTO Distance: ${Math.round(result.TODistance)}`

    document.getElementById("output").value = out
  }

  // Touch and Mouse End
  const endEvent = () => {
    dragging = false
  }

  draggableContainer.addEventListener("mousedown", startEvent)
  draggableContainer.addEventListener("mousemove", moveEvent)
  draggableContainer.addEventListener("mouseup", endEvent)

  draggableContainer.addEventListener("touchstart", startEvent, {
    passive: false,
  })
  window.addEventListener("touchmove", moveEvent, { passive: false })
  window.addEventListener("touchend", endEvent, { passive: false })

  function getTranslateY(element) {
    const transformStyle = window.getComputedStyle(element).transform
    const matrix = new DOMMatrix(transformStyle)
    return matrix.m42 || 0
  }
})

function getBounds(arr) {
  if (arr.length === 0) {
    return []; // Return an empty array if the input array is empty
  }

  return arr.reduce(function (acc, current) {
    // Find the lowest value
    if (current < acc[0]) {
      acc[0] = current;
    }

    // Find the highest value
    if (current > acc[1]) {
      acc[1] = current;
    }

    return acc;
  }, [Infinity, -Infinity]); // Initialize with Infinity and -Infinity
}
