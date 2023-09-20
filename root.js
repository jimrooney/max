if (!root) {
  var root = {}
}
Array.prototype.each = Array.prototype.forEach // jQuery style method

root = {
  ...root,
  showWam: true,
  airplanes: new Airplanes(),
  display: new Display(),
  data: data, // deefault plane data
  performance: new Performance(),
  calc: new Calculator(),
  ui: new UI(),

  // Check for Apple
  iOSCheck() {
    const userAgent = navigator.userAgent;
    const iOSDevices = ["iPhone", "iPad", "iPod"];
  
    for (const device of iOSDevices) {
      if (userAgent.includes(device)) {
        return true;
      }
    }
  
    return false;
  },
  //
  // Load external data
  //
  loadSettings(url = "http://localhost:5500/settings.json") {
    // [ Error handling and sanitization here ] ***
    url = document.getElementById("SettingsURL").value || url
    console.log("LoadSettings: ", url)
    this.load(url)
  },
  load: (url = "http://localhost:5500/settings.json") => {
    fetch(url)
      .then((res) => res.json())
      .catch((err) => console.log("Error: ", err))
      .then((out) => {
        root.log("JSON Loaded! ")
        this.data = out
        root.data = this.data
        root.showButtons()
      })
      .catch((err) => console.log("error: ", err))
  },
  showButtons() {
    Array.from(document.getElementsByClassName("Airplanes")).forEach(
      (airplane) => {
        airplane.innerHTML = ""
      }
    )
    root.data.airplanes.forEach((plane) => {
      const button = document.createElement("button")
      button.onclick = () => root.setPlane(plane.reg)
      button.classList.add(plane.reg)
      button.classList.add("UI")
      button.classList.add("AirplaneButton")
      button.innerHTML = plane.reg
      console.log("Adding button")

      document.getElementById("Airplanes").appendChild(button)
      //      $("Airplanes").appendChild(button)

      // const airplanes = document.getElementsByClassName("Airplanes")
      // const airplanesArray = [...airplanes]

      // console.log("airplanes ", airplanesArray)
      // airplanesArray.forEach((airplane) => {
      //   airplane.appendChild(button)
      // })
    })
  },
  test: function () {
    console.log("SW V: ", SW_Version)
    return
  },
  alert(msg) {
    console.log("Alert: ", msg)
    alert(msg)
  },
  IOSCheck() {
    // const isIos = () => {
    //   const userAgent = window.navigator.userAgent.toLowerCase()
    //   return /iphone|ipad|ipod/.test(userAgent)
    // }
    // // Detects if device is in standalone mode
    // const isInStandaloneMode = () =>
    //   "standalone" in window.navigator && window.navigator.standalone
    // // Checks if should display install popup notification:
    // if (isIos() && !isInStandaloneMode()) {
    //   document.getElementById("Log").innerHTML = "iOS True, not installed"
    // }
    // if (isIos() && isInStandaloneMode) {
    //   document.getElementById("Log").innerHTML = "iOS True, Installed"
    // }
  },
  click: {
    timer: 0,
    prevent: false,
    delay: 300,
    single: (funct) => {
      const that = root.click
      setTimeout(() => {
        if (!that.prevent) {
          funct()
        }
        that.prevent = false
      }, that.delay)
    },
    double: (funct) => {
      const that = root.click
      that.prevent = true
      funct()
    },
  },
  log: function (text) {
    // //!elementID? elementID = "Log" : null
    // elementID = "Log"
    // document.getElementById(elementID).innerHTML = text
    // //document.getElementById(elementID).innerHTML = text
  },
  element: (elementID) => {
    return document.getElementById(elementID)
  },
  empty: (elementID) => {
    document.getElementById(elementID).innerHTML = ""
  },
  JSONTable(json) {
    // const regex = /},/gi
    // return json.replace(regex, "}<BR>")
  },
  setPlane(plane) {
    // called by Button Click
    console.log("SetPlane")
    this.airplanes.loadPlanes()
    this.empty("Airplane")
    this.plane = this.airplanes.getPlane(plane)
    this.update()
    // putting after update for testing...
    this.clearPlanes()
    let buttons = Array.from(document.getElementsByClassName(this.plane.reg))
    buttons.forEach((button) => {
      button.classList.add("Selected")
      button.style.background = this.plane.regcolor
    })
    // Color Bar
    document.getElementById("Log").style.background = this.plane.regcolor
    // Fuel
    document.getElementById("Fuel").innerHTML = "" // Clear fuel selector
    document.getElementById("Fuel").appendChild(this.plane.fuelSelector)
    const F = this.plane.stations.filter((station) =>
      station.type.includes("fuel")
    )
    const FQ = F.reduce((acc, station) => station.liters, 0)
    document.getElementById("fuel").value = FQ || this.plane.standardFuel
    this.plane.changeFuel(document.getElementById("fuel").value)

    console.log("Plane:: ", this.plane)
  },
  round(num, factor = 100) {
    return Math.round((num + Number.EPSILON) * factor) / factor
  },
  clearPlanes() {
    ;[...document.getElementsByClassName("AirplaneButton")].forEach(
      (button) => {
        button.classList.remove("Selected")
        button.style.background = ""
      }
    )
  },
  update() {
    // -- Change this -- ***
    // move this into setPlane() so that it doesn't auto-clear the fuel when you call an update.
    //

    // Clear airplane container
    const container = document.getElementById("Airplane")
    container.innerHTML = ""
    const node = document.createElement("div")
    //
    // -- Seats --
    //
    const seats = this.plane.getSeats() // [{Station},{Station}]
    let _row
    seats.forEach((seat, index) => {
      if (index % 2 === 0) {
        _row = document.createElement("div") // new row
        _row.classList.add("row")
      }
      const s = new Seat(seat)
      _row.appendChild(s.getNode())
      node.appendChild(_row)
    })
    container.appendChild(node)

    //
    // Show WB Result
    //
    document.getElementById("Out").classList.remove("NotInLimits")
    document.getElementById("Out").classList.remove("InLimits")
    //
    const WB = this.plane.getWeightAndBalance()
    console.log("WB :", WB)
    if (!WB.isBalanced) {
      document.getElementById("Out").classList.add("NotInLimits")
      document.getElementById(
        "Out"
      ).innerHTML = `Not In Limits... Weight: ${WB.round.weight} CG: ${WB.round.CG}`
    } else {
      document.getElementById("Out").classList.add("InLimits")
      document.getElementById(
        "Out"
      ).innerHTML = `<center>Weight: ${WB.round.weight} CG: ${WB.round.CG}</center>`
    }

    //
    // Sliders
    //
    // these could be cleaned up... they're a bit scattered ***
    let fwd
    if (!!WB.balance.limit) {
      fwd = WB.balance.limit.forward
    }
    const aft = this.plane.limits.CG.aft

    console.log("FWD: ", fwd)
    console.log("AFT: ", aft)
    console.log("CG: ", WB.CG)

    const params = {
      mrk: "balance-marker",
      bar: "balance-range",
      bounds: [fwd, aft],
      np: "manual-position",
      value: WB.CG - fwd,
    }
    this.display.updateMarker(params)

    //
    // Populate WAM screen
    //
    document.getElementById("WAM").innerHTML = ""
    document.getElementById("WAM").appendChild(WB.table)
  },
}
root.isiOS = root.iOSCheck()