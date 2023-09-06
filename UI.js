let isDragging = false // Flag to track if dragging is in progress
let lastPosition = { x: 0, y: 0 } // Store the last position

// Function to log the position when dragging stops
function logPosition(x, y) {
  console.log("Drag at:", x, y)
}
// Function to update the div's position
function updateDivPosition(x, y) {
  //divToFollow.style.left = x + "px"
  const divHeight = divToFollow.clientHeight
  divToFollow.style.top = y - divHeight / 2 + "px"
  divToFollow.querySelector('input').value = divToFollow.style.top
}

// Function to handle the start of dragging
function startDragging(x, y) {
  isDragging = true
  lastPosition = { x, y }
  logPosition(x, y)
}

// Function to handle the end of dragging
function stopDragging() {
  if (isDragging) {
    logPosition(lastPosition.x, lastPosition.y)
    isDragging = false
  }
}

// Event listeners for mouse events
document.addEventListener("mousedown", (e) => {
  e.preventDefault() // Prevent text selection while dragging
  startDragging(e.clientX, e.clientY)
})

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    lastPosition = { x: e.clientX, y: e.clientY }
    updateDivPosition(e.clientX, e.clientY)
  }
})

document.addEventListener("mouseup", () => {
  stopDragging()
})

// Event listeners for touch events
document.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault() // Prevent default touch behavior
    const touch = e.touches[0]
    startDragging(touch.clientX, touch.clientY)
    updateDivPosition(touch.clientX, touch.clientY)
  },
  { passive: false } // Specify passive: false to preventDefault
)

document.addEventListener(
  "touchmove",
  (e) => {
    if (isDragging) {
      const touch = e.touches[0]
      lastPosition = { x: touch.clientX, y: touch.clientY }
      updateDivPosition(touch.clientX, touch.clientY)
    }
  },
  { passive: false } // Specify passive: false to preventDefault
)

document.addEventListener("touchend", () => {
  stopDragging()
})
