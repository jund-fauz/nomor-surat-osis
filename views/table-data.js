const tableData = (id, tanggal, pengirim, jenisSurat, nomorSurat, perihal, link) => `<tr>
          <th scope="row">${id}</th>
          <td>${tanggal}</td>
          <td>${pengirim}</td>
          <td>${jenisSurat}</td>
          <td id="nomor-surat-content">${nomorSurat}</td>
          <td>${perihal}</td>
          <td>${link}</td>
        </tr>`

export default tableData