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

  verifyToken() {
    this._authServ.checkTokenValidation();
    this.util.tokenNeedsUpdate.subscribe(async (resp) => {
      if (resp == true) {
        this.loginServ.getCredencials().then(() => {
          this.recuperarCuestionario();
        })
          .catch(err => {
            console.error(err)
          });
      } else {
        this.recuperarCuestionario();
      }
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
          desPregunta: [{ value: this.cuestionarioData[i].DescripcionPregunta, disabled: true }],
          flag: [this.cuestionarioData[i].Flag],
          codRespuesta: ['N', [Validators.required]],
          descRespuesta: [null]
        }));
      }
    }
  }

  setCuestionario(values) {
    this.util.respuestaFormObserver.next(true);
    if (this.cuestionarioForm.invalid) {
      this.cuestionarioForm.markAllAsTouched();
      this.util.cuestionarioIsSubmitted.next(false);
    } else {
      console.log(this.util.observacionFormObserver.value);
      console.log(this.util.respuestaFormObserver.value);
      
      if (this.util.observacionFormObserver.value === true && this.util.respuestaFormObserver.value === true) {
        this.util.cuestionarioIsSubmitted.next(true);
        values.preguntas.forEach(function (v) { delete v.flag });
        this.dataGetter.emit(values);
        this.util.hideModal('dpsModal');
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
    //to get smokeQuiz index
    console.log(this.p.controls);

    var sqIndex = Object.keys(this.p.controls).forEach(e => console.log(e));
    // console.log(sqIndex);

    if (ev != undefined) {
      setTimeout(() => {

      });
    } else {
      setTimeout(() => {
        this.cuestionarioForm.controls.observaciones.setValue(null);
      });
    }
  }

  openDps(){
    this.util.showModal('dpsModal');
    this.util.cuestionarioIsSubmitted.next(true);
  }

}
