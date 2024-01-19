import tableData from './views/table-data.js'
import monthName from './data/month.js'
import nomorSurat from "./data/nomor-surat.js"
import toRoman from './data/roman-numerals.js'
import linkButton from './views/open-link.js'
import jenisSurat from "./data/jenis-surat.js"
import toDecimal from './data/to-decimal.js'
import jenisSuratKepanjangan from './data/jenis-surat-kepanjangan.js'

const mainUrl = 'https://aplikasi-nomor-surat-osis.vercel.app'

jQuery(function ($) {
    !document.cookie.startsWith('loggedIn=true') ? $('#login-dialog').modal('show') : ''

    $('#login').click(() => login($('#username').val(), $('#password').val()))

    $('#create-new').click(() => createNewLetter($('#pengirim option:selected').text(), $('#jenis-surat').val(), $('#perihal').val(), $('#link').val()))

    $('#create-link').click(() => inputLink($('#link-2').val()))

    $('#delete-all').click(() => deleteAll())

    $('#input-new-btn').click(() => inputNewData($('#input-new').val().split('\n')))

    const createLinkDialog = document.getElementById('create-link-dialog')
    createLinkDialog.addEventListener('hidden.bs.modal', _ => clearInput($('#link-2')))

    const inputNewDialog = document.getElementById('input-new-dialog')
    inputNewDialog.addEventListener('hidden.bs.modal', _ => clearInput($('#input-new')))

    $.ajax({
        url: `${mainUrl}/nomor-surat`,
        success: showLetterNumber
    })

    function login(username, password) {
        if (username == 'osis' && password == 'admin123') {
            const date = new Date()
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000))
            document.cookie = `loggedIn=true; expires=${date.toUTCString()};`
            $('#login-dialog').modal('hide')
        } else {
            const error = document.createElement('p')
            error.innerText = username == '' || password == '' ? 'Masukkan Username/Password dengan benar.' : 'Username/Password yang dimasukkan salah.'
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
        data[0].payload.forEach(data => {
            const { id, tanggal, bulan, tahun, pengirim, jenis_surat, perihal, link } = data
            const finalDate = `${tanggal == 0 ? '' : tanggal} ${monthName[bulan - 1]} ${tahun}`
            $('#table-content').append(tableData(id, finalDate, pengirim, jenisSuratKepanjangan[jenisSurat.indexOf(jenis_surat)], nomorSurat(id, jenis_surat, pengirim, 'XIV', toRoman(bulan), tahun), perihal, linkButton(link, id)))
        })
        if (!data[0].payload.length)
            $('#empty-table').append(`<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#input-new-dialog">Masukkan Data Yang Sudah Ada</button>`)
        else $('#empty-table').empty()
    }

    function copyToClipboard() {
        console.log('test')
    }

    function createNewLetter(pengirim, jenis, perihalNullable, linkNullable) {
        $('#empty-table').empty()
        const perihal = perihalNullable || '', link = linkNullable || ''
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
        if (link.length > 500 || (!link.startsWith('http') && link.length != 0)) {
            const error = document.createElement('p')
            error.innerText = !link.startsWith('http') ? 'Masukkan link yang benar.' : 'Jumlah maksimal adalah 500 huruf.'
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

        if (valid == 2) {
            fetch(
                `${mainUrl}/nomor-surat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jenisSurat: jenisSurat[jenis - 1],
                    pengirim,
                    perihal,
                    link
                })
            }).then(response => response.json()).then(response => {
                const date = new Date()
                const finalDate = `${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`
                const id = response[0].payload.id
                $('#table-content').append(tableData(id, finalDate, pengirim, jenisSuratKepanjangan[jenis - 1], nomorSurat(response[0].payload.id, jenisSurat[jenis - 1], pengirim, 'XIV', toRoman(date.getMonth() + 1), date.getFullYear()), perihal, linkButton(link, id)))
                $('#create-new-dialog').modal('hide')
            }).catch(error => console.log(error))
        }

    }

    function inputLink(link) {
        if (link.length > 500 || (!link.startsWith('http') && link.length != 0) || link == '') {
            const error = document.createElement('p')
            error.style.color = 'red'
            error.id = 'error-link'
            if ($('#error-link').length) {
                if (link == '') {
                    $('#error-link').text('Inputan link kosong.')
                } else if (!link.startsWith('http')) {
                    $('#error-link').text('Masukkan link yang benar.')
                } else {
                    $('#error-link').text('Jumlah maksimal adalah 500 huruf.')
                }
                shakeElement($('#error-link'))
            }
            else {
                if (link == '') {
                    error.innerText = 'Inputan link kosong.'
                } else if (!link.startsWith('http')) {
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link
                })
            }).then(response => response.json()).then(response => {
                $(`#link-table-${id}`).empty()
                $(`#link-table-${id}`).append(linkButton(link, id))
                $('#create-link-dialog').modal('hide')
            }).catch(error => console.log(error))
        }
    }

    function clearInput(element) {
        $('#error-link').remove()
        element.css('margin-bottom', '0px')
        element.val('')
    }

    function deleteAll() {
        fetch(`${mainUrl}/nomor-surat`, {
            method: 'DELETE',
        }).catch(error => console.log(error))
        $('#delete-all-dialog').modal('hide')
        $('#table-content').empty()
        $('#empty-table').empty()
        $('#empty-table').append(`<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#input-new-dialog">Masukkan Data Yang Sudah Ada</button>`)
    }

    function inputNewData(datas) {
        let error = false
        if (datas[0] == '') {
            showError('Kamu tidak memasukkan apapun.')
            error = true
        } else {
            let dataNumber = 0, lastIndex = datas.length - 1
            datas.every(data => {
                let jenisSurat, bulan, tahun, perihal
                const message = 'Masukkan data dengan benar!'
                console.log('oy')
                if ((data.match(new RegExp("/", "g")) || []).length != 5 || !data.includes('(') || !data.includes(')')) {
                    showError(message)
                    error = true
                    return false
                } else {
                    const dataContent = data.split('/')
                    let number = 0
                    dataContent.every(content => {
                        if (content == '' && !error) {
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
                    fetch(`${mainUrl}/nomor-surat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            jenisSurat,
                            perihal,
                            link: '',
                            bulan,
                            tahun,
                            withDate: false
                        })
                    })
                    // if (dataNumber == lastIndex) location.reload()
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
})