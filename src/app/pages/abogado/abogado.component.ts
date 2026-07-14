  import { Component,computed, effect, inject, signal, untracked, viewChild, OnInit } from '@angular/core';
  import { Abogado } from '../../model/abogado'; // Asegúrate de que la clase empiece con mayúscula o igual a tu modelo
  import { AbogadoService } from '../../services/abogado.service';
  import { MatTableDataSource, MatTableModule } from '@angular/material/table';
  import { toObservable, toSignal } from '@angular/core/rxjs-interop';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
  import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
  import { RouterOutlet } from '@angular/router';
  import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
  import { switchMap, tap } from 'rxjs';
  import { MatDialog, MatDialogModule } from '@angular/material/dialog';
  import { AbogadoDialogComponent } from './abogado-dialog/abogado-dialog.component';

@Component({
  selector: 'app-abogado',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    RouterOutlet,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './abogado.component.html',
  styleUrl: './abogado.component.css',
})
export class AbogadoComponent implements OnInit { 
  private readonly abogadoService = inject(AbogadoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Abogado>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idAbogado', 'nombre', 'apellido', 'correo', 'telefono', 'especialidad', 'dni', 'estado', 'acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarAbogados();
  }

  private listarAbogados(): void {
    this.abogadoService.findAll().subscribe({
      next: (data) => this.abogadoService.setListChange(data),
      error: (err) => console.error('Error al cargar abogados', err)
    });
  }
  protected $categories = computed(() => this.$response()?.content ?? []);
  protected $totalElements = computed(() => this.$response()?.page?.totalElements ?? 0);
  private initializeEffects(){
    effect(() => {
      const data = this.$categories();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = data;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.abogadoService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.abogadoService.setMessageChange(''));
      }
    });
  }
  protected $pageRequest = signal({page: 0, size: 10});

  //Signal que escucha los cambios en la paginacion y ejecuta la consulta al backend cada vez que haya un cambio en la paginacion
  private readonly $response = toSignal(
    //toObservable tiene effect interno, que desencadena todo lo de abajo cada vez que haya un cambio en $pageRequest
    toObservable(this.$pageRequest).pipe(
      switchMap( ({page, size}) => this.abogadoService.listPageable(page, size) ),
      tap(data => this.abogadoService.setListChange(data.content)),
    )
  );

  //Signals calculados para obtener los datos y el total de elementos de la respuesta
  
  


  
  openDialog(abogado?: Abogado){
    const dialogRef = this.dialog.open(AbogadoDialogComponent, {
      width: '650px',
      data: abogado
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarAbogados();
    });
  }

  delete(idAbogado: number){
    const ok = window.confirm('¿Estás seguro de eliminar este abogado?');
    if(ok){
      this.abogadoService.delete(idAbogado).pipe(
        switchMap(() => this.abogadoService.findAll()),
        tap(data => this.abogadoService.setListChange(data)),
        tap(() => this.abogadoService.setMessageChange('DELETED'))
      ).subscribe({
        error: (err) => {
          console.error('Error al eliminar abogado:', err);
          this.snackBar.open('No se puede eliminar: tiene registros relacionados', 'CERRAR', { duration: 4000, horizontalPosition: 'right', verticalPosition: 'top' });
        }
      });
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
  changePage(e: any){
    this.$pageRequest.set({page: e.pageIndex, size: e.pageSize});
  }
}