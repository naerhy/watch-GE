import { UtcTimeZone, utcTimezones, type Watch } from "../shared";

type FnWithId = (id: number) => void;
type Fns = [FnWithId, FnWithId, FnWithId, FnWithId, FnWithId, FnWithId];

export default class WatchesView {
  private selectTz: HTMLSelectElement;
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
    const addDiv = document.createElement("div");
    this.selectTz = document.createElement("select");
    for (const tz of utcTimezones) {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      opt.selected = tz === "UTC+00:00";
      this.selectTz.appendChild(opt);
    }
    this.addBtn = document.createElement("button");
    this.addBtn.type = "button";
    this.addBtn.textContent = "Add";
    addDiv.append(this.selectTz, this.addBtn);
    this.watchesList = document.createElement("ul");
    mainElement.append(addDiv, this.watchesList);
    this.watchesItems = new Map();
    document.body.appendChild(mainElement);
  }

  public setEvents(addBtnFn: (utcTimezone: UtcTimeZone) => void, fns: Fns) {
    this.addBtn.addEventListener("click", () => {
      addBtnFn(this.selectTz.value as UtcTimeZone);
    });
    this.switchModeBtnFn = fns[0];
    this.increaseBtnFn = fns[1];
    this.resetBtnFn = fns[2];
    this.toggleTimeFormatBtn = fns[3];
    this.toggleLightBtnFn = fns[4];
    this.removeBtnFn = fns[5];
  }

  public addItem(watch: Watch): void {
    const item = document.createElement("li");
    this.setDragEvents(item, watch.id);
    const timeText = document.createElement("div");
    timeText.classList.add("time-text");
    timeText.innerText = watch.time;
    const modeBtn = this.createButton("switch-mode-btn", "Mode", () => {
      this.switchModeBtnFn?.(watch.id);
    });
    const increaseBtn = this.createButton("increase-btn", "Increase", () => {
      this.increaseBtnFn?.(watch.id);
    });
    const resetBtn = this.createButton("reset-btn", "Reset", () => this.resetBtnFn?.(watch.id));
    const toggleTimeFormatBtn = this.createButton("toggle-time-format-btn", "AM/PM - 24H", () => {
      this.toggleTimeFormatBtn?.(watch.id);
    });
    const toggleLightBtn = this.createButton("toggle-light-btn", "Light", () => {
      this.toggleLightBtnFn?.(watch.id);
    });
    const removeBtn = this.createButton("remove-btn", "Remove", () => this.removeBtnFn?.(watch.id));
    item.append(
      timeText,
      modeBtn,
      increaseBtn,
      resetBtn,
      toggleTimeFormatBtn,
      toggleLightBtn,
      removeBtn
    );
    this.watchesItems.set(watch.id, item);
    this.watchesList.appendChild(item);
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
          [children[indexes[0]], children[indexes[1]]] = [children[indexes[1]], children[indexes[0]]];
          this.watchesList.innerHTML = "";
          this.watchesList.append(...children);
        }
      }
    });
  }

  private createButton(className: string, text: string, evt: () => void) {
    const btn = document.createElement("button");
    btn.classList.add(className);
    btn.textContent = text;
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
        const timeText = item.querySelector(".time-text");
        if (timeText) {
          timeText.textContent = w.time;
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
          timeText.style.backgroundColor = "#fbe106";
        } else {
          timeText.style.removeProperty("background-color");
        }
      }
    }
  }
}
