// class Difference {

// }

export class Time {
    // // the number of bars in the logical loop.
    // // this should be a large number to make it seem continous and infinite.
    // static readonly Bars: number = 48;

    // bars are in 1/4 time signature.
    // the following note values are supported:
    //   1) 1/16 (4 notes in a bar)
    //   2) 1/8 (2 notes in a bar)
    //   3) 1/8 triplet (3 notes in a bar)
    // therefore, we use a multiply of 12 for the number of subdivisions in a bar,
    // as it gives us the needed rhythmic precision.
    // the larger the value we use, the shorter the gap between subdivisions,
    // making it more interactive, but more performance consuming.
    static readonly Subdivisions: number = 96;

    // // members
    // private _bar: number = 0;
    // private _subdivision: number = 0;

    // get bar(): number {
    //     return this._bar;
    // }

    // get subdivision(): number {
    //     return this._subdivision;
    // }

    // click() {
    //     this._subdivision = (this._subdivision + 1) % Time.Subdivisions;

    //     if (this._subdivision == 0)
    //     {
    //         this._bar = (this._bar + 1) % Time.Bars;
    //     }
    // }
}
