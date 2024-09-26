import { SerializedAnalogWatch, type Time, utcOffsets, type UtcTimezone, Watch } from "../shared";

export default class AnalogWatchModel extends Watch {
  public constructor(id: number, time: number, utcTimezone: UtcTimezone) {
    super(id, time, utcTimezone);
  }

  protected getTime(): Time {
    const updatedDate = new Date(this.time + utcOffsets[this.utcTimezone] * this.MS_MIN);
    return {
      hours: updatedDate.getUTCHours(),
      minutes: updatedDate.getUTCMinutes(),
      seconds: updatedDate.getUTCSeconds()
    };
  }

  public serialize(): SerializedAnalogWatch {
    return { type: "analog", id: this.id, time: this.getTime(), utcTimezone: this.utcTimezone };
  }
}
