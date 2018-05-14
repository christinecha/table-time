import React from 'react'
import { Creatable } from 'react-select'

import moment from 'moment'
import { ref } from '../constants/firebase'
import { getMoney, getRates, getCorrectMoney } from '../lib/getMoney'
import getVenmoLink from '../lib/getVenmoLink'

class Players extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      options: [],
    }
  }

  componentWillMount() {
    ref.child( 'sessions' ).orderByChild( 'date' ).once( 'value', ( snapshot ) => {
      const playerNames = []

      snapshot.forEach(( childSnapshot ) =>  {
        const session = childSnapshot.val()
        session.players.forEach(({ name }) => {
          if ( playerNames.indexOf( name.trim()) < 0 ) playerNames.push( name.trim())
        })
      })

      const options = []
      playerNames.sort().forEach(( name ) => {
        const option = { value: name, label: name }
        options.push( option )
      })

      this.setState({ options })
    })
  }

  renderPlayers() {
    const { session, activePlayer } = this.props

    const isAfterCorrection = new Date( session.date ).getTime() >= 1526169600000
    const rates = getRates( session )

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
              <Creatable
                className='player-name'
                placeholder='Player Name'
                value={player.name}
                options={this.state.options}
                onChange={( e ) => this.props.updateActivePlayer( e, 'name' )}
                onFocus={() => this.props.setActivePlayer( i )}
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
        const wrongMoney = getMoney( session, player )
        const correctMoney = getCorrectMoney( rates, player )
        const dayOfTheWeek = moment( session.date ).format( 'dddd' )
        const note = `${ dayOfTheWeek } (${ start } - ${ end })`

        const money = isAfterCorrection ? correctMoney : wrongMoney

        return (
          <a className='player' key={i} href={getVenmoLink( money, note )}>
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
