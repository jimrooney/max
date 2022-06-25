class Seat {
  constructor(data) {
    this.data = data
  }
  getNode() {
    const newDiv = document.createElement("div")
    newDiv.className = "Pax"

    //newDiv.addEventListener("click",this.click()) --- doesn't work... needs to be wrapped ()=>
    newDiv.addEventListener("click", () => this.click())

    const newContent = document.createTextNode("I am a seat")
    newDiv.appendChild(newContent)
    return newDiv
  }
  click() {
    console.log("Seat")
    console.log(this)
  }
}
