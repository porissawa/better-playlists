import React, { Component } from 'react';
import 'reset-css/reset.css'
import './App.css';
import queryString from 'query-string'

let defaultStyle = {
  color: '#fff',
  fontFamily: 'Helvetica'
}

let counterStyle = {...defaultStyle, 
  width: '40%', 
  display: 'inline-block',
  marginBottom: '10px',
  lineHeight: '30px', 
  fontSize: '20px',}

class PlaylistCounter extends Component {
  render() {
    let playlistCounterStyle = {...counterStyle}
    return (
      <div style={playlistCounterStyle}>
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
    let isTooLow = (Math.round(totalDuration)/60) < 10
    let hoursCounterStyle = {...counterStyle, 
      color: isTooLow ? 'red' : 'white',
      fontWeight: isTooLow ? 'bold' : 'normal'
    }
    return (
      <div style={hoursCounterStyle}>
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
          this.props.onTextChange(e.target.value)}
          style={{...defaultStyle, 
          color: 'black',
          fontSize: '20px', 
          padding: '10px',
          marginBottom: '20px'}} />
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{ ...defaultStyle, 
      width: '22%', 
      display: 'inline-block',
      height: '200px',
      padding: '10px',
      background: this.props.index % 2 ? '#C0C0C0' : '#808080',
      textAlign: 'center',
      verticalAlign: 'top', 
      overflow: 'hidden',
      borderBottom: 'solid 1px #303030'
      }}>
        <h3 style={{fontWeight: 'bold'}}>{playlist.name}</h3>
        <img src={playlist.imageUrl} style={{width: '60px', marginTop: '10px'}} />
        <ul style={{marginTop: '10px',
            fontWeight: 'bold'}}>
          {this.props.playlist.songs.map(song =>
            <li style={{lineHeight: '20px', textOverflow: 'ellipsis'}}>{song.name}</li>
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
      .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        })
        let trackDataPromise = responsePromise
        .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
          .map(item => item.track)
          .map(trackData => ({
            name: trackData.name,
            duration: trackData.duration_ms/1000
          }))
        })
        return playlists
      })
      return playlistsPromise
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => ({
          name: item.name,
          imageUrl: item.images[0].url,
          songs: item.trackDatas.slice(0,3)
        }))
      }))
  }

  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
          }): []
    return (
      <div className="App">
        {this.state.user ? //Corre essa linha. Se existir um usuário, segue para as de baixo.
          <div>
            <h1 style={{ ...defaultStyle, 
              fontSize: '54px',
              marginTop: '20px' }}>
              {this.state.user.name}'s Playlists
            </h1>
            <PlaylistCounter playlists={playlistToRender} />
            <HoursCounter playlists={playlistToRender} />
            <Filter onTextChange={text =>
              this.setState({ filterString: text })} />
            {playlistToRender.map((playlist, i) =>
              <Playlist playlist={playlist} index={i} />
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
