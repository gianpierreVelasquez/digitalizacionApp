import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { DigitalService } from 'src/app/core/services/digital.service';
import { LoginService } from 'src/app/core/services/login.service';
import { SessionService } from 'src/app/core/services/session.service';
import { SPINNER_TEXT, UtilService } from 'src/app/core/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dynamic-pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.scss']
})
export class PreguntaComponent implements OnInit {

  @Input() aseguradoIndex: number;
  @Output() dataGetter = new EventEmitter<any>();

  dpsValidator: boolean = false;

  cuestionarioForm: FormGroup;
  cuestionarioData: any[] = [];

  showExtraDesc: boolean = false;
  cuestionarioIsSubmitted: boolean = false;
  observacionFormObserverHelper: boolean = false;
  needObservation: boolean = false;

  constructor(private formBuilder: FormBuilder, private util: UtilService, private session: SessionService, private digitalServ: DigitalService,
    private loginServ: LoginService, private _authServ: AuthenticationService) {
    this.cuestionarioForm = this.formBuilder.group({
      preguntas: new FormArray([]),
      observaciones: []
    });
  }

  ngOnInit() {

    this.util.dpsChecker.subscribe(resp => {
      this.dpsValidator = resp;
      if (resp == true) {
        this.recuperarCuestionario();
      }
    })

    this.util.observacionFormObserver.subscribe(resp => {
      this.observacionFormObserverHelper = resp;
    })

  }

  async recuperarCuestionario() {
    this.util.showSpinner()
    this.util.setSpinnerTextValue(SPINNER_TEXT.QUIZ);
    this.digitalServ.recuperarCuestionario(this.session.getSession(environment.KEYS.PARAMS).solicitud.codCanal)
      .then(resp => {
        var data = resp['Resultado'];
        this.cuestionarioData = data;
        this.addPreguntas();
        this.util.hideSpinner();
      }).catch(err => {
        console.log(err);
        this.util.hideSpinner();
      })
  }

  get c() { return this.cuestionarioForm.controls; }
  get p() { return this.c.preguntas as FormArray; }

  addPreguntas() {
    if (this.p.length < this.cuestionarioData.length) {
      for (let i = this.p.length; i < this.cuestionarioData.length; i++) {
        this.p.push(this.formBuilder.group({
          codPregunta: [parseInt(this.cuestionarioData[i].CodigoPregunta), [Validators.required]],
          desPregunta: [{value: this.cuestionarioData[i].DescripcionPregunta, disabled: true}],
          flag: [this.cuestionarioData[i].Flag],
          codRespuesta: ['N', [Validators.required]],
          descRespuesta: [null],
          //isSmokeQuiz: []
        }));
      }
    }
  }

  setCuestionario(values) {
    if (this.cuestionarioForm.invalid) {
      this.cuestionarioForm.markAllAsTouched();
      this.util.cuestionarioIsSubmitted.next(false);
    } else {
      if (this.util.observacionFormObserver.value === true && this.util.respuestaFormObserver.value === true) {
        this.util.cuestionarioIsSubmitted.next(true);
        values.preguntas.forEach(function (v) { delete v.flag });
        this.dataGetter.emit(values);
        this.util.hideModal('dpsModal_' + this.aseguradoIndex);
      } else {
        this.util.observacionFormChecker.next(true);
        this.util.respuestaFormChecker.next(true);
      }
    }
  }

  validateQuizIfPositive(ev: any, values) {
    var responses: any[] = values.preguntas;

    var checker = responses.some(e => e.codRespuesta == 'S');
    if (checker == true) {
      this.needObservation = true;
    } else {
      this.needObservation = false;
    }

    // var fq = responses.findIndex(e => e.desPregunta.includes('cigarros'));
    // console.log(this.p.controls[fq]);
    // if(this.p.controls[fq]['controls'].codRespuesta == 'S'){
    //   this.p.controls[fq]['controls'].isSmokeQuiz.setValue('S');
    // }
    
  }

  getObservacionData(ev: any) {
    if (ev != undefined) {
      setTimeout(() => {
        this.cuestionarioForm.controls.observaciones.setValue(ev);
      });
    } else {
      setTimeout(() => {
        this.cuestionarioForm.controls.observaciones.setValue(null);
      });
    }
  }

  getRespuestaData(ev: any) {
    if (ev != undefined) {
      setTimeout(() => {
        this.p.controls[ev.qIndex]['controls'].descRespuesta.setValue(ev.value)
      });
    } else {
      setTimeout(() => {
        this.p.controls[ev.qIndex]['controls'].descRespuesta.setValue(null)
      });
    }
  }

  openDps(i) {
    this.util.showModal('dpsModal_' + i);
    this.util.cuestionarioIsSubmitted.next(true);
  }

}
