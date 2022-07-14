var root = {
  showWam: true,
  airplanes: new Airplanes(),
  data: data, // deefault plane data
  //
  // Load external data
  //
  loadSettings(url = "http://localhost:5500/settings.json"){
    // [ Error handling and sanitization here ] ***
    url = $("SettingsURL").value || url
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
    console.log("show buttons")
    $("Airplanes").empty()
    root.data.airplanes.forEach((plane) => {
      const button = document.createElement("button")
      button.onclick = () => root.setPlane(plane.reg)
      button.classList.add(plane.reg)
      button.classList.add("UI")
      button.innerHTML = plane.reg
      $("Airplanes").appendChild(button)
    })
  },
  test: function () {
    console.log("SW V: ", SW_Version)
    return
    // if (window.indexedDB || self.IndexedDB){
    //   $("Log").innerHTML = `Supported ${window.indexedDB} ${self.IndexedDB}`
    //   return
    // }

    // if (!('indexedDB' in window)) {
    //   $("Log").innerHTML = 'IndexedDB is not supported'
    //   return
    // }

    //console.log("Class: ", $(".flex-container"))
    const idb = window.indexedDB
    var dbPromise = idb.open("test-db2", 1, function (upgradeDb) {
      console.log("making a new object store")
      if (!upgradeDb.objectStoreNames.contains("firstOS")) {
        upgradeDb.createObjectStore("firstOS")
      }
    })

    $("Log").innerHTML = "Done"

    //check for support
    // if (!("indexedDB" in window)) {
    //   console.log("This browser doesn't support IndexedDB")
    //   return
    // }

    if ("indexedDB" in window) {
      $("Log").innerHTML = "IndexedDB is supported"
    } else {
      $("Log").innerHTML = "IndexedDB is not supported"
      return
    }
    let openRequest = indexedDB.open("store", 1)

    openRequest.onupgradeneeded = function () {
      // triggers if the client had no database
      // ...perform initialization...
    }

    openRequest.onerror = function () {
      console.error("Error", openRequest.error)
    }

    openRequest.onsuccess = function () {
      let db = openRequest.result
      // continue working with database using db object
    }
  },

  IOSCheck() {
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      return /iphone|ipad|ipod/.test(userAgent)
    }
    // Detects if device is in standalone mode
    const isInStandaloneMode = () =>
      "standalone" in window.navigator && window.navigator.standalone

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      $("Log").innerHTML = "iOS True, not installed"
    }
    if (isIos() && isInStandaloneMode) {
      $("Log").innerHTML = "iOS True, Installed"
    }
  },
  log: function (text) {
    //!elementID? elementID = "Log" : null
    elementID = "Log"
    $(elementID).innerHTML = text
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
  setPlane(plane) {
    console.log("SetPlane")
    this.airplanes.loadPlanes()
    this.empty("Airplane")
    this.plane = this.airplanes.getPlane(plane)
    this.update()
  },
  update() {
    console.log("root.update()")
    // Color Bar
    document.getElementById("Log").style.background = this.plane.regcolor

    // Fuel
    $("Fuel").innerHTML = "" // Clear fuel selector
    $("Fuel").appendChild(this.plane.fuelSelector)
    const F = this.plane.stations.filter((station) =>
      station.type.includes("fuel")
    )
    const FQ = F.reduce((acc, station) => station.liters, 0)
    $("fuel").value = FQ || 0

    // Clear airplane container
    const container = $("Airplane")
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
    $("Out").classList.remove("NotInLimits")
    $("Out").classList.remove("InLimits")
    //
    const WB = this.plane.getWeightAndBalance()
    console.log("WB :", WB)
    if (!WB.isBalanced) {
      $("Out").classList.add("NotInLimits")
      $(
        "Out"
      ).innerHTML = `Not In Limits... Weight: ${WB.round.weight} CG: ${WB.round.CG}`
    } else {
      $("Out").classList.add("InLimits")
      $("Out").innerHTML = `<center>Weight: ${WB.round.weight} CG: ${WB.round.CG}</center>`
    }
    //
    // Populate WAM screen
    //
    $("WAM").innerHTML = ""
    $("WAM").appendChild(WB.table)
  },
}
