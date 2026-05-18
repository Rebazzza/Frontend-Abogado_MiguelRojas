import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Abogado } from '../../model/abogado';
import { AbogadoService } from '../../services/abogado.service';
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
  selector: 'app-abogado',
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
  templateUrl: './abogado.component.html',
  styleUrl: './abogado.component.css',
})

export class AbogadoComponent {
  protected abogados: Abogado[] = [];
   protected $dataSource = signal(new MatTableDataSource<Abogado>());
  //protected dataSource2$ = new Observable<MatTableDataSource<Category>>();
  protected displayedColumns: string[] = ['idAbogado', 'nombre', 'apellido', 'telefono','dni','correo','especialidad'];
  private readonly abogadoService = inject(AbogadoService);
  ngOnInit():void{
    //this.categoryService.findAll().subscribe(data => this.categories = data);
    this.abogadoService.findAll().subscribe(data => {
      this.$dataSource.set(new MatTableDataSource<Abogado>(data));
    });
  }

  applyFilter(e: any){
   console.log(e);
  }
}
