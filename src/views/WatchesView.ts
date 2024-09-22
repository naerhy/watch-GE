import type { Watch } from "../shared";

type FnWithId = (id: number) => void;
type Fns = [FnWithId, FnWithId, FnWithId, FnWithId];

export default class WatchesView {
  private addBtn: HTMLButtonElement;
  private watchesList: HTMLUListElement;
  private watchesItems: Map<number, HTMLLIElement>;
  private modeBtnFn?: FnWithId;
  private increaseBtnFn?: FnWithId;
  private toggleLightBtnFn?: FnWithId;
  private removeBtnFn?: FnWithId;

  public constructor() {
    const mainElement = document.createElement("main");
    this.addBtn = document.createElement("button");
    this.addBtn.textContent = "Add";
    this.watchesList = document.createElement("ul");
    mainElement.append(this.addBtn, this.watchesList);
    this.watchesItems = new Map();
    document.body.appendChild(mainElement);
  }

  public setEvents(addBtnFn: () => void, fns: Fns) {
    this.addBtn.addEventListener("click", addBtnFn);
    this.modeBtnFn = fns[0];
    this.increaseBtnFn = fns[1];
    this.toggleLightBtnFn = fns[2];
    this.removeBtnFn = fns[3];
  }

  public addItem(watch: Watch): void {
    const item = document.createElement("li");
    const timeText = document.createElement("div");
    timeText.classList.add("time-text");
    timeText.innerText = watch.time;
    const modeBtn = document.createElement("button");
    modeBtn.classList.add("mode-btn");
    modeBtn.textContent = "Mode";
    modeBtn.addEventListener("click", () => {
      this.modeBtnFn?.(watch.id);
    });
    const increaseBtn = document.createElement("button");
    increaseBtn.classList.add("increase-btn");
    increaseBtn.textContent = "Increase";
    increaseBtn.addEventListener("click", () => {
      this.increaseBtnFn?.(watch.id);
    });
    const toggleLightBtn = document.createElement("button");
    toggleLightBtn.classList.add("toggle-light-btn");
    toggleLightBtn.textContent = "Light";
    toggleLightBtn.addEventListener("click", () => {
      this.toggleLightBtnFn?.(watch.id);
    });
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      this.removeBtnFn?.(watch.id);
    }, { once: true });
    item.append(timeText, modeBtn, increaseBtn, toggleLightBtn, removeBtn);
    this.watchesItems.set(watch.id, item);
    this.watchesList.appendChild(item);
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
