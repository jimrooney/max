// Register the serviceworker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(function () {
    console.log("Service Worker Registered")
  })
}

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
  airplanes: new Airplanes(),
  test: function (elementID) {
    this.log(elementID, "HI")
  },
  log: function (elementID, text) {
    //!elementID? elementID = "Log" : null
    elementID = "Log"
    $(elementID).innerHTML = root.JSONTable(text)
    //$(elementID).innerHTML = text
  },
  element: (elementID) => {
    return $(elementID)
  },
  empty: (elementID) => {
    $(elementID).innerHTML = ""
  },
  JSONTable(json) {
    // const regex = /},/gi
    // return json.replace(regex, "}<BR>")
  },
}
function update(){
  const container = document.getElementById("Container")
  const node = document.createElement("div")

  const WB = root.plane.getWeightAndBalance()

  // -- Seats --
  const seats = root.plane.getSeats()
  seats.forEach((seat) => {
    const s = new Seat(seat)
    node.appendChild(s.getNode())
  })
  container.appendChild(node)
}
function test() {
  root.log("Test", "Container")
  root.plane = root.airplanes.getPlane()
  console.log("P: ", root.plane)
  update()
}
function init() {
  root.plane = new C208({ reg: "test" })
  console.log("Instance: ", root.plane.constructor.name)

  const getMethods = Object.keys(document)
  console.log("Names: ", getMethods)
  console.log("Plane: ", root.plane)
  const seats = root.plane.getSeats()

  console.log("Seats: ", seats)

  const container = $("Container")
  const node = document.createElement("div")
  node.addEventListener("click", () => {
    console.log("Plane: ", root.plane)
  })

  seats.forEach((seat) => {
    const s = new Seat(seat)
    node.appendChild(s.getNode())
  })

  // const textnode = document.createTextNode("More")
  // node.appendChild(textnode)
  container.appendChild(node)
}
function sendMail() {}
