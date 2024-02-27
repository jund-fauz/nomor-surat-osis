const linkButton = (link, id) =>
  `${
    link == ''
      ? `<button id="create-link-${id}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#create-link-dialog">Masukkan Link</button>`
      : `<a href="${link}" type="button" class="btn btn-primary" target="_blank">Buka</a>`
  }
  <button type="button" class="btn btn-primary ms-1" id="edit-${id}" hidden data-bs-toggle="modal" data-bs-target="#edit-dialog">
    <i class="fa-solid fa-pencil"></i>
  </button>`

export default linkButton;