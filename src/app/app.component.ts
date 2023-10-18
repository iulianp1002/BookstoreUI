
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthorDialogComponent } from './author/author-dialog.component';
import { BookService } from './services/book.service';
import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AddBook } from './models/AddBook';
import { AuthorService } from './services/author.service';
import { Author } from './models/author';
import { BookWithAuthors } from './models/BookWithAuthors';
import { environment } from './environments/environment.dev';
import { ɵDomRendererFactory2 } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Bookstore.UI';
  displayedColumns: string[] = ['title', 'description', 'pictureUrl', 'authors','action'];
  dataSource!: MatTableDataSource<BookWithAuthors>;
  showImage: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('smallPicture') imageControl: ElementRef<HTMLImageElement> | undefined;

constructor (private dialog: MatDialog,
             private bookService: BookService,
             private authorService: AuthorService,
             private renderer:Renderer2){

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
      next:(res: BookWithAuthors[] )=>{
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

  editBook(row: any) { console.log('editing row:',row);
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

  createImgPath = (serverPath: string) => { 
    return `${environment.webRootUrl}/Resources/Images/${serverPath}`;
  }

  showPicture =(show: boolean) =>{ console.log('test picture',this.imageControl)
    //this.renderer.setProperty(this.imageControl?.nativeElement,'display',"block");
    this.showImage = show;
    }
}
