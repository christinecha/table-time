const TABLE_PER_HOUR = 24.50

const getHoursAndMinutes = ( str ) => {
  const parts = str.split( ':' )
  const hours = +parts[ 0 ]
  const minutes = +parts[ 1 ]
  return { hours, minutes }
}

const getDuration = ( data ) => {
  const start = getHoursAndMinutes( data.startTime )
  const end = getHoursAndMinutes( data.endTime )

  const minDiff = end.minutes - start.minutes
  const hourDiff = end.hours - start.hours

  return hourDiff + minDiff / 60
}

export const getRates = ( session ) => {
  const { tables, players } = session

  const units = tables.concat( players )
  const intersects = []

  units.forEach(({ startTime, endTime }) => {
    if ( intersects.indexOf( startTime ) < 0 ) intersects.push( startTime )
    if ( intersects.indexOf( endTime ) < 0   ) intersects.push( endTime )
  })

  intersects.sort()

  const buckets = []

  for ( let i = 1; i < intersects.length; i++ ) {
    const startTime = intersects[ i - 1 ]
    const endTime = intersects[ i ]
    const duration = getDuration({ startTime, endTime })

    const activePlayers = players.filter(( player ) => {
      const hasStarted = player.startTime <= startTime
      const stillPlaying = player.endTime >= endTime
      return hasStarted && stillPlaying
    })

    const activeTables = tables.filter(( table ) => {
      const hasStarted = table.startTime <= startTime
      const stillPlaying = table.endTime >= endTime
      return hasStarted && stillPlaying
    })

    const rate = ( duration * TABLE_PER_HOUR * activeTables.length ) / activePlayers.length

    buckets.push({
      startTime,
      endTime,
      duration,
      activePlayers,
      activeTables,
      rate,
    })
  }

  return buckets
}

export const getMoney = ( session, player ) => {
  const { tables, players } = session

  let tableTime = 0
  let playingTime = 0

  tables.forEach(( table ) => tableTime += getDuration( table ))
  players.forEach(( player ) => playingTime += getDuration( player ))

  const playerTime = getDuration( player )
  const moneys = playerTime / playingTime * tableTime * TABLE_PER_HOUR

  return moneys.toFixed( 2 )
}

export const getCorrectMoney = ( buckets, player ) => {
  let due = 0

  buckets.forEach(( bucket ) => {
    const isActive = bucket.activePlayers.indexOf( player ) > -1

    if ( isActive ) {
      due += bucket.rate
    }
  })

  return due.toFixed( 2 )
}
