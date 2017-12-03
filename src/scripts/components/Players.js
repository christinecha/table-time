import React from 'react'
import getMoney from '../lib/getMoney'

class Players extends React.Component {
  renderPlayers() {
    const { session, activePlayer } = this.props
    return session.players.map(( player, i ) => {
      if ( this.props.view === 'edit' ) {
        return (
          <div
            className='input-wrapper'
            data-is-active={i === activePlayer}
            key={i}
            onClick={() => this.props.setActivePlayer( i )}
          >
            <input
              className='player-name'
              type='text'
              placeholder='Player Name'
              value={player.name}
              onChange={( e ) => this.props.updateActivePlayer( e, 'name' )}
            />
            <input
              type='time'
              step={15 * 60}
              value={player.startTime}
              onChange={( e ) => this.props.updateActivePlayer( e, 'startTime' )}
            />
            <span>-</span>
            <input
              type='time'
              step={15 * 60}
              value={player.endTime}
              onChange={( e ) => this.props.updateActivePlayer( e, 'endTime' )}
            />
            {i !== 0 && <div className='delete' onClick={() => this.props.deletePlayer( i )}>✕</div>}
          </div>
        )
      }
      else {
        return (
          <div className='player' key={i}>
            <span className='name'>{player.name}</span>
            <span className='time'>{player.startTime}-{player.endTime}</span>
            <span className='money'>${getMoney( session, player )}</span>
          </div>
        )
      }
    })
  }

  render() {
    const { view, addPlayer } = this.props

    return (
      <div className='players-wrapper'>
        <p className='label'>Players</p>
        <div className='players'>
          {this.renderPlayers()}
          {view === 'edit' && <button className='plain' onClick={addPlayer}>+ Add Another Player</button>}
        </div>
      </div>
    )
  }
}

export default Players
