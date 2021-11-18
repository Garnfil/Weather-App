
class Weather extends React.Component {
  
  state = {
    slideUp: '',
    inputValue: ''
  }
  
  onTouch = (e) => {
    let touch = parseInt(e.touches[0].clientY);
    this.setState({
      slideUp: touch
    })
    if (touch < 0) {
      this.setState({
        slideUp: '0'
      })
    } else if(touch > 650) {
      this.setState({
        slideUp: '95%'
      })
    }
  }
  
  onChangeValue = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }
  
  render() {
    const {cloud, wind_kph, humidity} = this.props.weathers.current;
    
    return(
      
      <div className='weather-content' style={{top: this.state.slideUp}} onTouchMove={this.onTouch}>
        <div className='slide-up'></div>
        <div className='location'>
          <div className='search-div'>
            <input value={this.state.inputValue} onChange={this.onChangeValue} className='search' placeholder='Search...' />
            <button onClick={this.props.onSearchPlace.bind(this, this.state.inputValue)}><i class="fas fa-search"></i></button>
          </div>
          <div class="places">
           	<div className='place active' onClick={this.props.onChangePlace.bind(this, 'Greece')}>Greece</div>
        		<div className='place' onClick={this.props.onChangePlace.bind(this, 'Philippines')}>Philippines</div>
        		<div className='place' onClick={this.props.onChangePlace.bind(this, 'Singapore')}>Singapore</div>
          	<div className='place' onClick={this.props.onChangePlace.bind(this, 'Australia')}>Australia</div>
          	<div className='place' onClick={this.props.onChangePlace.bind(this, 'London')}>London</div>
         	</div>
        </div>
        <div className='weather-details'>
          <div class="detail">
          	<h2>Condition</h2>
          	<h3>{cloud}</h3>
          </div> 
          <div class="detail">
            <h2>Humidity</h2> 
            <h3>{humidity}</h3> 
          </div>
          <div class="detail">
            <h2>Wind</h2> 
            <h3>{wind_kph} K/H</h3> 
          </div>
        </div>
      </div>
    )
  }
}

class WeatherHead extends React.Component {
  render() {
    return(
      <div className='weather-head'>
        <h1>{this.props.weather.current.temp_c}°</h1> 
        <div className="place-name">
          <h2>{this.props.weather.location.name}</h2> 
          <h6>{this.props.weather.location.localtime}</h6> 
        </div>
      </div>
    )
  }
}





class App extends React.Component {
  
  state = {
    isLoad: false,
    weathers: null,
    place: 'Greece',
    image: '',
  }
  
  componentDidMount() {
    fetch(`https://api.weatherapi.com/v1/current.json?key=4ba7b0ecdb9c438dab511236210210&q=${this.state.place}&aqi=no`)
      .then(response => response.json())
      .then(weatherList => {
        this.setState({
          isLoad: true,
          weathers: weatherList,
        })
        this.onImage(weatherList);
    })
  }
  
   onImage(weather) {
    if (weather.current.condition.text.includes('Partly cloudy')) {
      this.setState({
        image: 'assets/cloudy.jpeg'
      })
    } else if(weather.current.condition.text.includes('rain')) {
      this.setState({
        image: 'assets/rainy.jpeg'
      })
    } else {
      this.setState({
        image: 'assets/sunny.jpeg'
      })
    }
  };
  
  onChangePlace = (place, e) => {
    fetch(`https://api.weatherapi.com/v1/current.json?key=4ba7b0ecdb9c438dab511236210210&q=${place}&aqi=no`)
      .then(response => response.json())
      .then(weatherList => {
          this.setState({
            weathers: weatherList,
          })
        this.onChangeImage(weatherList)
      })
    const places = document.querySelectorAll('.place');
    for (let i = 0; i < places.length; i++) {
      places[i].classList.remove('active');
    }
    e.target.classList.add('active');
  }
  
  onChangeImage(weather) {
    if (weather.current.condition.text.includes('Partly cloudy')) {
      this.setState({
        image: 'assets/cloudy.jpeg'
      })
    } else if (weather.current.condition.text.includes('rain')) {
      this.setState({
        image: 'assets/rainy.jpeg'
      })
    } else {
      this.setState({
        image: 'assets/sunny.jpeg'
      })
    }
  };
  
  onSearchPlace = (place) => {
    fetch(`https://api.weatherapi.com/v1/current.json?key=4ba7b0ecdb9c438dab511236210210&q=${place}&aqi=no`)
      .then(response => response.json())
      .then(weatherList => {
        this.setState({
          weathers: weatherList,
        })
        this.onChangeImage(weatherList)
    })
    const places = document.querySelectorAll('.place');
    for (let i = 0; i < places.length; i++) {
      places[i].classList.remove('active');
    }
  }
  
  render() {
    
    if (!this.state.isLoad) {
      return null
    }
    
    return(
      <div className='weather-container'>
      <img src={this.state.image}/>
      <WeatherHead weather={this.state.weathers} />
       <Weather onSearchPlace={this.onSearchPlace} onChangePlace={this.onChangePlace} weathers={this.state.weathers} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));