import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'listings';
  payload = {
    'size': '20',
    'query': {
      'bool': {
        'must': [{
          'match': {'type': 'DGME'}},
          { 'match': 
          {'extra_fields.article_url': 'pro-c.me'}
        }]
      }
    }
  };
  options = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };
  programs: Array<any> = [];

  constructor (private http: HttpClient) { }

  ngOnInit() {
    this.getList().subscribe(data => {
      console.log(data);
      if (data) {
        for (let d in data["hits"]["hits"]) {
          this.programs.push(data["hits"].hits[d]);
        }
      }
    });
  }

  getList() {
    return this.http.post('http://staging-es-dgfeedbuilder.pslgroup.com/_search', this.payload, this.options);
  }
}
