import { Author } from "./author";

export class Book {
    BookId? : number;
    Title: string= '';
    Description: string = '';
    PictureUrl: string = '';
    Authors: string = '';
    AuthorList: Author[] = [];
}