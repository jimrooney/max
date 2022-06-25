// jQuery style DOM selector... cuz it's easier
function $(x) {
  return document.getElementById(x)
}

// Prototype .clear() onto all DOM elements
HTMLElement.prototype.empty = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild)
  }
}
var root = {
  test: function (elementID) {
    this.log(elementID, "HI")
  },
  log: function (elementID, text) {
    this.element(elementID).innerHTML = text
  },
  element: (elementID) => {
    return $(elementID)
  },
  empty: (elementID) => {
    $(elementID).innerHTML = ""
  },
  log: (text, elementID) => {
    console.log(text)
    if (!!elementID) {
      $(elementID).innerHTML = text
    }
  },
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(function () {
    console.log("Service Worker Registered")
  })
}
function init() {
  root.plane = new C206({ reg: "test" })
  console.log("Plane: ", root.plane)
  const seats = root.plane.getSeats()

  console.log("Seats: ", seats)

  const container = $("Container")
  const node = document.createElement("div")
  node.addEventListener("click",()=>{
    console.log("Plane: ", root.plane)
  })

  seats.forEach(seat=>{
    const s = new Seat(seat)
    node.appendChild(s.getNode())
  })

  // const textnode = document.createTextNode("More")
  // node.appendChild(textnode)
  container.appendChild(node)
}
function sendMail() {}
