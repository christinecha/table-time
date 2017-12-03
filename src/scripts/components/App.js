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

  renderView() {
    const { sessions, view, activeSession } = this.state

    const session = activeSession ? sessions[ activeSession ] : {}

    if ( view === 'edit' ) {
      return (
        <Session
          view={view}
          session={session}
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
            handleEdit={() => this.editSession( key )}
          />
        )
      })
    }
  }

  render () {
    return (
      <main>
        {this.renderView()}
      </main>
    )
  }
}

export default App
