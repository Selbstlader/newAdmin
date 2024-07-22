
const pageSizeInfo = (pn: any, tn: any, ps?: number) => {
        let tbparam: any = {}
        let param: any = {}
        if (!localStorage.getItem('pageSizeInfo')) { // 缓存没有写入
            tbparam[tn] = 50
            param[pn] = tbparam
            localStorage.setItem('pageSizeInfo', JSON.stringify(param))
        } else {
            let pageSizeInfo = localStorage.getItem('pageSizeInfo')
            param = pageSizeInfo ? JSON.parse(pageSizeInfo) : {}
            tbparam = { ...param[pn] }
            if (!ps && param[pn] && param[pn][tn]) return String(param[pn][tn])
            tbparam[tn] = ps ? ps : 10
            param[pn] = { ...tbparam }
            localStorage.setItem('pageSizeInfo', JSON.stringify(param))
        }
        
        return tbparam[tn]
    }
