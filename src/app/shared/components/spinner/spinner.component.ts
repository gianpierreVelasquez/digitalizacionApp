import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input() bdColor: string;
  @Input() size: string;
  @Input() color: string;
  @Input() type: string;
  @Input() spinnerText: string;

  constructor() {
    this.bdColor = "rgba(51,51,51,0.8)";
    this.size = "medium";
    this.color = "#fff";
    this.type = "ball-spin";
    this.spinnerText = '';
  }

  ngOnInit() {
  }

}
