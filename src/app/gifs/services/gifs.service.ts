import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'QP4jRLYbglw9rQOFnHe4xlwW9FfKTZP0';
  private serviceUrl = 'https://api.giphy.com/v1/gifs';

  private MAX_LENGTH_HISTORY: number = 10;

  constructor( private httpClient: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory (){
    return [...this._tagsHistory];
  }

  private organizeHistory (tag: string): void{
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, this.MAX_LENGTH_HISTORY);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (! localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    if (this._tagsHistory.length > 0){
      this.searchTag(this._tagsHistory[0]);
    }
  }

  searchTag (tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('q', tag)
    .set('limit', '10');

    this.httpClient.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.gifList = resp.data;
      });

    //fetch('https://api.giphy.com/v1/gifs/search?api_key=QP4jRLYbglw9rQOFnHe4xlwW9FfKTZP0&q=caballeros del zodiaco&limit=10')
    //  .then(resp => resp.json())
    //  .then(data => console.log(data));
  }


}
