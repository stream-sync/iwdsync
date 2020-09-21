const caster_favicons = {
    midbeast: 'midbeast/favicon.ico',
    iwd: 'iwd/favicon.ico',
}

export function setFavicon(caster) {
    if (caster_favicons[caster] !== undefined) {
        let path = `${process.env.PUBLIC_URL}/favicon/${caster_favicons[caster]}`
        let favElt = document.getElementsByName('favicon')
        for (let elt of favElt) {
            elt.setAttribute('href', path)
        }
    }
}
