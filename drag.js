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

  // Touch and Mouse Move
  const moveEvent = (e) => {
    if (dragging) {
      const clientX = e.clientX || e.touches[0].clientX
      const clientY = e.clientY || e.touches[0].clientY
      const offsetX = clientX - startX
      const offsetY = clientY - startY
  
      // Check if the current draggable element has the "constraint" attribute set to "y"
      const isYConstrained = currentDraggable.getAttribute("constraint") === "y"
  
      // Update the translate values based on the constraint
      const newTranslateX = isYConstrained ? initialTranslateX : initialTranslateX + offsetX
      const newTranslateY = isYConstrained ? initialTranslateY + offsetY : initialTranslateY
  
      currentDraggable.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`
      e.preventDefault()
    }
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
