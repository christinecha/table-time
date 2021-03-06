import React from 'react'
import moment from 'moment'

class Tables extends React.Component {
  renderTables() {
    const { session, activeTable, view } = this.props
    return session.tables.map(( table, i ) => {
      if ( view === 'edit' ) {
        return (
          <div
            className='input-wrapper'
            data-is-active={i === activeTable}
            key={`table-${ i }`}
            onClick={() => this.props.setActiveTable( i )}
          >
            <input
              type='time'
              step={15 * 60}
              value={table.startTime}
              onChange={( e ) => this.props.updateActiveTable( e, 'startTime' )}
            />
            <span>-</span>
            <input
              type='time'
              step={15 * 60}
              value={table.endTime}
              onChange={( e ) => this.props.updateActiveTable( e, 'endTime' )}
            />
            {i !== 0 && <div className='delete' onClick={() => this.props.deleteTable( i )}>✕</div>}
          </div>
        )
      }
      else {
        const start = moment( table.startTime, 'HH:mm' ).format( 'h:mm A' )
        const end = moment( table.endTime, 'HH:mm' ).format( 'h:mm A' )

        return (
          <div className='table' key={i}>
            {start} - {end}
          </div>
        )
      }
    })
  }

  render() {
    const { view, addTable } = this.props

    return (
      <div className='tables-wrapper'>
        <p className='label'>Tables</p>
        <div className='tables'>
          {this.renderTables()}
          {view === 'edit' && <button className='plain' onClick={addTable}>+ Add Another Table</button>}
        </div>
      </div>
    )
  }
}

export default Tables
