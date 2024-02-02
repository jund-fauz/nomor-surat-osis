const tableData = (
  id,
  tanggal,
  pengirim,
  jenisSurat,
  nomorSurat,
  perihal,
  link
) => `<tr>
          <th scope="row">${id}</th>
          <td>${tanggal}</td>
          <td>${pengirim}</td>
          <td>${jenisSurat}</td>
          <td>${nomorSurat}</td>
          <td>${perihal}</td>
          <td class="d-flex justify-content-between" id="link-table-${id}">
            ${link}
          </td>
        </tr>`;

export default tableData