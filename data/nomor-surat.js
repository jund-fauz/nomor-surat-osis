const nomorSurat = (id, jenisSurat, pengirim, periode, bulan, tahun) => `${id < 10 ? '0' : ''}${id}/${jenisSurat}/SEK/OSIS${periode}-ITSI/${bulan}/${tahun}`

export default nomorSurat