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
  const rect = obj.getBoundingClientRect();
  const control = obj.getAttribute("control")
  const display = document.getElementById(control)
  const screenHeight = window.innerHeight;

  const factor = rect.y / screenHeight
  const flip = screenHeight - screenHeight * factor
  const objHeightPercent = flip * 10 //(rect.y / screenHeight) * 10000; 


display.value = objHeightPercent
doClick() // ***** In performance.html, needs to change, but this will make it fire for now *****


  // rect contains top, left, bottom, right, x, y properties
 // console.log("OBJ %", objHeightPercent)
}
  
  

  // Touch and Mouse End
  const endEvent = () => {
    dragging = false
  }

  draggableContainer.addEventListener("mousedown", startEvent)
  draggableContainer.addEventListener("mousemove", moveEvent)
  draggableContainer.addEventListener("mouseup", endEvent)

  draggableContainer.addEventListener("touchstart", startEvent, { passive: false })
  window.addEventListener("touchmove", moveEvent, { passive: false })
  window.addEventListener("touchend", endEvent, { passive: false })

  function getTranslateY(element) {
    const transformStyle = window.getComputedStyle(element).transform
    const matrix = new DOMMatrix(transformStyle)
    return matrix.m42 || 0
  }
})
