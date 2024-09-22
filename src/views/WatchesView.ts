import { UtcTimeZone, utcTimezones, type Watch } from "../shared";

type FnWithId = (id: number) => void;
type Fns = [FnWithId, FnWithId, FnWithId, FnWithId, FnWithId, FnWithId];
type WatchType = "analog" | "digital";

export default class WatchesView {
  private selectTz: HTMLSelectElement;
  private selectWatchType: HTMLSelectElement;
  private addBtn: HTMLButtonElement;
  private watchesList: HTMLUListElement;
  private watchesItems: Map<number, HTMLLIElement>;
  private switchModeBtnFn?: FnWithId;
  private increaseBtnFn?: FnWithId;
  private resetBtnFn?: FnWithId;
  private toggleTimeFormatBtn?: FnWithId;
  private toggleLightBtnFn?: FnWithId;
  private removeBtnFn?: FnWithId;

  public constructor() {
    const mainElement = document.createElement("main");
    const topBar = document.createElement("div");
    topBar.classList.add("topbar");
    this.selectTz = document.createElement("select");
    for (const tz of utcTimezones) {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      opt.selected = tz === "UTC+00:00";
      this.selectTz.appendChild(opt);
    }
    this.selectWatchType = document.createElement("select");
    for (const t of ["analog", "digital"]) {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      opt.selected = t === "digital";
      this.selectWatchType.appendChild(opt);
    }
    this.addBtn = document.createElement("button");
    this.addBtn.type = "button";
    this.addBtn.textContent = "Add a new watch";
    topBar.append(this.selectTz, this.selectWatchType, this.addBtn);
    this.watchesList = document.createElement("ul");
    mainElement.append(topBar, this.watchesList);
    this.watchesItems = new Map();
    document.body.appendChild(mainElement);
  }

  public setEvents(addBtnFn: (type: WatchType, utcTimezone: UtcTimeZone) => void, fns: Fns) {
    this.addBtn.addEventListener("click", () => {
      addBtnFn(this.selectWatchType.value as WatchType, this.selectTz.value as UtcTimeZone);
    });
    this.switchModeBtnFn = fns[0];
    this.increaseBtnFn = fns[1];
    this.resetBtnFn = fns[2];
    this.toggleTimeFormatBtn = fns[3];
    this.toggleLightBtnFn = fns[4];
    this.removeBtnFn = fns[5];
  }

  public addWatch(type: WatchType, watch: Watch): void {
    const item = document.createElement("li");
    item.classList.add(type);
    this.setDragEvents(item, watch.id);
    const children = type === "analog" ? this.addAnalogWatch(watch) : this.addDigitalWatch(watch);
    this.watchesItems.set(watch.id, item);
    this.watchesList.appendChild(item);
    item.append(...children);
  }

  private addAnalogWatch(watch: Watch): HTMLElement[] {
    const children: HTMLElement[] = [];
    children.push(this.createWatchButton("remove-btn", () => this.removeBtnFn?.(watch.id)));
    for (const i of [0, 1, 2]) {
      const el = document.createElement("div");
      el.classList.add("hand", `h-${i}`);
      children.push(el);
    }
    return children;
  }

  private addDigitalWatch(watch: Watch): HTMLElement[] {
    const timeText = document.createElement("div");
    timeText.classList.add("time-text");
    timeText.innerText = watch.time;
    const modeBtn = this.createWatchButton("switch-mode-btn", () => {
      this.switchModeBtnFn?.(watch.id);
    });
    const increaseBtn = this.createWatchButton("increase-btn", () => {
      this.increaseBtnFn?.(watch.id);
    });
    const resetBtn = this.createWatchButton("reset-btn", () => this.resetBtnFn?.(watch.id));
    const toggleTimeFormatBtn = this.createWatchButton("toggle-time-format-btn", () => {
      this.toggleTimeFormatBtn?.(watch.id);
    });
    const toggleLightBtn = this.createWatchButton("toggle-light-btn", () => {
      this.toggleLightBtnFn?.(watch.id);
    });
    const removeBtn = this.createWatchButton("remove-btn", () => this.removeBtnFn?.(watch.id));
    return [
      timeText,
      modeBtn,
      increaseBtn,
      resetBtn,
      toggleTimeFormatBtn,
      toggleLightBtn,
      removeBtn
    ];
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
        const first = this.watchesItems.get(Number(data));
        const second = this.watchesItems.get(id);
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

  private createWatchButton(className: string, evt: () => void) {
    const btn = document.createElement("button");
    btn.classList.add(className);
    btn.addEventListener("click", evt);
    return btn;
  }

  public removeItem(id: number): void {
    const item = this.watchesItems.get(id);
    if (item) {
      this.watchesList.removeChild(item);
      this.watchesItems.delete(id);
    }
  }

  public updateTimeTexts(watches: Watch[]): void {
    for (const w of watches) {
      const item = this.watchesItems.get(w.id);
      if (item) {
        if (item.classList.contains("analog")) {
          const [hours, minutes, seconds] = w.time.split(":").map((t) => Number(t));
          const radians = [
            ((hours + minutes / 60) / 12) * 360 * (Math.PI / 180),
            ((minutes + seconds / 60) / 60) * 360 * (Math.PI / 180),
            (seconds / 60) * 360 * (Math.PI / 180)
          ];
          const hands = item.querySelectorAll<HTMLElement>(".hand");
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
          const timeText = item.querySelector(".time-text");
          if (timeText) {
            timeText.textContent = w.time;
          }
        }
      }
    }
  }

  public updateLight(id: number, isActivated: boolean): void {
    const item = this.watchesItems.get(id);
    if (item) {
      const timeText = item.querySelector<HTMLDivElement>(".time-text");
      if (timeText) {
        if (isActivated) {
          timeText.style.backgroundColor = "#fef08a";
        } else {
          timeText.style.removeProperty("background-color");
        }
      }
    }
  }
}
