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

const getMoney = ( tables, player ) => {
  let tableTime = 0

  tables.forEach(( table ) => {
    tableTime += getDuration( table )
  })

  const playerTime = getDuration( player )
  const moneys = playerTime / tableTime * TABLE_PER_HOUR

  return moneys.toFixed( 2 )
}

export default getMoney
