class UI {
  constructor(data) {
    this.data = { ...this.data, ...data }
    this.dragDivs = {}
    this.activeDiv = null
    this.lastPosition = { x: 0, y: 0 }
    this.hi = "HI"
    this.init()
  }
  log(message){
    document.getElementById('debug').innerHTML = "Bugga"
  }
  rotateElement(element, degrees) {
    if (element) {
      element.style.transform = `rotate(${degrees}deg)`
    }
  }
  rotateDiv(div, degrees) {
    console.log("rotate")
    if (div) {
      // Ensure degrees are within the range [0, 360)
      degrees = ((degrees % 360) + 360) % 360

      // Convert degrees to radians
      const radians = (degrees * Math.PI) / 180

      // Apply the new rotation
      div.style.transform = `rotate(${radians}rad)`
    }
  }
  init() {
    
//
// Attach event listeners to the document to capture mouse events (drag and up)
//

// -- Down --
// Mouse and Touch down events are fired by clicking on the div.

// -- Mouse Move -- (drag)
// document.addEventListener("mousemove", (e) => {
//   if (!!this.activeDiv) {
//     this.lastPosition = { x: e.clientX, y: e.clientY }
//     this.updateDivPosition(e.clientX, e.clientY)
//   }
// })
// // -- Touch Move -- (drag)
// document.addEventListener(
//   "touchmove",
//   (e) => {
//     if (!!this.activeDiv) {

//     }

//     const touch = e.touches[0]
//     this.lastPosition = { x: touch.clientX, y: touch.clientY }
//     this.updateDivPosition(touch.clientX, touch.clientY)
//     if(root.isIOs) e.preventDefault()

//     this.log("moving...")
//   },
// )

// // -- Up --
// document.addEventListener("mouseup", () => {
//   this.stopDragging()
// })
// document.addEventListener("touchend", () => {
//   this.stopDragging()
// })


} // ----------------------- end init() -----------------------

  // === Set a div to draggable ===
  // Adds an event listener that sets the div as the ActiveDiv when clicked on or touched.
  setDraggable(elementCollection) {
    elementCollection.each((dragDiv) => {
      if (!!dragDiv.id) {
        // -- Down --
        dragDiv.addEventListener("mousedown", (e) => {
          e.preventDefault() // Prevent text selection while dragging
          this.setActiveDiv(dragDiv)
        })
        dragDiv.addEventListener(
          "touchstart",
          (e) => {
            this.setActiveDiv(dragDiv)
            if(root.isIOs) e.preventDefault()
          },
        )
      }
    })
  }
  setActiveDiv(activeDiv) {
    this.activeDiv = activeDiv
  }
  clearActiveDiv() {
    this.activeDiv = null
  }
  // Function to update the div's position
  updateDivPosition(x, y) {
    //root.ui.activeDiv.style.left = x + "px" //for horizontal scrolling
    if (!!this.activeDiv) {
      const divHeight = root.ui.activeDiv.clientHeight
      root.ui.activeDiv.style.top = y - divHeight / 2 + "px"
      root.ui.activeDiv.querySelector("input").value =
        root.ui.activeDiv.style.top

      const airplaneIcon = document.getElementById("airplane-icon")
      this.rotateDiv(airplaneIcon, y)
    }
  }
  // == Start of dragging ==
  startDragging(x, y) {
    this.lastPosition = { x, y }
  }
  // == End of dragging ==
  stopDragging() {
    if (!!this.activeDiv) {
    }
    this.activeDiv = null
  }
}

// -- Down --
// document.addEventListener("mousedown", (e) => {
//   e.preventDefault() // Prevent text selection while dragging
//   this.startDragging(e.clientX, e.clientY)
// })
// document.addEventListener(
//   "touchstart",
//   (e) => {
//     e.preventDefault() // Prevent default touch behavior
//     const touch = e.touches[0]
//     this.startDragging(touch.clientX, touch.clientY)
//   },
//   { passive: false } // Specify passive: false to preventDefault
// )
