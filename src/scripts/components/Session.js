import React from 'react'
import moment from 'moment'

import Players from './Players'
import Tables from './Tables'

import { ref } from '../constants/firebase'

const DEFAULT_DATE = moment().format( 'YYYY-MM-DD' )
const DEFAULT_START_TIME = '17:30'
const DEFAULT_END_TIME = '20:30'

const DEFAULT_TABLE = () => {
  return {
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
  }
}

const DEFAULT_PLAYER = ( startTime = DEFAULT_START_TIME, endTime = DEFAULT_END_TIME ) => {
  return {
    name: '',
    startTime,
    endTime,
  }
}

const DEFAULT_SESSION = {
  id: '',
  date: DEFAULT_DATE,
  createdBy: '',
  tables: [ DEFAULT_TABLE() ],
  players: [ DEFAULT_PLAYER(), DEFAULT_PLAYER() ],
  latestEndTime: DEFAULT_END_TIME,
}

const getFormattedNow = () => {
  const now = moment()
  const minutes = Math.floor( now.minutes() / 15 ) * 15
  const formattedNow = now.minutes( minutes ).format( 'HH:mm' )
  return formattedNow
}

class Session extends React.Component {
  constructor ( props ) {
    super( props )

    this.addPlayer = this.addPlayer.bind( this )
    this.addTable = this.addTable.bind( this )
    this.handleDelete = this.handleDelete.bind( this )
    this.handleChange = this.handleChange.bind( this )
    this.saveSession = this.saveSession.bind( this )

    const session = Object.assign({}, props.session || DEFAULT_SESSION )

    this.state = {
      session,
      activeTable: 0,
      activePlayer: 0,
      isValid: true,
      error: '',
    }
  }

  handleDelete() {
    const { session } = this.state

    if ( session.id ) {
      ref.child( `sessions/${ session.id }` ).remove()
    }

    this.props.handleDelete()
  }

  handleChange( e ) {
    const { name, value } = e.target
    const data = {}
    data[ name ] = value
    this.setState( data )
  }

  updateActiveTable( e, key ) {
    // TODO: Invalidate if player time is outside of table time
    const { session, activeTable } = this.state
    const tables = session.tables.slice()
    tables[ activeTable ][ key ] = e.target.value

    const latestEndTime = tables.reduce(( time, table ) => {
      if ( table.endTime > time ) return table.endTime
      return time
    }, '00:00' )

    this.updateSession({ tables, latestEndTime })
  }

  updateActivePlayer( e, key ) {
    // TODO: Invalidate if player time is outside of table time
    const { session, activePlayer } = this.state
    const players = session.players
    players[ activePlayer ][ key ] = e.target.value
    this.updateSession({ players })
  }

  extendPlayer( i ) {
    const { session } = this.state
    const players = session.players
    players[ i ].endTime = session.latestEndTime
    this.updateSession({ players })
  }

  handleSessionChange( e, key ) {
    const { session } = this.state
    session[ key ] = e.target.value
    this.setState({ session })
  }

  addPlayer() {
    const { players, latestEndTime } = this.state.session
    players.push( DEFAULT_PLAYER( getFormattedNow(), latestEndTime ))
    const activePlayer = players.length - 1
    this.updateSession({ players })
    this.setState({ activePlayer })
  }

  deletePlayer( i ) {
    const { activePlayer } = this.state
    const { players } = this.state.session

    players.splice( i, 1 )
    this.updateSession({ players })

    if ( activePlayer === i ) {
      const activePlayer = players.length - 1
      this.setState({ activePlayer })
    }
  }

  addTable() {
    const { tables } = this.state.session
    tables.push( DEFAULT_TABLE())
    const activeTable = tables.length - 1
    this.updateSession({ tables })
    this.setState({ activeTable })
  }

