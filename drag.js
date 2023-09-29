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
    const sliderbar = document.getElementById(obj.getAttribute("bar"))
    const constraint = obj.getAttribute("constraint")
    const display = document.getElementById(control) // the display box on the div
    const screenHeight = window.innerHeight
    const screenWidth = window.innerWidth

    const bounds = {
      wind: getBounds(root.parameters.data[0].wind),
      alt: getBounds(root.parameters.data[0].pressureAltitude.map((item) => item.alt)),
      weight: getBounds(root.parameters.data.map((item) => item.weight)),
      temp: [0, 50],
    }

    // Get references to the inner and containing divs
    const innerDiv = obj
    const containingDiv = sliderbar

    // Get the positions of both divs
    const innerDivRect = innerDiv.getBoundingClientRect()
    const containingDivRect = containingDiv.getBoundingClientRect()

    // Calculate the position of the inner div relative to the containing div
    const relativeX = innerDivRect.left - containingDivRect.left
    const relativeY = innerDivRect.top - containingDivRect.top

    const container = {
      width: containingDiv.offsetWidth,
      height: containingDiv.offsetHeight,
      x: containingDivRect.left,
      y: containingDivRect.top,
    }

    const dragBox = {
      rectangle: rect,
      x: rect.left,
      y: rect.top,
      relativeX: relativeX,
      relativeY: relativeY,
      ratioX: relativeX / parseInt(container.width),
      ratioY: 1 - relativeY / parseInt(container.height), // reverse for vertical values.. so higher position = higher number
    }

    const GUICalc = {
      headwind: root.getValueInRange(dragBox.ratioX * bounds.wind[1], bounds.wind),
      altitude: root.getValueInRange(dragBox.ratioY * bounds.alt[1], bounds.alt),
      weight: root.getValueInRange(
        // more complex because the lower bound isn't zero
        dragBox.ratioY * (bounds.weight[1] - bounds.weight[0]) + bounds.weight[0],
        bounds.weight
      ),
      temp: root.getValueInRange(dragBox.ratioY * bounds.temp[1], bounds.temp),
    }

    // updates the tracked dragger's output display value
    display.value = Math.round(GUICalc[control])

    // **********************************************************************************************************
    // Pulls the values from the text boxes we just filled... we can skip this step and wire them directly to the calculations
    // **********************************************************************************************************
    let output = JSON.stringify(root.data.C185.takeoff)
    document.getElementById("output").value = output
    const parameters = {
      data: root.data.C185.takeoff,
      weight: document.querySelector("#weight").value, //|| 2400,
      wind: document.querySelector("#headwind").value || 0,
      altitude: document.querySelector("#altitude").value || 0,
      temp: document.querySelector("#temp").value || 0,
    }

    // **********************************************************************************************************
    // passing in parameters...
    const result = root.performance.byWeight(parameters) // do the calculations
    // **********************************************************************************************************

    // Just displaying raw data to a text field for now ********************************
    const out = `
    Speed: ${Math.round(result.speed)}
    Ground Run: ${Math.round(result.groundRun)}
    TO Distance: ${Math.round(result.TODistance)}`

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
    return [] // Return an empty array if the input array is empty
  }

  return arr.reduce(
    function (acc, current) {
      // Find the lowest value
      if (current < acc[0]) {
        acc[0] = current
      }

      // Find the highest value
      if (current > acc[1]) {
        acc[1] = current
      }

      return acc
    },
    [Infinity, -Infinity]
  ) // Initialize with Infinity and -Infinity
}
