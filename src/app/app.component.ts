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
  specialtyQS = '';
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
  stored_spec = '';
  curr_spec = ''
  programs: Array<any> = [];
  specialties: Array<String>;

  constructor (
    private http: HttpClient
    ) {
        let params = new URLSearchParams(window.location.search);
        if (params.has('SpecialtyID')) {
          this.specialtyQS = params.get('SpecialtyID');
        } else {
          this.specialtyQS = 'Internal Medicine';
        }
        this.prepareCallBody();
     }
  main_programs: Array<any> = [];
  ngOnInit() {
    this.getList().subscribe(data => {
        console.log(location);
        this.results = new RegExp('[\?&]SpecialtyID=([^&#]*)').exec(window.location.href);
        if(this.results){
            this.stored_spec = this.results[1] || 0;
            if (this.stored_spec.length > 1) {
                localStorage.setItem('SpecialtyID', this.stored_spec);
            }
        }
        
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

  prepareCallBody() {
    this.must.push({
      'match': {
        'tags.specialties': this.specialtyQS
      }
    });
  }

  getList() {
    console.log(this.payload);
    return this.http.post('http://staging-es-dgfeedbuilder.pslgroup.com/_search', this.payload, this.options);
  }
}
