import {MajorTicksGenerator} from "../major-ticks-generator";
import {Tick} from "../tick";

export class PrimaryMajorDateTicksGenerator extends MajorTicksGenerator<Date> {

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {

    use seconds if you have less than 2 minutes worth (1-120)
    use minutes if you have less than 2 hours worth (2-120)
    use hours if you have less than 2 days worth (2-48)
    use days if you have less than 2 weeks worth (2-14)
    use weeks if you have less than 2 months worth (2-8/9)
    use months if you have less than 2 years worth (2-24)
    otherwise use years

  }
}
