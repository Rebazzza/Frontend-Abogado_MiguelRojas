import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
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
export class AbogadoComponent implements OnInit {
  
  private readonly abogadoService = inject(AbogadoService);

  protected displayedColumns: string[] = ['idAbogado', 'nombre', 'apellido', 'telefono', 'dni', 'correo', 'especialidad'];

  protected $dataSource = signal(new MatTableDataSource<Abogado>());

  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  constructor() {
    
    effect(() => {
      const data = this.abogadoService.$listChange();
      
      
      const dataSourceInstance = this.$dataSource();
      dataSourceInstance.data = data;

      dataSourceInstance.paginator = this.paginator() ?? null;
      dataSourceInstance.sort = this.sort() ?? null;
    });
  }

  ngOnInit(): void {
    
    this.abogadoService.findAll().subscribe({
      next: (data) => this.abogadoService.setListChange(data),
      error: (err) => console.error('Error al recuperar abogados:', err)
    });
  }

  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();

    
    if (this.$dataSource().paginator) {
      this.$dataSource().paginator!.firstPage();
    }
  }
}