import { Component, inject, signal, effect, untracked } from '@angular/core';
import { CasosService } from '../../services/casos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Casos } from '../../model/Caso';
import { switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-casos',
  imports: [],
  templateUrl: './casos.component.html',
  styleUrl: './casos.component.css',
})
export class casoComponent {
  private readonly CasosService = inject(CasosService);
  
  //creador de alertas
  private readonly snackBar = inject(MatSnackBar);

  protected $Casos = signal<Casos[]>([]);

  constructor(){
    this.CasosService.findAll().subscribe(data => this.CasosService.setCasosChange(data));
    effect(() =>{
      const data = this.CasosService.$casosChange();
      this.$Casos.set(data);
    });
    effect(() =>{
      const message = this.CasosService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'top'});
        untracked(() => this.CasosService.setMessageChange(''));
      }
    });
  }
  delete(idExPediente: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.CasosService.delete(idExPediente).pipe(switchMap(() => this.CasosService.findAll()), tap(data => this.CasosService.setCasosChange(data)), tap(() => this.CasosService.setMessageChange('DELETED'))).subscribe();
    }
  }
}
