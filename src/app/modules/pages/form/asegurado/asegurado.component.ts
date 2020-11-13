import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asegurado',
  templateUrl: './asegurado.component.html',
  styleUrls: ['./asegurado.component.scss']
})
export class AseguradoComponent implements OnInit {

  showExtra: boolean = false;

  constructor(private location: Location, private router: Router) { }

  ngOnInit() {
  }

  addExtra(){
    this.showExtra = true;
  }

  removeExtra(){
    this.showExtra = false;
  }

  goTo(){
    this.router.navigate(['form/beneficiario']);
  }

  back(){
    this.location.back();
  }

}
