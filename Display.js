class Display {
  constructor() {}
  getRatio = (value, bounds) => (bounds[1] - bounds[0]) / value // Returns the percentage value is of the range

  updateMarker = (parameters) => {
    const defaults = {
      mrk: "balance-marker",
    }
    parameters = { ...defaults, ...parameters }

    const marker = document.getElementById(parameters.mrk)
    marker.style.top = `${this.getMarkerPosition(parameters)}px`
  }

  getMarkerPosition(parameters) {
    const defaults = {
      bar: "balance-range",
      bounds: [0, 100],
      np: "manual-position",
    }
    parameters = { ...defaults, ...parameters }

    const position = parameters.value || document.getElementById("manual-position").value

    // Settings from CSS
    const r = document.querySelector(":root")
    const rs = getComputedStyle(r)
    const markerHeight = parseInt(rs.getPropertyValue("--markerHeight"))

    // Display objects
    const bar = document.getElementById(parameters.bar) // Display Bar
    const displayBar = bar.getBoundingClientRect() // Display Bar Bounding Box

    // Calc
    const ratio = this.getRatio(position, parameters.bounds) // ratio to display
    const mark = this.getRatio(ratio, [displayBar.top, displayBar.bottom]) // marker position

    // Result
    const offset = mark - markerHeight // Correct for marker height

    console.log(
      "Top: %o Right: %o Bottom: %o Left: %o",
      displayBar.top,
      displayBar.right,
      displayBar.bottom,
      displayBar.left
    )
    console.log("MarkerHeight: ", markerHeight)
    console.log("Offset: ", offset)
    console.log("Ratio: ", ratio)
    console.log("Mark: ", mark)
    console.log("Top: ", displayBar.top)

    return offset
  }
}
