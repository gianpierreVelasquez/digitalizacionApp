import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiModalService {

  private modals: any[] = [];

  constructor() { }

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(modalID: string) {
    this.modals = this.modals.filter(x => x.modalID !== modalID);
  }

  open(modalID: string) {
    const modal = this.modals.find(x => x.modalID == modalID);
    modal.show();
  }

  close(modalID: string) {
    const modal = this.modals.find(x => x.modalID == modalID);
    modal.hide();
  }

}
