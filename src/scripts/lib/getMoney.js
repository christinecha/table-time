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

const getMoney = ( session, player ) => {
  const { tables, players } = session
  let tableTime = 0
  let playingTime = 0

  tables.forEach(( table ) => tableTime += getDuration( table ))
  players.forEach(( player ) => playingTime += getDuration( player ))

  const playerTime = getDuration( player )
  const moneys = playerTime / playingTime * tableTime * TABLE_PER_HOUR

  return moneys.toFixed( 2 )
}

export default getMoney
