const linkButton = (link, id) =>
  `${
    link == ''
      ? `<button onclick="createLink(${id})" type="button" class="btn btn-primary">Masukkan Link</button>`
      : `<a href="${link}" type="button" class="btn btn-primary">Buka</a>`
  }
  <button type="button" class="btn btn-primary" id="edit-${id}" hidden data-bs-toggle="modal" data-bs-target="#edit-dialog">
    <i class="fa-solid fa-pencil"></i>
  </button>
  <button type="button" class="btn btn-danger" id="delete-${id}" onclick="deleteData(${id})" hidden>
    <i class="fa-solid fa-trash"></i>
  </button>`

export default linkButton;
