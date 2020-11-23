import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { UiModalService } from './ui-modal.service';

@Component({
  selector: 'app-ui-modal',
  templateUrl: './ui-modal.component.html',
  styleUrls: ['./ui-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UiModalComponent implements OnInit, OnDestroy {
  @Input() dialogClass: string;
  @Input() hideHeader = false;
  @Input() hideFooter = false;
  @Input() containerClick = true;
  @Input() modalID: string;
  private element: any;
  
  @Input() btnActionText: string;
  @Output() btnAction: EventEmitter<string> = new EventEmitter<string>();

  public visible = false;
  public visibleAnimate = false;

  constructor(private util: UtilService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    if (!this.modalID) {
        console.error('El modal debe tener un ID');
        return;
    }
    document.body.appendChild(this.element);
    this.util.agregarComp(this);
  }

  ngOnDestroy() {
    this.util.quitarComp(this.modalID);
    this.element.remove();
  }

  action( $event?:any ){
    this.btnAction.emit($event);
  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    document.querySelector('body').classList.add('modal-open');
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
    document.querySelector('body').classList.remove('modal-open');
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal') && this.containerClick === true) {
      this.hide();
    }
  }

}
