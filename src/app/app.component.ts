import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'listings';
  specialty = 'SpecialtyID';
  must: Array<Object> = [{
    'match': {
      'type': 'DGME'
    }
  }, {
    'match': {
      'extra_fields.article_url': 'pro-c.me'
    }
  }, {
    'match': {
      'tags.specialties': 'Cardiology'
    }
  }, {
    'range': {
      'extra_fields.expiration_date': {
        'gte': (new Date().getTime() / 1000).toString()
      }
    }
  }];

  // {
  //   'range': {
  //     'extra_fields.expiration_date': {
  //       'gte': (new Date().getTime()).toString()
  //     }
  //   }
  // }

  payload = {
    'size': '20',
    'query': {
      'bool': {
        'must': this.must
      }
    }
  };
  options = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };
  curr_url = '';
  programs: Array<any> = [];
  specialties: Array<String>;

  constructor (
    private http: HttpClient,
    private _route: ActivatedRoute
    ) {
      this._route.queryParams.subscribe(params => {
        this.specialty = params['ScpecialtyID'];
      });
     }
  main_programs: Array<any> = [];

  ngOnInit() {
    this.getList().subscribe(data => {
        console.log(location);
        this.curr_url = location.protocol + '//' + location.host;
      if (data) {
        for (let d in data["hits"]["hits"]) {
          if (d == 0 ) {
            this.main_programs.push(data["hits"].hits[d]);
          } else {
            this.programs.push(data["hits"].hits[d]);
          }
        }
          this.specialties =  ['Oncology','Cardiology','Internal Medicine','Neurology','Paediatrics'];
      }
    });
  }

  getList() {
    return this.http.post('http://staging-es-dgfeedbuilder.pslgroup.com/_search', this.payload, this.options);
  }
}
