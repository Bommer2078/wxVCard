<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<view class="tip">登录后权益卡将为您更好的服务</view>
		</view>
		<view class="login-btn-part">
        	<button class="login-btn" type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="handleLogin">微信用户快速登录</button>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'login',
	data() {
		return {
			title: 'Hi~ 请 登 录',
		}
	},	
    computed: {
        ...mapState(['locationObj'])
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
								this.$store.commit('SET_USER_INFO', data.userInfo)
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
			// if (!this.locationObj) {				
			// 	uni.redirectTo({
			// 		url: '/pages/city/city'
			// 	})
			// } else {				
				uni.switchTab({
					url: '/pages/main/main'
				})
			// }
		},									
		handleCheckBoxClick () {
			this.agreeGetLocationInfo = !this.agreeGetLocationInfo
		}
	}
}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 118rpx;
		.logo {
			height: 200rpx;
			width: 200rpx;
			margin-left: auto;
			margin-right: auto;
			margin-bottom: 36rpx;
		}
		.text-area {
			display: flex;
			flex-direction: column;
			align-items: center;
			.title {
				font-size: 44rpx;
				font-weight: 700;
				color: #000;
				margin-bottom: 20rpx;
			}
			.tip {
				font-size: 30rpx;
			}
		}
		.login-btn-part {
			position: fixed;
			bottom: 0;
			.login-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width:563rpx;
				height:80rpx;
				color: #fff;
				background:rgba(255,50,118,1);
				border-radius:20rpx;
				margin-bottom: 180rpx;
			}
		}
	}	
</style>
