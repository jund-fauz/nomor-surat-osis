const linkButton = (link, id) => link == '' ? `<button onclick="createLink(${id})" type="button" class="btn btn-primary">Masukkan Link</button>` : `<a href="${link}" type="button" class="btn btn-primary">Buka</a>`

export default linkButton