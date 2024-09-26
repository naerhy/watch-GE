import {
  type UtcTimezone,
  utcTimezones,
  type SerializedWatch,
  type WatchType,
  type SerializedAnalogWatch,
  type SerializedDigitalWatch,
  type TimeFormat
} from "../shared";

type FnWithId = (id: number) => void;

export default class WatchesCollectionView {
  private selectTimezone: HTMLSelectElement;
  private selectWatchType: HTMLSelectElement;
  private watchesList: HTMLUListElement;
  private watches: Map<number, HTMLLIElement>;
  private removeBtnFn?: FnWithId;
  private switchModeBtnFn?: FnWithId;
  private increaseBtnFn?: FnWithId;
  private resetBtnFn?: FnWithId;
  private toggleTimeFormatBtnFn?: FnWithId;
  private toggleLightBtnFn?: FnWithId;

  public constructor() {
    const mainElement = document.createElement("main");
    const topBar = document.createElement("div");
    topBar.classList.add("topbar");
    this.selectTimezone = document.createElement("select");
    for (const tz of utcTimezones) {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      opt.selected = tz === "UTC+00:00";
      this.selectTimezone.appendChild(opt);
    }
    this.selectWatchType = document.createElement("select");
    for (const t of ["analog", "digital"]) {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      opt.selected = t === "digital";
      this.selectWatchType.appendChild(opt);
    }
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add a new watch";
    topBar.append(this.selectTimezone, this.selectWatchType, addBtn);
    this.watchesList = document.createElement("ul");
    mainElement.append(topBar, this.watchesList);
    this.watches = new Map();
    document.body.appendChild(mainElement);
  }

  public bindAddBtnEvt(fn: (type: WatchType, utcTimezone: UtcTimezone) => void): void {
    document.querySelector(".topbar > button")?.addEventListener("click", () => {
      fn(this.selectWatchType.value as WatchType, this.selectTimezone.value as UtcTimezone);
    });
  }

  public bindRemoveBtnEvt(fn: FnWithId): void {
    this.removeBtnFn = fn;
  }

  public bindSwitchModeBtnEvt(fn: FnWithId): void {
    this.switchModeBtnFn = fn;
  }

  public bindIncreaseBtnEvt(fn: FnWithId): void {
    this.increaseBtnFn = fn;
  }

  public bindResetBtnEvt(fn: FnWithId): void {
    this.resetBtnFn = fn;
  }

  public bindtoggleTimeFormatBtnEvt(fn: FnWithId): void {
    this.toggleTimeFormatBtnFn = fn;
  }

  public bindtoggleLightBtnEvt(fn: FnWithId): void {
    this.toggleLightBtnFn = fn;
  }

  public addWatch(watch: SerializedWatch): void {
    const watchElement = document.createElement("li");
    watchElement.classList.add(watch.type);
    this.setDragEvents(watchElement, watch.id);
    if (watch.type === "analog") {
      this.createAnalogWatchElement(watchElement, watch);
    } else {
      this.createDigitalWatchElement(watchElement, watch);
    }
    this.watches.set(watch.id, watchElement);
    this.watchesList.appendChild(watchElement);
  }

  public removeWatch(id: number): void {
    const element = this.watches.get(id);
    if (element) {
      this.watchesList.removeChild(element);
      this.watches.delete(id);
    }
  }

  private createAnalogWatchElement(element: HTMLLIElement, watch: SerializedAnalogWatch): void {
    const elements: HTMLElement[] = [];
    const removeBtnElement = this.createWatchButton("remove-btn", () => {
      this.removeBtnFn?.(watch.id);
    });
    for (const i of [0, 1, 2]) {
      const el = document.createElement("div");
      el.classList.add("hand", `h-${i}`);
      elements.push(el);
    }
    element.append(...elements, removeBtnElement);
  }

  private createDigitalWatchElement(element: HTMLLIElement, watch: SerializedDigitalWatch): void {
    const timeText = document.createElement("div");
    timeText.classList.add("time-text");
    timeText.innerHTML = `<span class="hours"></span>:<span class="minutes"></span>:<span class="seconds"></span>`;
    const modeBtn = this.createWatchButton("switch-mode-btn", () => {
      this.switchModeBtnFn?.(watch.id);
    });
    const increaseBtn = this.createWatchButton("increase-btn", () => {
      this.increaseBtnFn?.(watch.id);
    });
    const resetBtn = this.createWatchButton("reset-btn", () => this.resetBtnFn?.(watch.id));
    const toggleTimeFormatBtn = this.createWatchButton("toggle-time-format-btn", () => {
      this.toggleTimeFormatBtnFn?.(watch.id);
    });
    const toggleLightBtn = this.createWatchButton("toggle-light-btn", () => {
      this.toggleLightBtnFn?.(watch.id);
    });
    const removeBtn = this.createWatchButton("remove-btn", () => this.removeBtnFn?.(watch.id));
    element.append(
      timeText,
      modeBtn,
      increaseBtn,
      resetBtn,
      toggleTimeFormatBtn,
      toggleLightBtn,
      removeBtn
    );
  }

