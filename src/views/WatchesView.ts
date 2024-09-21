import WatchModel from "../models/WatchModel";

export default class WatchesView {
  private mainElement: HTMLElement;
  private addBtn: HTMLButtonElement;
  private currentList: HTMLUListElement;
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

  public setRemoveBtnEvent(evt: (id: number) => void): void {
    this.removeBtnEvent = evt;
  }

  public render(watches: WatchModel[]): void {
    const list = document.createElement("ul");
    for (const w of watches) {
      const li = document.createElement("li");
      li.classList.add("watch");
      const div = document.createElement("div");
      div.innerText = w.getStrTime();
      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "Remove";
      // add remove event
      removeBtn.addEventListener("click", () => {
        this.removeBtnEvent?.(w.getId());
      }, { once: true });
      li.append(div, removeBtn);
      list.appendChild(li);
    }
    this.mainElement.replaceChild(list, this.currentList);
    this.currentList = list;
  } 
}
