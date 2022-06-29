var root = {
    airplanes: new Airplanes(),
    test: function (elementID) {
      this.log(elementID, "HI")
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
    setPlane(plane){
        this.airplanes.loadPlanes()
        this.empty('Container')
        this.plane = this.airplanes.getPlane(plane)
        this.update()
    },
    update(){
        const container = document.getElementById("Container")
        const node = document.createElement("div")
        const WB = this.plane.getWeightAndBalance()
        console.log("WB: ",WB)
        root.log(WB)
        // -- Seats --
        const seats = this.plane.getSeats()
        seats.forEach((seat) => {
          const s = new Seat(seat)
          node.appendChild(s.getNode())
        })
        container.appendChild(node)
      }
  }