import { Gif, SearchResponse } from './../interfaces/gifs.interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from 'src/environments/environment';


const LS_HISTORY_KEY = 'history';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
   }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string)
  {
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) )
    {
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this.tagsHistory.splice(0,10);

    this.saveLocalStorage();

  }

  private loadLocalStorage(): void {
    if( !localStorage.getItem(LS_HISTORY_KEY) ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem(LS_HISTORY_KEY)! );
    this.searchTag(this._tagsHistory[0] || '');
  }

  private saveLocalStorage():void {
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify( this._tagsHistory ));
  }

  searchTag( tag: string ){

    if( tag.length === 0 ) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', environment.ZZ_GIPHY_KEY)
      .set('q', tag)
      .set('limit', 10)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe( (resp) => {
        this.gifList = resp.data;
      })

  }

}
