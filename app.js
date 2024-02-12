import tableData from './views/table-data.js'
import monthName from './data/month.js'
import nomorSurat from './data/nomor-surat.js'
import toRoman from './function/roman-numerals.js'
import linkButton from './views/open-link.js'
import jenisSurat from './data/jenis-surat.js'
import toDecimal from './function/to-decimal.js'
import jenisSuratKepanjangan from './data/jenis-surat-kepanjangan.js'
import change from './function/ubah-jenis-data.js'

const mainUrl = 'https://aplikasi-nomor-surat-osis.vercel.app'
// const mainUrl = 'http://localhost:3000'

jQuery(function ($) {
  if (!Cookies.get('loggedIn')) $('#login-dialog').modal('show')
  if (Cookies.get('search') !== 'undefined' || Cookies.get('search') !== '')
    $('#search').val(Cookies.get('search'))

  $('#login').click(() => login($('#username').val(), $('#password').val()))

  $('#create-new').click(() =>
      createNewLetter(
          $('#pengirim option:selected').text(),
          $('#jenis-surat').val(),
          $('#perihal').val(),
          $('#link').val()
      )
  )

  $('#create-link').click(() => inputLink($('#link-2').val()))

  $('#input-new-btn').click(() =>
      inputNewData($('#input-new').val().split('\n'))
  )

  $('#link-2').on('keypress', (key) => {
    if (key.which === 13) inputLink($('#link-2').val())
  })

  $('#password').on('keypress', (key) => {
    if (key.which === 13) login($('#username').val(), $('#password').val())
  })

  $('#link-edit').on('keypress', (key) => {
    if (key.which === 13)
      editLetter(
          $('#date').val(),
          $('#pengirim-edit').val(),
          $('#jenis-surat-edit').val(),
          $('#perihal-edit').val(),
          $('#link-edit').val()
      )
  })

  $('#edit').click(() =>
      editLetter(
          $('#date').val(),
          $('#pengirim-edit').val(),
          $('#jenis-surat-edit').val(),
          $('#perihal-edit').val(),
          $('#link-edit').val()
      )
  )

  $('#delete').click(() => {
    fetch(`${mainUrl}/nomor-surat/${localStorage.getItem('id')}`, {
      method: 'DELETE',
    }).catch((error) => console.log(error))
    $('#delete-dialog').modal('hide')
    location.reload()
  })

  $('#search').change(search)
  $('#searchButton').click(search)

  const createLinkDialog = document.getElementById('create-link-dialog')
  createLinkDialog.addEventListener('hidden.bs.modal', (_) =>
      clearInput($('#link-2'), $('#error-link'))
  )

  const inputNewDialog = document.getElementById('input-new-dialog')
  inputNewDialog.addEventListener('hidden.bs.modal', (_) =>
      clearInput($('#input-new'), $('#error-link'))
  )

  const createNewDialog = document.getElementById('create-new-dialog')
  createNewDialog.addEventListener('hidden.bs.modal', (_) => {
    clearInput($('#perihal'), $('#error-perihal'))
    clearInput($('#link'), $('#error-link'))
  })

  const editDialog = document.getElementById('edit-dialog')
  editDialog.addEventListener('hidden.bs.modal', (_) => {
    clearInput($('#date-container > .mt-1'), $('#error-date'))
    clearInput($('#perihal-edit'), $('#error-edit-perihal'))
    clearInput($('#edit-link'), $('#error-edit-link'))
  })

  search()

  function login(username, password) {
    if (username === 'osis' && password === 'admin123') {
      const date = new Date()
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
      $('#login-dialog').modal('hide')
      Cookies.set('loggedIn', 'true', { expires: 30 })
    } else {
      const error = document.createElement('p')
      error.innerText =
          username === '' || password === ''
              ? 'Masukkan Username/Password dengan benar.'
              : 'Username/Password yang dimasukkan salah.'
      error.style.color = 'red'
      error.id = 'error-message'
      if ($('#error-message').length) shakeElement($('#error-message'))
      else {
        $('#login-content').append(error)
        $('#password').css('margin-bottom', '5px')
      }
    }
  }

  function shakeElement(element) {
    element.addClass('rotateable')
    element.css('margin-left', '20px')

    setTimeout(function () {
      element.css('margin-left', '-10px')
      setTimeout(function () {
        element.css('margin-left', '0px')
      }, 100)
    }, 100)

    return true
  }

  function showLetterNumber(data) {
    if (Cookies.get('search') !== '') $('#table-content').empty()
    data[0].payload.forEach((data) => {
      const {
        id,
        tanggal,
        bulan,
        tahun,
        pengirim,
        jenis_surat,
        perihal,
        link,
      } = data
      const finalDate = `${tanggal === 0 ? '' : tanggal} ${
          monthName[bulan - 1]
      } ${tahun}`
      $('#table-content').append(
          tableData(
              id,
              finalDate,
              pengirim,
              change(jenis_surat, jenisSurat, jenisSuratKepanjangan),
              nomorSurat(id, jenis_surat, pengirim, 'XIV', toRoman(bulan), tahun),
              perihal,
              linkButton(link, id)
          )
      )
      $('tbody > tr:last-child').hover(
          () => {
            $(`#edit-${id}`).removeAttr('hidden')
            $(`#delete-${id}`).removeAttr('hidden')
          },
          () => {
            $(`#edit-${id}`).attr('hidden', '')
            $(`#delete-${id}`).attr('hidden', '')
          }
      )
      $(`#create-link-${id}`).click(() => localStorage.setItem('id', id))
      $(`#edit-${id}`).click(() => edit(id))
      $(`#delete-${id}`).click(() => {
        localStorage.setItem('id', id)
        $('#delete-nomor-surat-body').text($(`#nomor-${id}`).text())
      })
    })
    if (!data[0].payload.length && Cookies.get('search') === '')
      $('#empty-table').append(
          `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#input-new-dialog">Masukkan Data Yang Sudah Ada</button>`
      )
    else if (!data[0].payload.length && Cookies.get('search') !== '')
      $('#empty-table').append(`<p>Data tidak ditemukan`)
    else $('#empty-table').empty()
  }

  function createNewLetter(pengirim, jenis, perihalNullable, linkNullable) {
    $('#empty-table').empty()
    const perihal = perihalNullable || '',
        link = linkNullable || ''
    let valid = 0
    if (perihal.length > 100) {
      const error = document.createElement('p')
      error.innerText = 'Jumlah maksimal adalah 100 huruf.'
      error.style.color = 'red'
      error.id = 'error-perihal'
      if ($('#error-perihal').length) shakeElement($('#error-perihal'))
      else {
        $('#perihal-container').append(error)
        $('#perihal').css('margin-bottom', '5px')
      }
    } else {
      $('#error-perihal').remove()
      $('#perihal').css('margin-bottom', '0px')
      valid++
    }
    if (link.length > 500 || isLinkBroken(link)) {
      const error = document.createElement('p')
      error.innerText = isLinkBroken(link)
          ? 'Masukkan link yang benar.'
          : 'Jumlah maksimal adalah 500 huruf.'
      error.style.color = 'red'
      error.id = 'error-link'
      if ($('#error-link').length) shakeElement($('#error-link'))
      else {
        $('#link-container').append(error)
        $('#link').css('margin-bottom', '5px')
      }
    } else {
      $('#error-link').remove()
      $('#link').css('margin-bottom', '0px')
      valid++
    }

    if (valid === 2) {
      fetch(`${mainUrl}/nomor-surat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jenisSurat: jenisSurat[jenis - 1],
          pengirim,
          perihal,
          link,
        }),
      })
          .then((response) => response.json())
          .then((response) => {
            const date = new Date()
            const finalDate = `${date.getDate()} ${
                monthName[date.getMonth()]
            } ${date.getFullYear()}`
            const id = response[0].payload.id
            $('#table-content').append(
                tableData(
                    id,
                    finalDate,
                    pengirim,
                    jenisSuratKepanjangan[jenis - 1],
                    nomorSurat(
                        response[0].payload.id,
                        jenisSurat[jenis - 1],
                        pengirim,
                        'XIV',
                        toRoman(date.getMonth() + 1),
                        date.getFullYear()
                    ),
                    perihal,
                    linkButton(link, id)
                )
            )
            $('tbody > tr:last-child').hover(
                () => {
                  $(`#edit-${id}`).removeAttr('hidden')
                  $(`#delete-${id}`).removeAttr('hidden')
                },
                () => {
                  $(`#edit-${id}`).attr('hidden', '')
                  $(`#delete-${id}`).attr('hidden', '')
                }
            )
            $(`#edit-${id}`).click(() => edit(id))
            $('#create-new-dialog').modal('hide')
          })
          .catch((error) => console.log(error))
    }
  }

  function inputLink(link) {
    if (link.length > 500 || isLinkBroken(link) || link === '') {
      const error = document.createElement('p')
      error.style.color = 'red'
      error.id = 'error-link'
      if ($('#error-link').length) {
        if (link === '') {
          $('#error-link').text('Inputan link kosong.')
        } else if (isLinkBroken(link)) {
          $('#error-link').text('Masukkan link yang benar.')
        } else {
          $('#error-link').text('Jumlah maksimal adalah 500 huruf.')
        }
        shakeElement($('#error-link'))
      } else {
        if (link === '') {
          error.innerText = 'Inputan link kosong.'
        } else if (isLinkBroken(link)) {
          error.innerText = 'Masukkan link yang benar.'
        } else {
          error.innerText = 'Jumlah maksimal adalah 500 huruf.'
        }
        $('#link-2-container').append(error)
        $('#link-2').css('margin-bottom', '5px')
      }
    } else {
      const id = localStorage.getItem('id')
      $('#error-link').remove()
      $('#link-2').css('margin-bottom', '0px')
      fetch(`${mainUrl}/nomor-surat/${id}/link`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link,
        }),
      })
          .then((_) => {
            $(`tr:nth-child(${id}) > td:last-child`).empty()
            $(`tr:nth-child(${id}) > td:last-child`).append(linkButton(link, id))
            $('#create-link-dialog').modal('hide')
            $(`#edit-${id}`).click(() => edit(id))
            $(`#delete-${id}`).click(() => {
              localStorage.setItem('id', id)
              $('#delete-nomor-surat-body').text(
                  $(`tr:nth-child(${id}) > td:nth-child(5)`).text()
              )
            })
          })
          .catch((error) => console.log(error))
    }
  }

  function clearInput(element, error) {
    error.remove()
    element.css('margin-bottom', '0px')
    element.val('')
  }

  function inputNewData(datas) {
    let error = false
    if (datas[0] === '') {
      showError('Kamu tidak memasukkan apapun.')
      error = true
    } else {
      let dataNumber = 0,
          lastIndex = datas.length - 1
      datas.every((data) => {
        let jenisSurat, bulan, tahun, perihal
        const message = 'Masukkan data dengan benar!'
        if (
            (data.match(new RegExp('/', 'g')) || []).length !== 5 ||
            !data.includes('(') ||
            !data.includes(')')
        ) {
          showError(message)
          error = true
          return false
        } else {
          const dataContent = data.split('/')
          let number = 0
          dataContent.every((content) => {
            if (content === '' && !error) {
              showError(message)
              error = true
              return false
            } else if (!error) {
              switch (number) {
                case 1:
                  jenisSurat = content
                  break
                case 4:
                  bulan = toDecimal(content)
                  break
                case 5:
                  tahun = parseInt(content.slice(0, 4))
                  break
              }
              number++
              return number < 6 ? true : false
            }
          })
          if (error) return false
          let dataPerihal = data.slice(data.indexOf('(') + 1, -1)
          perihal = dataPerihal
          const sendData = new XMLHttpRequest()
          sendData.open('POST', `${mainUrl}/nomor-surat`, false)
          sendData.setRequestHeader('Content-Type', 'application/json')
          sendData.send(
              JSON.stringify({
                jenisSurat,
                perihal,
                link: '',
                bulan,
                tahun,
                withDate: false,
              })
          )
          if (dataNumber === lastIndex) location.reload()
          dataNumber++
          return true
        }
      })
    }
    if (!error) {
      clearInput($('#input-new'))
      $('#input-new-dialog').modal('hide')
    }
  }

  function showError(message) {
    const error = document.createElement('p')
    error.style.color = 'red'
    error.innerText = message
    error.id = 'error-link'
    if ($('#error-link').length) shakeElement($('#error-link'))
    else {
      $('#input-new-container').append(error)
      $('#error-link').css('margin-bottom', '0')
      $('#input-new').css('margin-bottom', '5px')
    }
  }

  function editLetter(date, pengirim, jenis, perihal, link) {
    const id = localStorage.getItem('id')
    let valid = true
    let dateArray = date.split(' ')
    dateArray[0] = dateArray[0] === '' ? 0 : parseInt(dateArray[0])
    if (
        dateArray.length !== 3 ||
        dateArray[0] > 31 ||
        dateArray[0] < 0 ||
        monthName.indexOf(dateArray[1]) === -1 ||
        dateArray[2].length !== 4
    ) {
      const error = document.createElement('p')
      error.innerText = 'Masukkan tanggal dengan benar'
      error.style.color = 'red'
      error.id = 'error-date'
      if ($('#error-date').length) shakeElement($('#error-date'))
      else {
        $('#date-container').append(error)
        $('#date-container > .mt-1').css('margin-bottom', '5px')
      }
      valid = false
    } else {
      $('#error-date').remove()
      $('#date-container > .mt-1').css('margin-bottom', '0px')
    }
    if (perihal.length > 100) {
      const error = document.createElement('p')
      error.innerText = 'Jumlah maksimal adalah 100 huruf.'
      error.style.color = 'red'
      error.id = 'error-edit-perihal'
      if ($('#error-edit-perihal').length)
        shakeElement($('#error-edit-perihal'))
      else {
        $('#perihal-edit-container').append(error)
        $('#perihal-edit').css('margin-bottom', '5px')
      }
      valid = false
    } else {
      $('#error-edit-perihal').remove()
      $('#perihal-edit').css('margin-bottom', '0px')
    }
    if (link.length > 500 || isLinkBroken(link)) {
      const error = document.createElement('p')
      error.innerText = isLinkBroken(link)
          ? 'Masukkan link yang benar.'
          : 'Jumlah maksimal adalah 500 huruf.'
      error.style.color = 'red'
      error.id = 'error-edit-link'
      if ($('#error-edit-link').length) shakeElement($('#error-edit-link'))
      else {
        $('#link-edit-container').append(error)
        $('#edit-link').css('margin-bottom', '5px')
      }
      valid = false
    } else {
      $('#error-edit-link').remove()
      $('#edit-link').css('margin-bottom', '0px')
    }
    if (valid) {
      fetch(`${mainUrl}/nomor-surat/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jenis: jenisSurat[jenis - 1],
          pengirim,
          perihal,
          link,
          tanggal: dateArray[0],
          bulan: monthName.indexOf(dateArray[1]) + 1,
          tahun: dateArray[2],
        }),
      })
      $(`tr:nth-child(${id}) > td:nth-child(2)`).text(date)
      $(`tr:nth-child(${id}) > td:nth-child(3)`).text(pengirim)
      $(`tr:nth-child(${id}) > td:nth-child(4)`).text(
          jenisSuratKepanjangan[jenis - 1]
      )
      $(`tr:nth-child(${id}) > td:nth-child(6)`).text(perihal)
      $(`tr:nth-child(${id}) > td:last-child`).empty()
      $(`tr:nth-child(${id}) > td:last-child`).append(linkButton(link, id))
      $('#edit-dialog').modal('hide')
      $(`#edit-${id}`).click(() => edit(id))
      $(`#delete-${id}`).click(() => {
        localStorage.setItem('id', id)
        $('#delete-nomor-surat-body').text(
            $(`tr:nth-child(${id}) > td:nth-child(5)`).text()
        )
      })
    }
  }

  function search() {
    const search = $('#search').val()
    if (search.length > 0) {
      $.ajax({
        url: `${mainUrl}/nomor-surat?search=${search}`,
        success: showLetterNumber,
      })
      Cookies.set('search', search, { expires: 1 })
    } else {
      $.ajax({
        url: `${mainUrl}/nomor-surat`,
        success: showLetterNumber,
      })
      Cookies.set('search', '')
    }
  }

  function isLinkBroken(link) {
    return !link.startsWith('http') && link.length !== 0 && !link.contains('://')
  }

  function edit(id) {
    $('#date').val($(`tr:nth-child(${id}) > td:nth-child(2)`).text())
    $(
        `#jenis-surat-edit > option:nth-child(${
            jenisSuratKepanjangan.indexOf(
                $(`tr:nth-child(${id}) > td:nth-child(4)`).text()
            ) + 1
        })`
    ).prop('selected', true)
    $('#perihal-edit').val(
        $(`tr:nth-child(${id}) > td:nth-child(6)`).text()
    )
    if (
        $.contains(
            $(`tr:nth-child(${id}) > td:last-child`).get(0),
            $('a').get(0)
        )
    )
      $('#link-edit').val(
          $(`tr:nth-child(${id}) > td:nth-child(7) > a`).attr('href')
      )
    localStorage.setItem('id', id)
  }
})