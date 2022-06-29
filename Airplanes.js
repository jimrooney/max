class Airplanes {
  constructor() {}
  getPlane(reg) {
    // *** Need logic here to not only get the type of plane, but the specific WB data for that rego.
    // for now, we'll just hardcode the rego to type

    let type
    switch (reg) {
      case "PPR":
      case "MMZ":
        type = "C208"
        break
      case "JTK":
        type = "C206"
        break
      case "LOR":
        type = "GA8"
        break
    }

    let plane
    switch (type) {
      case "C206":
        plane = new C206(reg)
        break
      case "C208":
        plane = new C208(reg)
        break
      default:
        plane = new C206(reg)
        break
    }
    return plane
  }
}
