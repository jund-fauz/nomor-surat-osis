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
          <td id="date-${id}">${tanggal}</td>
          <td id="pengirim-${id}">${pengirim}</td>
          <td id="jenis-${id}">${jenisSurat}</td>
          <td id="nomor-${id}">${nomorSurat}</td>
          <td id="perihal-${id}">${perihal}</td>
          <td id="link-${id}">
            ${link}
          </td>
        </tr>`;

export default tableData