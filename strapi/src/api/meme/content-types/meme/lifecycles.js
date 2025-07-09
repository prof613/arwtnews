module.exports = {
  beforeCreate(event) {
    const { data } = event.params

    // Auto-format artist link 1
    if (data.artist_link_1 && !data.artist_link_1.match(/^https?:\/\//)) {
      data.artist_link_1 = `http://${data.artist_link_1}`
    }

    // Auto-format artist link 2
    if (data.artist_link_2 && !data.artist_link_2.match(/^https?:\/\//)) {
      data.artist_link_2 = `http://${data.artist_link_2}`
    }
  },

  beforeUpdate(event) {
    const { data } = event.params

    // Auto-format artist link 1
    if (data.artist_link_1 && !data.artist_link_1.match(/^https?:\/\//)) {
      data.artist_link_1 = `http://${data.artist_link_1}`
    }

    // Auto-format artist link 2
    if (data.artist_link_2 && !data.artist_link_2.match(/^https?:\/\//)) {
      data.artist_link_2 = `http://${data.artist_link_2}`
    }
  },
}
