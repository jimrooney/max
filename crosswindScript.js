function calculateWindComponents(runwayDirection, windSpeed, windDirection) {
  // Convert angles to radians
  const runwayRad = (runwayDirection * Math.PI) / 180
  const windRad = (windDirection * Math.PI) / 180

  // Calculate the headwind and crosswind components
  const headwind = windSpeed * Math.cos(windRad - runwayRad)
  const crosswind = windSpeed * Math.sin(windRad - runwayRad)

  return {
    headwind: headwind.toFixed(2), // Round to 2 decimal places
    crosswind: crosswind.toFixed(2),
  }
}

document.getElementById("calculateButton").addEventListener("click", () => {
  const runwayDirection = parseFloat(
    document.getElementById("runwayDirection").value
  )
  const windSpeed = parseFloat(document.getElementById("windSpeed").value)
  const windDirection = parseFloat(
    document.getElementById("windDirection").value
  )

  const components = calculateWindComponents(
    runwayDirection,
    windSpeed,
    windDirection
  )

  document.getElementById("result").innerHTML = `
        Headwind: ${components.headwind} knots<br>
        Crosswind: ${components.crosswind} knots
    `
})
