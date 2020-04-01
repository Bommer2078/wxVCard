import tip from '@/utils/tip'
import store from '@/store'
let baseUrl = 'http://hugo.lingqi100.cn/api'
let httpNum = 0;
let http = {
	post: "",
    get: ""
}; 
let requestTask = null 
let noLodingArr = ['/order/loop_pay_order','/order/admin_loop_order']
http.post = (api, data) => {  
    let header = {
        'Authorization': `Bearer ${uni.getStorageSync('api_token')}`,
        'isApplet': 'true'
    }
    if (httpNum <= 0 && noLodingArr.indexOf(api) < 0) {
        tip.loading();
    }
    httpNum++;
    return new Promise((resolve, reject) => {
        requestTask = uni.request({
            data:data,
            method:'post',
            url: baseUrl + api,
            header: {
                ...header
            },
            success: function (res) {
                httpNum--;
                if (httpNum <= 0) {
                    tip.loaded();
                }
                if(res.statusCode == 200) {
                    if(res.data.code == '401') {
                        tip.alertDialog('请重新登录').then((val) => {
                            setTimeout(() => {                                
                                store.commit('SET_USER_INFO', null)
                                store.commit('SET_ROLE_TYPE', null)
                                uni.removeStorageSync('api_token')
                            },1000)
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        })
                    } else {
                        resolve(res.data)
                    }
                } else {
                    tip.alertDialog(res.statusCode + '错误，请稍后再试')
                }
            },
            fail:function (err) {
                httpNum--;
                tip.loaded();
                reject(err)
            }
        })
    });
},
http.abort = () => {
    if (requestTask) {        
        requestTask.abort()
    }
}
http.get = (api, data) => {
    if (httpNum <= 0) {
        tip.loading()
    }
    httpNum++;
    return new Promise((resolve, reject) => {
        uni.request({
            data:data,
            method:'get',
            url: baseUrl + api,
            header: {  
                'Authorization': `Bearer ${uni.getStorageSync('api_token')}`,       
                'isApplet': 'true'
            },
            success: function (res) {
                httpNum--;
                if (httpNum <= 0) {
                    tip.loaded();
                }
                if(res.statusCode == 200) {
                    if(res.data.code == '401') {
                        tip.alertDialog('请重新登录').then((val) => {
                            store.commit('SET_USER_INFO', null)
                            store.commit('SET_ROLE_TYPE', null)
                            uni.removeStorageSync('api_token')
                            uni.navigateTo({
                                url: '/pages/login/login'
                            })
                        })
                    } else {                            
                        resolve(res.data)
                    }
                } else {
                    tip.alertDialog(res.statusCode + '错误，请稍后再试')
                }
            },
            fail:function (err) {
                httpNum--;
                tip.loaded();
                reject(err)
            }
        })
    });
}


export default http;