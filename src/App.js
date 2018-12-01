import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: '#fff'
}

let fakeServerData = {
  user: {
    name: 'Pedro',
    playlists: [
      {
        name: 'My favorites',
        songs: [{name: 'Beat It', duration: 1343}, 
                {name: 'Cannellon Makaroni', duration: 1440}, 
                {name: 'Rosa Helikopter', duration: 552}]
      },
      {
        name: 'Discover Weekly',
        songs: [{name: 'Beat It', duration: 1343}, 
                {name: 'Cannellon Makaroni', duration: 1440}, 
                {name: 'Rosa Helikopter', duration: 552}]
      },
      {
        name: 'Roadtrip',
        songs: [{name: 'Beat It', duration: 1343}, 
                {name: 'Cannellon Makaroni', duration: 1440}, 
                {name: 'Rosa Helikopter', duration: 552}]
      },
      {
        name: 'Chilltunes',
        songs: [{name: 'Beat It', duration: 1343}, 
                {name: 'Cannellon Makaroni', duration: 1440}, 
                {name: 'Rosa Helikopter', duration: 552}]
      },
    ]
  },
}

class PlaylistCounter extends Component {
  render() {
    return (
      <div className='aggregate' style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>{this.props.playlists.length} Playlists</h2>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    } , [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div className='aggregate' style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>{Math.round(totalDuration/60)} Minutes</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img />
        <input type='text' /> Filter
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: '20%', display: 'inline-block' }}>
        <img />
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = { serverData: {} }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ serverData: fakeServerData })
    }, 500)
  }

  render() {
    return (
      <div className="App">

        {this.state.serverData.user ? //Corre essa linha. Se existir um usuário, segue para as de baixo.
          <div>
              <h1 style={{ ...defaultStyle, 'font-size': '54px' }}>
                {this.state.serverData.user.name}'s Playlists</h1>

            <PlaylistCounter playlists={this.state.serverData.user.playlists} />

            <HoursCounter playlists={this.state.serverData.user.playlists} />

            <Filter />

            <Playlist />

            <Playlist />

            <Playlist />

            <Playlist />

          </div> : <h2 style={defaultStyle}>Loading...</h2>
        }
      </div>
    )
  }
}



export default App
