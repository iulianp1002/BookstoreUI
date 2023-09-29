
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthorDialogComponent } from './author/author-dialog.component';
import { BookService } from './services/book.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AddBook } from './models/AddBook';
import { AuthorService } from './services/author.service';
import { Author } from './models/author';
import { BookWithAuthors } from './models/BookWithAuthors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Bookstore.UI';
  displayedColumns: string[] = ['title', 'description', 'pictureUrl', 'authors','action'];
  dataSource!: MatTableDataSource<BookWithAuthors>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor (private dialog: MatDialog,
             private bookService: BookService,
             private authorService: AuthorService){

}
  ngOnInit(): void {
    this.getAllBooksWithAuthors();
  }
  openDialogBook() {
    this.dialog.open(BookDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllBooksWithAuthors();
      }
    });
  }

  openDialogAuthor() {
    this.dialog.open(AuthorDialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllAuthors();
      }
    });;
  }

  getAllBooksWithAuthors() {
    this.bookService.getBooksWithAuthors().subscribe({
      next:(res: BookWithAuthors[] | undefined)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      
    })
  }

  getAllAuthors(){
    this.authorService.getAuthors().subscribe({
      next:(res: Author[])=>{
        //map dropdown source

      },
      
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editBook(row: any) {
    this.dialog.open(BookDialogComponent, {
      width:'30%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllBooksWithAuthors();
      }
      
    });;
  }

  deleteBook(data:any,id: number){
    this.bookService.deleteBook(id).subscribe({
      next:(res)=>{
        alert('book was deleted!')
        this.getAllBooksWithAuthors();
      }
    })
  }
}
