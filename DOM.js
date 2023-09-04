// Prototype .clear() onto all DOM elements
// Removes all children of a node
HTMLElement.prototype.empty = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild)
  }
}
// jQuery style DOM selector... cuz it's easier
// Defaults to ID
// But with a . syntax it will get the class
// Not sure this will work well with multiple selectors.
function $(x) {
  let ret
  const type = x.slice(0,1)
  switch (type){
    case ".":
    ret = Array.from(document.getElementsByClassName(x.slice(1,x.length)))
    break
    default :
    ret = document.getElementById(x)
    break
  }
  return ret
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
