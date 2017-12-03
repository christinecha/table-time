import React from 'react'
import { ref } from '../constants/firebase'
import Session from './Session'

class App extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      view: 'feed',
      sessions: [],
      activeSession: 0,
      expandedSessions: [ 0 ],
    }
  }

  componentWillMount() {
    ref.child( 'sessions' ).orderByChild( 'date' ).on( 'value', ( snapshot ) => {
      const sessions = []

      snapshot.forEach(( childSnapshot ) =>  {
        sessions.unshift( childSnapshot.val())
      })

      this.setState({ sessions })
    })
  }

  editSession( key ) {
    this.setState({
      activeSession: key,
      view: 'edit',
    })
  }

  deleteSession() {
    this.setState({
      activeSession: null,
      view: 'feed',
    })
  }

  newSession() {
    this.setState({
      view: 'edit',
      activeSession: null,
    })
  }

  setActiveSession( i ) {
    this.setState({ activeSession: i })
  }

  toggleExpanded( i ) {
    const expandedSessions = this.state.expandedSessions.slice()
    const index = expandedSessions.indexOf( i )
    if ( index > -1 ) expandedSessions.splice( index, 1 )
    else expandedSessions.push( i )
    this.setState({ expandedSessions })
  }

  renderView() {
    const { sessions, view, activeSession, expandedSessions } = this.state

    if ( view === 'edit' ) {
      return (
        <Session
          isActive={true}
          view={view}
          session={sessions[ activeSession ]}
          handleDelete={() => this.deleteSession( activeSession )}
          handleSave={() => this.setState({ view: 'feed' })}
        />
      )
    }

    else {
      return sessions.map(( session, i ) => {
        return (
          <Session
            isActive={expandedSessions.indexOf( i ) > -1}
            view={view}
            key={session.id}
            session={session}
            handleDelete={() => this.deleteSession( i )}
            handleEdit={() => this.editSession( i )}
            toggleActive={() => this.toggleExpanded( i )}
          />
        )
      })
    }
  }

  render () {
    return (
      <main>
        <nav>
          <h1 onClick={() => this.setState({ view: 'feed' })}>table time</h1>
          {
            this.state.view === 'feed' &&
            <div className='new-session' onClick={() => this.newSession()}>+ new session</div>
          }
          {
            this.state.view === 'edit' &&
            <div className='new-session' onClick={() => this.setState({ view: 'feed' })}>{'< back'}</div>
          }
        </nav>
        {this.renderView()}
      </main>
    )
  }
}

export default App
