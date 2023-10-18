import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FileUploadService } from '../services/file-upload.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;


  //code maze
  public mess!: string;
  public progress!: number;
   public selectedFile!: File;

  @Output() public onFileUploadFinished = new EventEmitter();
  
  constructor(private uploadService: FileUploadService,
    private http: HttpClient) { }


  ngOnInit(): void {
    
  }

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
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event instanceof HttpResponse) {
            const msg = file.name + ": Successful!";
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFiles();
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

  public uploadFile = (event: any)=> {
    
    this.selectedFile = <File>event.target.files[0];
    console.log('selected file:',this.selectedFile)
      
  }

  public SaveFile(){
    const formData = new FormData();
    formData.append('file',this.selectedFile,this.selectedFile.name);
    ///https://localhost:7268/api/File/Upload
    this.http.post(environment.apiURL+'/File/Upload', formData, { reportProgress: true, observe:'events'})
    .subscribe(event =>{
    if(event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100*event.loaded / (event.total ?? 1));
      }
      else if(event.type === HttpEventType.Response)  {
        this.mess ='Upload success.';
        this.onFileUploadFinished.emit(event.body);
      } 
      });
  }
}

