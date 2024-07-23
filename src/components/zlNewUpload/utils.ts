// https://blog.csdn.net/shunhua19881987/article/details/123638648
function downloadFile(content: any, filename: any) {
    var a = document.createElement('a')
    var blob = new Blob([content])
    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
}

function download(url: string, filename: string) {
    ajax(url, function (xhr: any) {

        downloadFile(xhr.response, filename)
    }, {
        responseType: 'blob'
    })
}

function ajax(url: any, callback: any, options: any) {
    window.URL = window.URL || window.webkitURL
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    if (options.responseType) {
        xhr.responseType = options.responseType
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr)
        }
    }
    xhr.send()
}

export { download }