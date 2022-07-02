// Prototype .clear() onto all DOM elements
HTMLElement.prototype.empty = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild)
  }
}

HTMLElement.prototype.show = function () {
  toggleDiv(this)
}
HTMLElement.prototype.hide = function () {
  toggleDiv(this)
}
// jQuery style DOM selector... cuz it's easier
function $(x) {
  const _this = document.getElementById(x)

  //
  _this.getName = function () {
    console.log("HI")
  }
  //   _this.show = function () {}
  //   _this.hide = function () {}
  return document.getElementById(x)
}

function toggleDiv(ID) {
  let x = ID
  if (typeof ID == "string") {
    x = document.getElementById(ID)
  }
  if (x.style.display === "none") {
    x.style.display = "block"
  } else {
    x.style.display = "none"
  }
}
