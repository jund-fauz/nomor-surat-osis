import loginDialog from "./views/login-dialog.js"
import tableData from './views/table-data.js'
import monthName from './data/month.js'
import nomorSurat from "./data/nomor-surat.js"
import toRoman from './data/roman-numerals.js'
import linkButton from './views/open-link.js'
import jenisSurat from "./data/jenis-surat.js"

const mainUrl = 'http://localhost:3000'

jQuery(function ($) {
    $('.container').append(loginDialog)

    !document.cookie.startsWith('loggedIn=true') ? $('#login-dialog').modal('show') : ''
    $('#create-new-dialog').modal('show')

    $('#login').click(() => login($('#username').val(), $('#password').val()))

    $('#create-new').click(() => createNewLetter($('#pengirim option:selected').text(), $('#jenis-surat').val(), $('#perihal').val(), $('#link').val()))

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
            const finalDate = `${tanggal} ${monthName[bulan - 1]} ${tahun}`

            $('#table-content').append(tableData(id, finalDate, pengirim, jenis_surat, nomorSurat(id, jenis_surat, pengirim, 'XIV', toRoman(bulan), tahun), perihal, linkButton(link)))
        })
    }

    function copyToClipboard() {
        console.log('test')
    }

    function createNewLetter(pengirim, jenis, perihal, link) {
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
                body: JSON.stringify({
                    jenisSurat: jenisSurat[jenis - 1],
                    pengirim,
                    perihal,
                    link
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then(response => response.json()).then(response => {
                console.log(response)
            })
            $('#create-new-dialog').modal('hide')
        }
    }
})