import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'

let defaultStyle = {
  color: '#fff'
}

let fakeServerData = {
  user: {
    name: 'Pedro',
    playlists: [
      {
        name: 'My favorites',
        songs: [{ name: 'Beat It', duration: 1343 },
        { name: 'Cannellon Makaroni', duration: 1440 },
        { name: 'Rosa Helikopter', duration: 552 }]
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
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div className='aggregate' style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>{Math.round(totalDuration / 60)} Minutes</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img />
        <input type='text' onKeyUp={e =>
          this.props.onTextChange(e.target.value)} />
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{ ...defaultStyle, width: '20%', display: 'inline-block' }}>
        <img src={playlist.imageUrl} style={{width: '60px'}} />
        <h3>{playlist.name}</h3>
        <ul>
          {this.props.playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      serverData: {},
      filterString: '',
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    console.log(accessToken)


    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken },
    }).then(response => response.json())
      .then(data => this.setState({user: {name: data.display_name }}))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken },
    }).then(response => response.json())
      .then(data => this.setState({
        playlists: data.items.map(item => ({
          name: item.name,
          imageUrl: item.images[0].url,
          songs: []
        }))
      }))
  }

  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()))
        : []
    return (
      <div className="App">
        {this.state.user ? //Corre essa linha. Se existir um usuário, segue para as de baixo.
          <div>
            <h1 style={{ ...defaultStyle, 'font-size': '54px' }}>
              {this.state.user.name}'s Playlists
            </h1>
            <PlaylistCounter playlists={playlistToRender} />
            <HoursCounter playlists={playlistToRender} />
            <Filter onTextChange={text =>
              this.setState({ filterString: text })} />
            {playlistToRender.map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div> : <button onClick={() => window.location = 'http://localhost:8888/login'}
            style={{ padding: '20px', fontSize: '50px', marginTop: '20px' }}>
            Sign in with Spotify</button>
        }
      </div>
    )
  }
}



export default App
