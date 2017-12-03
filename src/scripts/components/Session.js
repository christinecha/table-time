import React from 'react'
import moment from 'moment'

import { ref } from '../constants/firebase'
import getMoney from '../lib/getMoney'

const DEFAULT_DATE = new Date().toISOString().substring( 0, 10 )
const DEFAULT_START_TIME = '17:30'
const DEFAULT_END_TIME = '20:30'

const DEFAULT_TABLE = () => {
  return {
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
  }
}

const DEFAULT_PLAYER = () => {
  return {
    name: '',
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
  }
}

const DEFAULT_SESSION = {
  id: '',
  date: DEFAULT_DATE,
  createdBy: '',
  tables: [ DEFAULT_TABLE() ],
  players: [ DEFAULT_PLAYER() ],
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

  handleTableChange( e, key ) {
    // TODO: Invalidate if player time is outside of table time
    const { session, activeTable } = this.state
    const tables = session.tables.slice()
    tables[ activeTable ][ key ] = e.target.value
    this.updateSession({ tables })
  }

  handlePlayerChange( e, key ) {
    // TODO: Invalidate if player time is outside of table time
    const { session, activePlayer } = this.state
    const players = session.players
    players[ activePlayer ][ key ] = e.target.value
    this.updateSession({ players })
  }

  handleSessionChange( e, key ) {
    const { session } = this.state
    session[ key ] = e.target.value
    this.setState({ session })
  }

  addPlayer() {
    const { players } = this.state.session
    players.push( DEFAULT_PLAYER())
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

  renderTables() {
    const { session, activeTable } = this.state
    return session.tables.map(( table, i ) => {
      if ( this.props.view === 'edit' ) {
        return (
          <div
            className='input-wrapper'
            data-is-active={i === activeTable}
            key={`table-${ i }`}
            onClick={() => this.setState({ activeTable: i })}
          >
            <input
              type='time'
              step={15 * 60}
              value={table.startTime}
              onChange={( e ) => this.handleTableChange( e, 'startTime' )}
            />
            <span>-</span>
            <input
              type='time'
              step={15 * 60}
              value={table.endTime}
              onChange={( e ) => this.handleTableChange( e, 'endTime' )}
            />
            {i !== 0 && <div className='delete' onClick={() => this.deleteTable( i )}>✕</div>}
          </div>
        )
      }
      else {
        return (
          <div className='table' key={i}>
            {table.startTime} - {table.endTime}
          </div>
        )
      }
    })
  }

  renderPlayers() {
    const { session, activePlayer } = this.state
    return session.players.map(( player, i ) => {
      if ( this.props.view === 'edit' ) {
        return (
          <div
            className='input-wrapper'
            data-is-active={i === activePlayer}
            key={i}
            onClick={() => this.setState({ activePlayer: i })}
          >
            <input
              type='text'
              placeholder='Player Name'
              value={player.name}
              onChange={( e ) => this.handlePlayerChange( e, 'name' )}
            />
            <input
              type='time'
              step={15 * 60}
              value={player.startTime}
              onChange={( e ) => this.handlePlayerChange( e, 'startTime' )}
            />
            <span>-</span>
            <input
              type='time'
              step={15 * 60}
              value={player.endTime}
              onChange={( e ) => this.handlePlayerChange( e, 'endTime' )}
            />
            {i !== 0 && <div className='delete' onClick={() => this.deletePlayer( i )}>✕</div>}
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

  renderDate() {
    const { session, isValid, error } = this.state
    const date = moment( session.date, 'YYYY-DD-MM' )

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
          <button onClick={this.saveSession}>Save</button>
        </div>
      )
    }
    else {
      return null
    }
  }

  render () {
    const { view } = this.props

    return (
      <div className='session'>
        {this.renderDate()}

        <div className='options'>
          <div className='edit label' onClick={this.props.handleEdit}>edit</div>
          <div className='delete label' onClick={this.handleDelete}>delete</div>
        </div>

        <div className='tables-wrapper'>
          <p className='label'>Tables</p>
          <div className='tables'>
            {this.renderTables()}
            {view === 'edit' && <button onClick={this.addTable}>+ Add Table</button>}
          </div>
        </div>

        <div className='players-wrapper'>
          <p className='label'>Players</p>
          <div className='players'>
            {this.renderPlayers()}
            {view === 'edit' && <button onClick={this.addPlayer}>+ Add Player</button>}
          </div>
        </div>

        {this.renderSave()}
      </div>
    )
  }
}

export default Session
