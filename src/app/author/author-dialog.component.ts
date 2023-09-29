import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorService } from '../services/author.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.scss']
})
export class AuthorDialogComponent implements OnInit{
  authorForm! : FormGroup;
  actionBtn: string = 'Save';
  titleAction: string = "Add";

  constructor(private http: HttpClient, 
              private formBuilder: FormBuilder, 
              private authorService: AuthorService,
              private dialogRef: MatDialogRef<AuthorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editAuthorData : any){}

  ngOnInit(): void {

    this.authorForm = this.formBuilder.group({
      name: ['',Validators.required]
    })

    if(this.editAuthorData){
      this.actionBtn='Update';
      this.titleAction='Update';
      this.authorForm.controls['name'].setValue(this.editAuthorData.name);
    }
   }

   addAuthor(){
    if(!this.editAuthorData){
      if(this.authorForm.valid){ 
        this.authorService.createAuthor(this.authorForm.value).subscribe({
          next:(res)=> {
            alert("author succesfully added !");
            this.authorForm.reset();
            this.dialogRef.close();
          },
          error:(err:any)=>{
  
          }
        })
      }
    }else{
      this.updateAuthor();
    }
   }


   updateAuthor(){
    this.authorService.updateAuthor(this.authorForm.value).subscribe({
      next:(res)=> {
        alert("author succesfully updated !");
        this.authorForm.reset();
        this.dialogRef.close('update');
      },
      error:(err:any)=>{

      }
    })
   }
}


