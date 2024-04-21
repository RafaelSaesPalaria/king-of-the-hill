var content = {
    level: {
        canvas : document.querySelector('canvas#level'),
        c : document.querySelector('canvas#level').getContext("2d")
    },
    entities: {
        players: [],
        platforms: []
    },
    settings: {
        fps: 24
    }
}

// SCREEN
resize(content.level.canvas)
window.addEventListener("resize",resize)