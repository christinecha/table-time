const isMobile = 'ontouchstart' in window

const getVenmoLink = ( amount, note ) => {
  note = encodeURIComponent( `${ note } 🏓` )

  if ( isMobile ) return `venmo://paycharge?txn=charge&amount=${ amount }&note=${ note }`
  return `https://venmo.com/?txn=charge&amount=${ amount }&note=${ note }`
}

export default getVenmoLink
