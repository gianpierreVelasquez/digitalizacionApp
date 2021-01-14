import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CombosService } from 'src/app/core/services/combos.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dynamic-direccion',
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.scss']
})
export class DireccionComponent implements OnInit {

  @Input() direccionData: any;

  direccionForm: FormGroup

  maxDireccion = 3;

  departamentoList: any = [];
  provinciaList: any = [];
  distritoList: any = [];

  depaIsLoading: boolean = false;
  provIsLoading: boolean = false;
  distIsLoading: boolean = false;

  validations = {
    'codDepartamento': [
      { type: 'required', message: 'El departamento es requerido.' },
    ],
    'codProvincia': [
      { type: 'required', message: 'La provincia es requerida.' },
    ],
    'codDistrito': [
      { type: 'required', message: 'El distrito es requerido.' },
    ],
    'nomDomicilio': [
      { type: 'required', message: 'El domicilio es requerido.' },
    ]
  };

  constructor(private formBuilder: FormBuilder, private util: UtilService, private combosServ: CombosService, private config: NgSelectConfig) {

    this.direccionForm = this.formBuilder.group({
      direccion: new FormArray([])
    });

    this.config.notFoundText = 'No se encontraron registros';
  }

  ngOnInit() {
    this.addDireccion();
    this.obtenerDepartamento();

    this.util.direccionFormChecker.subscribe(resp => {
      this.setDireccion(this.direccionForm.value)
    })
  }

  get d() { return this.direccionForm.controls; }
  get u() { return this.d.direccion as FormArray; }

  addDireccion() {
    if (this.u.length < this.maxDireccion) {
      this.u.push(this.formBuilder.group({
        codPais: ['PE', [Validators.required]],
        codDepartamento: [null, [Validators.required]],
        codProvincia: [{value: null, disabled:true}, [Validators.required]],
        codDistrito: [{value: null, disabled:true}, [Validators.required]],
        nomDomicilio: ['', [Validators.required]],
        refDireccion: ['']
      }));
    }

    this.displayDireccion();
  }

  async obtenerDepartamento() {

    this.depaIsLoading = true;

    await this.combosServ.obtenerDepartamento()
      .then(resp => {
        var arr = resp.data;
        this.departamentoList = arr;
        this.depaIsLoading = false;
      }).catch(err => {
        console.log(err);
        this.depaIsLoading = false;
      })
  }

  async obtenerProvincia(ev: any, i) {
    var codDepartamento = ev.codigo;

    this.provIsLoading = true;

    this.u.controls[i]['controls'].codProvincia.setValue(null);
    this.u.controls[i]['controls'].codProvincia.disable();

    this.u.controls[i]['controls'].codDistrito.setValue(null);
    this.u.controls[i]['controls'].codDistrito.disable();

    await this.combosServ.obtenerProvincia(codDepartamento)
      .then(resp => {
        this.provinciaList = resp.data;
        this.provIsLoading = false;
        this.u.controls[i]['controls'].codProvincia.enable();
      }).catch(err => {
        console.log(err);
        this.provIsLoading = false;
      })
  }

  async obtenerDistrito(ev: any, i) {
    var codProvincia = ev.codigo;

    this.distIsLoading = true;

    this.u.controls[i]['controls'].codDistrito.setValue(null);
    this.u.controls[i]['controls'].codDistrito.disable();

    await this.combosServ.obtenerDistrito(codProvincia)
      .then(resp => {
        this.distritoList = resp.data;
        this.distIsLoading = false;
        this.u.controls[i]['controls'].codDistrito.enable();
      }).catch(err => {
        console.log(err);
        this.distIsLoading = false;
      })
  }

  setDireccion(values){
    if (this.direccionForm.invalid) {
      this.direccionForm.markAllAsTouched();
    } else {
      console.log(values);
    }
  }

  displayDireccion(){
    this.u.controls[0]['controls'].codDepartamento.setValue(this.direccionData[0].codDepartamento.toString());
    this.obtenerProvincia({codigo:this.direccionData[0].codDepartamento.toString()},0);
    this.u.controls[0]['controls'].codProvincia.setValue(this.direccionData[0].codProvincia.toString());
    this.obtenerDistrito({codigo:this.direccionData[0].codProvincia.toString()},0);
    this.u.controls[0]['controls'].codDistrito.setValue(this.direccionData[0].codDistrito.toString());
    this.u.controls[0]['controls'].nomDomicilio.setValue(this.direccionData[0].nomDomicilio);
  }

}


