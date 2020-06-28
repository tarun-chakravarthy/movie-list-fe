import { Component } from '@angular/core';

//HTTP client is used to connect to the api
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  //Local varaible declarions 
  spinner = false;
  movieList: any = [];
  movieTime: any = [];
  selectedTheater = null;

  //constructor for dependency injection
  constructor(private http: HttpClient) {
    this.spinner = true;

    //calling moivelist API end point  
    this.http.get('http://127.0.0.1:8000/movielist/')
      .subscribe((data) => {
        this.movieList = data
        this.movieList.forEach(movie => {

          //Showing all movies on home screen 
          movie.show = true;
        });
      });

    //calling moivetimes API end point  
    this.http.get('http://127.0.0.1:8000/movietimes/')
      .subscribe((data) => {
        this.movieTime = data
        this.movieTime.forEach(theater => {
          Object.entries(theater.showtimes).forEach(showTime => {
            this.movieList.filter(m => m.id === showTime[0]).map(
              ml => {

                //Showing desired  movies on home screen 
                ml.show = true;

                //added extra variables showTimes for Object ml
                ml.showTimes = showTime[1];
                return ml;
              }
            )
          })
        });
        this.spinner = false;

      });



  }
  title = 'My Movies';
  searchText;


  //On selecting theater showing searched movies 
  onTheaterSelect(event: any, theater: any) {
    this.movieList.forEach(movie => {
      movie.show = false;
    });
    this.selectedTheater = theater;
    let selectedTheaterMovieArray = Object.entries(this.selectedTheater.showtimes);
    selectedTheaterMovieArray.forEach(movie => {
      this.movieList.filter(m => m.id === movie[0]).map(
        ml => {
          ml.show = true;
          ml.showTimes = movie[1];
          return ml;
        }
      )
    });
  }
}