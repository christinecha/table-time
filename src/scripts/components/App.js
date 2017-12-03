import React from 'react'
import { ref } from '../constants/firebase'
import Session from './Session'

class App extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      view: 'feed',
      sessions: {},
      activeSession: null,
    }
  }

  componentWillMount() {
    ref.child( 'sessions' ).on( 'value', ( snapshot ) => {
      this.setState({ sessions: snapshot.val() })
    })
  }

  editSession( key ) {
    this.setState({
      activeSession: key,
      view: 'edit',
    })
  }

  deleteSession( key ) {
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

  renderView() {
    const { sessions, view, activeSession } = this.state

    const session = activeSession ? sessions[ activeSession ] : null

    if ( view === 'edit' ) {
      return (
        <Session
          view={view}
          session={session}
          handleDelete={() => this.deleteSession( activeSession )}
          handleSave={() => this.setState({ view: 'feed' })}
        />
      )
    }

    else {
      const keys = Object.keys( sessions )
      return keys.map(( key ) => {
        return (
          <Session
            view={view}
            key={key}
            session={sessions[ key ]}
            handleDelete={() => this.deleteSession( key )}
            handleEdit={() => this.editSession( key )}
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
          <div className='new-session' onClick={() => this.newSession()}>+ new session</div>
        </nav>
        {this.renderView()}
      </main>
    )
  }
}

export default App
