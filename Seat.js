class Seat {
  constructor(data) {
    this.data = data
    this.weightClass = 0
  }
  getNode() {
    const newDiv = document.createElement("div")
    this.node = newDiv
    newDiv._script = this
    newDiv.className = "Pax"

    //newDiv.addEventListener("click",this.click()) --- doesn't work... needs to be wrapped ()=>
    newDiv.addEventListener("click", () => this.click())

    // const newContent = document.createTextNode("Seat")
    // newDiv.appendChild(newContent)
    return newDiv
  }
  click() {
    this.changeClass()
  }
  changeClass() {
    this.node.className = ""
    this.weightClass++
    if (this.weightClass == 4) {
      this.weightClass = 0
    }
    switch (this.weightClass){
        case 1: 
        this.node.classList.add("Adult")
        break
        case 2: 
        this.node.classList.add("Child")
        break
        case 3: 
        this.node.classList.add("AdultInfant")
        break
        default: 
        // Empty Seat
        break
          }
    this.node.classList.add("Pax")
  }
}
