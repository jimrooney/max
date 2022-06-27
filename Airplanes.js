class Airplanes {
  constructor() {}
  getPlane(obj){
    let plane
      switch (obj.type) {
        case "206":
          plane = new C206(obj)
          break
        case "208":
          plane = new C208(obj)
          break
          default:
            plane = new C206()
            break
      }
      return plane
  }

//   getPlane = (obj = { reg: "test", type: "206" }) => {
//     let plane = data.airplanes.find((plane) => plane.reg == obj.reg)
//     if (!plane) {
//       switch (obj.type) {
//         case "206":
//           plane = new C206(obj)
//           break
//         case "208":
//           plane = new C208(obj)
//           break
//       }
//       data.airplanes.push(plane)
//     }
//     return plane
//   }
}
