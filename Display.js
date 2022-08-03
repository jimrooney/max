class Display {
  constructor() {}
  getRatio = (value, bounds) => (bounds[1] - bounds[0]) / value // Returns the percentage value is of the range

  updateMarker = () => {
    marker.style.top = `${this.getMarkerPosition()}px`
  }

  getMarkerPosition() {
    // *** Change these to passed in values...
    const m = "marker"
    const b = "range"
    const bounds = [0, 100]
    const position = document.getElementById("position").value // ** replace with CG or AUW

    // Settings from CSS
    const r = document.querySelector(":root")
    const rs = getComputedStyle(r)
    const markerHeight = parseInt(rs.getPropertyValue("--markerHeight"))

    // Display objects
    const marker = document.getElementById(m)
    const bar = document.getElementById(b) // Display Bar
    const displayBar = bar.getBoundingClientRect() // Display Bar Bounding Box

    // Calc
    const ratio = display.getRatio(position, bounds) // ratio to display
    const mark = display.getRatio(ratio, [displayBar.top, displayBar.bottom]) // marker position

    // Result
    const offset = displayBar.top + mark - displayBar.top - markerHeight // Correct for marker height

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
