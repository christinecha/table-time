import React from 'react'
import moment from 'moment'
import getMoney from '../lib/getMoney'
import getVenmoLink from '../lib/getVenmoLink'

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
            <div className='row'>
              <input
                className='player-name'
                type='text'
                placeholder='Player Name'
                value={player.name}
                onChange={( e ) => this.props.updateActivePlayer( e, 'name' )}
              />
              {i > 1 && <div className='delete' onClick={() => this.props.deletePlayer( i )}>✕</div>}
            </div>
            <div className='row'>
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
              <div className='label extend' onClick={() => this.props.extendPlayer( i )}>Extend</div>
            </div>
          </div>
        )
      }
      else {
        const start = moment( player.startTime, 'HH:mm' ).format( 'h:mm' )
        const end = moment( player.endTime, 'HH:mm' ).format( 'h:mm' )
        const money = getMoney( session, player )
        const dayOfTheWeek = moment( session.date ).format( 'dddd' )

        return (
          <a className='player' key={i} href={getVenmoLink( money, dayOfTheWeek )}>
            <span className='name'>{player.name}</span>
            <span className='time'>{start} - {end}</span>
            <span className='money'>${money}</span>
          </a>
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
