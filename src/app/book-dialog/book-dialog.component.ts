import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Author } from '../models/author';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BookService } from '../services/book.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../services/author.service';
import { FileUploadService } from '../services/file-upload.service';
import { AddBook } from '../models/AddBook';
import { Observable } from 'rxjs';


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
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];
  selectedVal:any;
  
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  
  constructor (private http: HttpClient, 
               private formBuilder: FormBuilder,
               private bookService: BookService,
               private authorService: AuthorService,
               private fileUploadService:FileUploadService,
               private dialogRef: MatDialogRef<BookDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public editBookData : AddBook){}

               selectFiles(event: any): void {
                this.message = [];
                this.progressInfos = [];
                this.selectedFileNames = [];
                this.selectedFiles = event.target.files;
            
                this.previews = [];
                if (this.selectedFiles && this.selectedFiles[0]) {
                  const numberOfFiles = this.selectedFiles.length;
                  for (let i = 0; i < numberOfFiles; i++) {
                    const reader = new FileReader();
            
                    reader.onload = (e: any) => {
                      console.log(e.target.result);
                      this.previews.push(e.target.result);
                    };
            
                    reader.readAsDataURL(this.selectedFiles[i]);
            
                    this.selectedFileNames.push(this.selectedFiles[i].name);
                  }
                }
              }
            
              upload(idx: number, file: File): void {
                this.progressInfos[idx] = { value: 0, fileName: file.name };
            
                if (file) {
                  this.fileUploadService.upload(file).subscribe(
                    (event: any) => {
                      if (event.type === HttpEventType.UploadProgress) {
                        this.progressInfos[idx].value = Math.round(
                          (100 * event.loaded) / event.total
                        );
                      } else if (event instanceof HttpResponse) {
                        const msg = file.name + ": Successful!";
                        this.message.push(msg);
                        this.imageInfos = this.fileUploadService.getFiles();
                      }
                    },
                    (err: any) => {
                      this.progressInfos[idx].value = 0;
                      let msg = file.name + ": Failed!";
            
                      if (err.error && err.error.message) {
                        msg += " " + err.error.message;
                      }
            
                      this.message.push(msg);
                    }
                  );
                }
              }

              uploadFiles(): void {
                this.message = [];
            
                if (this.selectedFiles) {
                  for (let i = 0; i < this.selectedFiles.length; i++) {
                    this.upload(i, this.selectedFiles[i]);
                  }
                }
              }

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
    
    this.getAuthorIndexed(this.editBookData.authors);
    this.selectedVal = this.selectedAuthorIds;
    this.actionBtn='Update';
    this.titleAction='Update';
    this.bookForm.controls['title']?.setValue(this.editBookData.title);
    this.bookForm.controls['description']?.setValue(this.editBookData.description);
    this.bookForm.controls['pictureUrl']?.setValue(this.editBookData.pictureUrl);
    this.bookForm.controls['authors'].setValue(this.editBookData.authors);
    this.bookForm.controls['Authors']?.setValue(this.editBookData?.AuthorIds);
  }
 }


 getValues(event: {
  isUserInput: any;
  source: { value: any; selected: any;  };}) 
  {

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
  
  for ( var i = 0; i < authorList.length; i++ ) {
      
      arrId.push(parseInt((authorList[i]).toString()));
    
  } 
  
  return arrId;
}

getAuthorIndexed(selectedAuthors: string): void{
  let arrId : number[] = [];
  let splitted = selectedAuthors.split(',');

  var data = this.authorService.getAuthors().subscribe({
    next: (res)=>{

      splitted.forEach((x, i) =>{
  
        for ( var i = 0; i < res.length; i++ ) {
        
          if (res[i].name === x.trimStart().trimEnd()){
            
              arrId.push(parseInt((res[i].id ?? 0).toString()));
          
          }
        } 
      });
      this.selectedVal = arrId;
      this.selectedAuthorIds = arrId;
    }
  })
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
  
  var updateModel = new AddBook();
      updateModel.title = this.bookForm.value.title;
      updateModel.description = this.bookForm.value.description;
      updateModel.pictureUrl = this.bookForm.value.pictureUrl;
      updateModel.AuthorIds = this.getAuthorIdList(this.selectedAuthors);
      updateModel.id = this.editBookData.id;

  this.bookService.updateBook(updateModel).subscribe({
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
