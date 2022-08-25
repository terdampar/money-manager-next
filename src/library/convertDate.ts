function convertDate(date: Date) {
    date = new Date(date);
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
    const tanggal = date.getDate() + ' ' + bulan[date.getMonth()] + ' ' + date.getFullYear()
    return String(tanggal)
}
function convertDateFull(date: Date) {
    date = new Date(date);
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']
    const tanggal = date.getDate() + ' ' + bulan[date.getMonth()] + ' ' + date.getFullYear()
    const waktu = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '.' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

    return String(tanggal + ' ' + waktu)
}
export { convertDate, convertDateFull }