const data = {
  test: [
    //Weight	Speed	Wind	Ground Run	TODistance
    { weight: 3350, speed: 50, wind: 0, groundRun: 490, TODistance: 870 },
    { weight: 2800, speed: 46, wind: 0, groundRun: 330, TODistance: 655 },
    { weight: 2300, speed: 42, wind: 0, groundRun: 210, TODistance: 500 },
  ],
  C185: {
    takeoff: [
      {
        weight: 3350,
        speed: 50,
        wind: [0, 10, 20],
        pressureAltitude: [
          { alt: 0, temp: 59, groundRun: [490, 345, 220], TODistance: [870, 660, 465] },
          { alt: 2500, temp: 50, groundRun: [595, 415, 235], TODistance: [1015, 765, 550] },
          { alt: 5000, temp: 41, groundRun: [715, 505, 335], TODistance: [1200, 910, 655] },
          { alt: 7500, temp: 32, groundRun: [860, 625, 420], TODistance: [1485, 1125, 820] },
        ],
      },
      {
        weight: 2800,
        speed: 46,
        wind: [0, 10, 20],
        pressureAltitude: [
          { alt: 0, temp: 59, groundRun: [330, 220, 135], TODistance: [655, 485, 335] },
          { alt: 2500, temp: 50, groundRun: [390, 265, 165], TODistance: [735, 545, 385] },
          { alt: 5000, temp: 41, groundRun: [465, 325, 205], TODistance: [840, 630, 445] },
          { alt: 7500, temp: 32, groundRun: [665, 395, 255], TODistance: [975, 735, 525] },
        ],
      },
      {
        weight: 2300,
        speed: 42,
        wind: [0, 10, 20],
        pressureAltitude: [
          { alt: 0, temp: 59, groundRun: [210, 135, 75], TODistance: [500, 365, 245] },
          { alt: 2500, temp: 50, groundRun: [255, 165, 95], TODistance: [545, 405, 275] },
          { alt: 5000, temp: 41, groundRun: [300, 200, 115], TODistance: [615, 455, 310] },
          { alt: 7500, temp: 32, groundRun: [360, 245, 150], TODistance: [695, 515, 355] },
        ],
      },
    ],
  },
  airplanes: [
    {
      reg: "MMZ",
      regcolor: "#568bd6",
      type: "C208",
      weight: 2426.932368,
      arm: 4.845558,
      moment: 11759.7401835923,
      burnrate: 200,
      standardFuel: 510,
    },
    {
      reg: "PPR",
      regcolor: "#d66956",
      type: "C208",
      weight: 2464.85269,
      arm: 4.876040652,
      moment: 12018.72192,
      burnrate: 200,
      standardFuel: 510,
    },
    {
      reg: "LOR",
      regcolor: "#56d687",
      type: "GA8",
      weight: 1069.9,
      arm: 1.35961,
      moment: 1454.651,
      burnrate: 60,
      standardFuel: 150,
    },
    {
      reg: "JTK",
      regcolor: "#db34eb",
      type: "C206",
      weight: 1079.32304,
      arm: 1.035812,
      moment: 1121.1117323177,
      burnrate: 76,
      standardFuel: 180,
    },
  ],
}