  deleteTable( i ) {
    const { activeTable } = this.state
    const { tables } = this.state.session

    tables.splice( i, 1 )
    this.updateSession({ tables })

    if ( activeTable === i ) {
      const activeTable = tables.length - 1
      this.setState({ activeTable })
    }
  }

  updateSession( data ) {
    const session = Object.assign({}, this.state.session, data )
    this.setState({ session })
  }

  isValid() {
    const { session } = this.state

    let isValid = true

    session.tables.forEach(( table ) => {
      if ( !table.startTime ) isValid = false
      if ( !table.endTime ) isValid = false
    })

    session.players.forEach(( player ) => {
      if ( !player.name || !player.name.trim()) isValid = false
      if ( !player.startTime ) isValid = false
      if ( !player.endTime ) isValid = false
    })

    this.setState({
      isValid,
      error: isValid ? '' : 'Please fill out all fields or delete empties.',
    })

    return isValid
  }

  setActivePlayer( i ) {
    this.setState({ activePlayer: i })
  }

  setActiveTable( i ) {
    this.setState({ activeTable: i })
  }

  saveSession() {
    if ( !this.isValid()) return

    const { session } = this.state

    if ( !session.id ) {
      const newSessionRef = ref.child( 'sessions' ).push()
      session.id = newSessionRef.key
      newSessionRef.set( session )
    }
    else {
      ref.child( `sessions/${ session.id }` ).set( session )
    }

    this.props.handleSave()
  }

  renderDate() {
    const { session } = this.state
    const date = moment( session.date, 'YYYY-MM-DD' )

    if ( this.props.view === 'edit' ) {
      return (
        <div className='date-wrapper'>
          <p className='label'>Date</p>
          <input
            type='date'
            value={session.date}
            onChange={( e ) => this.handleSessionChange( e, 'date' )}
          />
        </div>
      )
    }
    else {
      return (
        <div className='date'>
          {date.format( 'ddd, MMM DD' )}
        </div>
      )
    }
  }

  renderSave() {
    const { isValid, error } = this.state

    if ( this.props.view === 'edit' ) {
      return (
        <div>
          <p className='error'>{isValid ? '' : error}</p>
          <button className='save-session' onClick={this.saveSession}>Save Session</button>
        </div>
      )
    }
    else {
      return null
    }
  }

  render () {
    const { session, activePlayer, activeTable } = this.state
    const { view, isActive } = this.props

    const sessionMoment = moment( session.date )
    const nowMoment = moment()
    const isOldSession = sessionMoment.isBefore( nowMoment.subtract( 3, 'days' ))

    return (
      <div
        className={`session ${ view }-view`}
        data-is-active={isActive}
        onClick={!isActive ? this.props.toggleActive : () => {}}
      >

        {this.renderDate()}

        {isActive &&
        <div className='options'>
          {view === 'edit' || <div className='edit label' onClick={this.props.handleEdit}>edit</div>}
          {view === 'edit' && !isOldSession && <div className='delete label' onClick={this.handleDelete}>delete</div>}
        </div>
        }

        {view !== 'edit' &&
        <div className='caret-wrapper' onClick={this.props.toggleActive}>
          <div className='caret' data-is-expanded={isActive}></div>
        </div>
        }

        <Tables
          session={session}
          activeTable={activeTable}
          view={view}
          addTable={this.addTable.bind( this )}
          deleteTable={this.deleteTable.bind( this )}
          updateActiveTable={this.updateActiveTable.bind( this )}
          setActiveTable={this.setActiveTable.bind( this )}
        />

        <Players
          session={session}
          activePlayer={activePlayer}
          view={view}
          addPlayer={this.addPlayer.bind( this )}
          deletePlayer={this.deletePlayer.bind( this )}
          extendPlayer={this.extendPlayer.bind( this )}
          updateActivePlayer={this.updateActivePlayer.bind( this )}
          setActivePlayer={this.setActivePlayer.bind( this )}
        />

        {this.renderSave()}
      </div>
    )
  }
}

export default Session
