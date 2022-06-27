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
    if (!!elementID) {
      $(elementID).innerHTML = root.JSONTable(text)
    }
  },
  JSONTable(json) {
    const regex = /},/gi
    return json.replace(regex, "}<BR>")
  },
}

class Car {
  constructor(make, model, year) {
    this.make = make
    this.model = model
    this.year = year
  }
}
class Volvo extends Car {
  constructor(...args) {
    super(...args)
    this.make = args[0]
    this.model = args.model
    this.year = args.year
  }
}

function test() {
  root.log("Test", "Container")

  //alert("Hello! I am an alert box!")

  //root.plane.getWB()

  //root.plane = new C206({ reg: "test" })
  // console.log("Plane: ", root.plane)
  // const seats = root.plane.getSeats()

  //  const car1 = new Volvo("Eagle", "Talon TSi", 1993)

  const container = document.getElementById("Container")
  const node = document.createElement("div")

  const WB = root.plane.getWeightAndBalance()

  const P = JSON.stringify(WB)
  root.log(P, "Container")

  //const seats = [1,2,3,4]
  const seats = root.plane.getSeats()

  seats.forEach((seat) => {
    const s = new Seat(seat)
    node.appendChild(s.getNode())
  })

  container.appendChild(node)
}
function init() {
  root.plane = new C206({ reg: "test" })
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