  private setDragEvents(element: HTMLElement, id: number): void {
    element.draggable = true;
    element.addEventListener("dragstart", (evt) => {
      if (evt.dataTransfer) {
        evt.dataTransfer.setData("text/plain", id.toString());
        evt.dataTransfer.effectAllowed = "move";
      }
    });
    element.addEventListener("dragover", (evt) => evt.preventDefault());
    element.addEventListener("drop", (evt) => {
      evt.preventDefault();
      const data = evt.dataTransfer?.getData("text/plain");
      if (data && Number(data) !== id) {
        const first = this.watches.get(Number(data));
        const second = this.watches.get(id);
        if (first && second) {
          const children = Array.from(this.watchesList.children);
          const indexes: [number, number] = [children.indexOf(first), children.indexOf(second)];
          [children[indexes[0]], children[indexes[1]]] = [
            children[indexes[1]],
            children[indexes[0]]
          ];
          this.watchesList.innerHTML = "";
          this.watchesList.append(...children);
        }
      }
    });
  }

  private createWatchButton(className: string, evt: () => void): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.classList.add(className);
    btn.addEventListener("click", evt);
    return btn;
  }

  public updateWatches(watches: SerializedWatch[]): void {
    for (const w of watches) {
      const element = this.watches.get(w.id);
      if (element) {
        if (w.type === "digital") {
          this.updateMode(w.mode, element);
          this.toggleTimeFormat(w.timeFormat, element);
          this.toggleLight(w.light, element);
        }
        this.updateTime(w, element);
      }
    }
  }

  private updateTime(watch: SerializedWatch, element: HTMLLIElement): void {
    if (watch.type === "analog") {
      const radians = [
        ((watch.time.hours + watch.time.minutes / 60) / 12) * 360 * (Math.PI / 180),
        ((watch.time.minutes + watch.time.seconds / 60) / 60) * 360 * (Math.PI / 180),
        (watch.time.seconds / 60) * 360 * (Math.PI / 180)
      ];
      const hands = element.querySelectorAll<HTMLElement>(".hand");
      for (const [i, h] of hands.entries()) {
        const matrix = [
          Math.cos(radians[i]),
          Math.sin(radians[i]),
          -Math.sin(radians[i]),
          Math.cos(radians[i]),
          0,
          0
        ];
        h.style.transform = `matrix(${matrix.join(", ")})`;
      }
    } else {
      const hoursElement = element.querySelector<HTMLSpanElement>(".time-text > .hours");
      const minutesElement = element.querySelector<HTMLSpanElement>(".time-text > .minutes");
      const secondsElement = element.querySelector<HTMLSpanElement>(".time-text > .seconds");
      const ampmElement = element.querySelector<HTMLSpanElement>(".time-text > .ampm");
      if (hoursElement && minutesElement && secondsElement) {
        if (watch.timeFormat === 12) {
          const ampm = watch.time.hours >= 12 ? "PM" : "AM";
          const hours = watch.time.hours % 12;
          watch.time.hours = hours ? hours : 12;
          this.updateDigits(
            [hoursElement, minutesElement, secondsElement],
            [hours, watch.time.minutes, watch.time.seconds]
          );
          ampmElement!.innerText = ampm;
        } else {
          this.updateDigits(
            [hoursElement, minutesElement, secondsElement],
            [watch.time.hours, watch.time.minutes, watch.time.seconds]
          );
        }
      }
    }
  }

  private updateDigits(elements: HTMLElement[], nbs: number[]): void {
    for (let i = 0; i < 3; i++) {
      elements[i].innerText = nbs[i].toString().padStart(2, "0");
    }
  }

  private updateMode(mode: number, element: HTMLLIElement): void {
    const className = "blink";
    const hoursElement = element.querySelector(".time-text > .hours");
    const minutesElement = element.querySelector(".time-text > .minutes");
    if (!mode) {
      minutesElement?.classList.remove(className);
    } else if (mode === 1) {
      hoursElement?.classList.add(className);
    } else {
      minutesElement?.classList.add(className);
      hoursElement?.classList.remove(className);
    }
  }

  private toggleTimeFormat(timeFormat: TimeFormat, element: HTMLLIElement): void {
    const ampmElement = element.querySelector(".ampm");
    if (timeFormat === 12 && !ampmElement) {
      const small = document.createElement("small");
      small.classList.add("ampm");
      element.querySelector(".time-text")?.appendChild(small);
    } else if (timeFormat === 24 && ampmElement) {
      element.querySelector(".time-text")?.removeChild(ampmElement);
    } else {
      // no instructions
    }
  }

  private toggleLight(isActivated: boolean, element: HTMLLIElement): void {
    const timeText = element.querySelector<HTMLDivElement>(".time-text");
    if (timeText) {
      if (isActivated) {
        timeText.style.backgroundColor = "#fef08a";
      } else {
        timeText.style.removeProperty("background-color");
      }
    }
  }
}
