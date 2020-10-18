<template>
    <button class="login-btn" type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="handleLogin">{{btnTxt}}</button>
</template>

<script>
export default {
    props: {
        btnTxt: {
            type: String,
            default: '微信用户快速登录'
        }
    },
    methods: {        
		handleLogin () {
			wx.login({
				success: (res) => {
					if (res.code) {
						let params = {
							code: res.code
						}
						//发起网络请求
						this.wxLogin(params)
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		},
		async wxLogin (params) {
			const res = await this.$api.login(params)				
			if (res.code === 0) {				          
                uni.setStorageSync('api_token',res.data.api_token)									
				this.getUserInfo(res.data.api_token)
			}
		},
		async getUserInfo (token) {
			wx.getSetting({
				success: (res) => {
					if (res.authSetting['scope.userInfo']) {
						wx.getUserInfo({
							success: (data) => {
								data.api_token = token
								this.saveUserInfo(data)
							}
						})
					} else {
						this.$tip.alertDialog('请允许登录授权')
					}
				}
			})
		},
		async saveUserInfo (params) {
			const res = await this.$api.saveUserInfo(params)
			if (res.code === 0) {
                this.$store.commit('SET_USER_INFO', res.data)
                this.$emit('saveUserInfoDone')
			}
		}
    },
}
</script>

<style lang="scss">    
    .login-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width:563rpx;
        height:80rpx;
        color: #fff;
        background:rgba(255,50,118,1) !important;
        border-radius:20rpx;
        margin-bottom: 180rpx;
    }
</style>