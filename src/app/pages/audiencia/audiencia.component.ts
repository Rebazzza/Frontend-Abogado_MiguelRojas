import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Audiencia } from '../../model/audiencia';
import { AudienciaService } from '../../services/audiencia.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-audiencia',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './audiencia.component.html',
  styleUrl: './audiencia.component.css',
})

export class AudienciaComponent {
  protected audiencias: Audiencia[] = [];
   protected $dataSource = signal(new MatTableDataSource<Audiencia>());
  //protected dataSource2$ = new Observable<MatTableDataSource<Category>>();
  protected displayedColumns: string[] = ['idAudiencia', 'nombre', 'apellido', 'telefono','dni','correo','especialidad'];
  private readonly AudienciaService = inject(AudienciaService);
  ngOnInit():void{
    //this.categoryService.findAll().subscribe(data => this.categories = data);
      this.AudienciaService.findAll().subscribe(data => {
      this.$dataSource.set(new MatTableDataSource<Audiencia>(data));
    });
  }

  applyFilter(e: any){
   console.log(e);
  }
}
