/*
{ weight: 3350, speed: 50, wind: 0[0,10,20], groundRun: [f/wind]{490,345,220}, TT50: 870 },
*/
class Row {
    constructor(data) {
        this.data = { ...this.data, ...data }
    }
}