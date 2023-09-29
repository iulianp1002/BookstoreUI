import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Author } from '../models/author';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BookService } from '../services/book.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../services/author.service';
import { FileUploadService } from '../services/file-upload.service';
import { AddBook } from '../models/AddBook';


@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent implements OnInit{
  fileName = '';
  selectedValue ='';
  authors :Author[] =  [];
  bookForm! : FormGroup;
  actionBtn: string = 'Save';
  titleAction: string = "Add";
  author = new FormControl(this.authors);
  selectedAuthors : Author[] = [];
  selectedAuthorIds: number[]= [];

  constructor (private http: HttpClient, 
               private formBuilder: FormBuilder,
               private bookService: BookService,
               private authorService: AuthorService,
               private fileUploadService:FileUploadService,
               private dialogRef: MatDialogRef<BookDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public editBookData : AddBook){}

  onFileSelected(event:any) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.fileUploadService.upload(file);

        upload$.subscribe();
    }
 }

 ngOnInit(): void {

  this.bookForm = this.formBuilder.group({
    title: ['',Validators.required],
    description: ['',Validators.required],
    pictureUrl:['',Validators.required],
    authors:[[],Validators.required]
  })

  this.authorService.getAuthors().subscribe({
    next:(res)=> {
      this.authors = res;
    },
    error:(err:any)=>{
    }
  })

  if(this.editBookData){
    
    this.actionBtn='Update';
    this.titleAction='Update';
    this.bookForm.controls['title']?.setValue(this.editBookData.title);
    this.bookForm.controls['description']?.setValue(this.editBookData.description);
    this.bookForm.controls['pictureUrl']?.setValue(this.editBookData.pictureUrl);
    this.bookForm.controls['authors'].setValue(this.editBookData.autors);
    this.bookForm.controls['Authors']?.setValue(this.editBookData?.AuthorIds);
  }
 }
 getValues(event: {
  isUserInput: any;
  source: { value: any; selected: any;  };
}) {
  if (event.isUserInput) {
    if (event.source.selected === true) {
      this.selectedAuthors.push(event.source.value)
    } else {
      console.log(event.source.value)
    }
  }

  
}
getAuthorIdList(authorList:Author[]):number[]{
  let arrId : number[] = [];
  for (const author of authorList) {
    arrId.push(author.id ?? 0);
  }
  return arrId;
}

getAuthorList(authorids:number[]){
  var data = this.authorService.getAuthors().subscribe({
    next: (res)=>{
      var filteredArray = res.filter(function(itm){
        return authorids.indexOf(itm.id ?? 0) > -1;
      });

      return filteredArray;
    }
  });

}
 addBook(){
  if(!this.editBookData){ 
    if(this.bookForm.valid){
    var bookFormated = new AddBook();
    bookFormated.title = this.bookForm.value.Title;
    bookFormated.description = this.bookForm.value.Description;
    bookFormated.pictureUrl = this.bookForm.value.PictureUrl;
    bookFormated.AuthorIds = this.getAuthorIdList(this.selectedAuthors);
   
      this.bookService.createBook(bookFormated).subscribe({
        next:(res)=> {
          alert("book succesfully added !");
          this.bookForm.reset();
          this.dialogRef.close('save');
        },
        error:(err:any)=>{
            console.log(err);
        }
      })
    }
  }else{
    this.updateBook();
  }
 }

 updateBook(){ 
  this.bookService.updateBook(this.bookForm.value).subscribe({
    next:(res)=> {
      alert("author succesfully updated !");
      this.bookForm.reset();
      this.dialogRef.close('update');
    },
    error:(err:any)=>{
    }
  })
 }

}
