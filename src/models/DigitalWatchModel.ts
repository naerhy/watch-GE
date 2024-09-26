import {
  type SerializedDigitalWatch,
  type Time,
  type TimeFormat,
  utcOffsets,
  type UtcTimezone,
  Watch
} from "../shared";

export default class DigitalWatchModel extends Watch {
  private mode: number;
  private increasedTime: number;
  private timeFormat: TimeFormat
  private light: boolean;

  public constructor(id: number, time: number, utcTimezone: UtcTimezone) {
    super(id, time, utcTimezone);
    this.mode = 0;
    this.increasedTime = 0;
    this.timeFormat = 24;
    this.light = false;
  }

  protected getTime(): Time {
    const updatedDate = new Date(
      this.time + utcOffsets[this.utcTimezone] * this.MS_MIN + this.increasedTime
    );
    return {
      hours: updatedDate.getUTCHours(),
      minutes: updatedDate.getUTCMinutes(),
      seconds: updatedDate.getUTCSeconds()
    };
  }

  public serialize(): SerializedDigitalWatch {
    return {
      type: "digital",
      id: this.id,
      time: this.getTime(),
      utcTimezone: this.utcTimezone,
      mode: this.mode,
      timeFormat: this.timeFormat,
      light: this.light
    };
  }

  public switchMode(): void {
    this.mode = this.mode === 2 ? 0 : this.mode + 1;
  }

  public increaseTime(): void {
    if (this.mode === 1) {
      this.increasedTime += this.MS_HOUR;
    } else if (this.mode === 2) {
      this.increasedTime += this.MS_MIN;
    } else {
      // no instructions
    }
  }

  public resetTime(): void {
    this.increasedTime = 0;
  }

  public toggleTimeFormat(): void {
    this.timeFormat = this.timeFormat === 12 ? 24 : 12;
  }

  public toggleLight(): void {
    this.light = !this.light;
  }
}
