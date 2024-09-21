import WatchModel from "../models/WatchModel";

export default class WatchesView {
  private mainElement: HTMLElement;
  private addBtn: HTMLButtonElement;
  private currentList: HTMLUListElement;
  private modeBtnEvent?: ((id: number) => void);
  private increaseBtnEvent?: ((id: number) => void);
  private toggleLightBtnEvent?: ((id: number) => void);
  private removeBtnEvent?: ((id: number) => void);

  public constructor() {
    this.mainElement = document.createElement("main");
    this.addBtn = document.createElement("button");
    this.addBtn.textContent = "Add";
    this.currentList = document.createElement("ul");
    this.mainElement.append(this.addBtn, this.currentList);
    document.body.appendChild(this.mainElement);
  }

  public setAddBtnEvent(evt: () => void): void {
    this.addBtn.addEventListener("click", evt);
  }

  public setModeBtnEvent(evt: (id: number) => void): void {
    this.modeBtnEvent = evt;
  }

  public setIncreaseBtnEvent(evt: (id: number) => void): void {
    this.increaseBtnEvent = evt;
  }

  public setToggleLightBtnEvent(evt: (id: number) => void): void {
    this.toggleLightBtnEvent = evt;
  }

  public setRemoveBtnEvent(evt: (id: number) => void): void {
    this.removeBtnEvent = evt;
  }

  public render(watches: WatchModel[]): void {
    const list = document.createElement("ul");
    for (const w of watches) {
      const li = document.createElement("li");
      li.classList.add("watch");
      const div = document.createElement("div");
      div.style.backgroundColor = w.getLight() ? "#FBE106" : "#FFFFFF";
      div.innerText = w.getTimeText();
      const modeBtn = document.createElement("button");
      modeBtn.classList.add("mode-btn");
      modeBtn.textContent = "Mode";
      modeBtn.addEventListener("click", () => {
        this.modeBtnEvent?.(w.getId());
      }, { once: true });
      const increaseBtn = document.createElement("button");
      increaseBtn.classList.add("increase-btn");
      increaseBtn.textContent = "Increase";
      increaseBtn.addEventListener("click", () => {
        this.increaseBtnEvent?.(w.getId());
      }, { once: true });
      const toggleLightBtn = document.createElement("button");
      toggleLightBtn.classList.add("toggle-light-btn");
      toggleLightBtn.textContent = "Light";
      toggleLightBtn.addEventListener("click", () => {
        this.toggleLightBtnEvent?.(w.getId());
      }, { once: true });
      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        this.removeBtnEvent?.(w.getId());
      }, { once: true });
      li.append(div, modeBtn, increaseBtn, toggleLightBtn, removeBtn);
      list.appendChild(li);
    }
    this.mainElement.replaceChild(list, this.currentList);
    this.currentList = list;
  } 
}
