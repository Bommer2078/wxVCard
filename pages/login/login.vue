<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<view class="tip">登录后权益卡将为您更好的服务</view>
		</view>
		<view class="login-btn-part">
        	<login-btn btn-txt="微信用户快速登录" @saveUserInfoDone="saveUserInfoDone"></login-btn>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
import loginBtn from '../../components/loginBtn'
export default {
	name: 'login',
	data() {
		return {
			title: 'Hi~ 请 登 录',
		}
	},	
	components: {
		loginBtn
	},
	onShow() {		
		if (wx.canIUse('hideHomeButton')) {
			wx.hideHomeButton()
		}
	},
    computed: {
        ...mapState(['locationObj'])
    },
	methods: {								
		handleCheckBoxClick () {
			this.agreeGetLocationInfo = !this.agreeGetLocationInfo
		},
		saveUserInfoDone () {			
			uni.switchTab({
				url: '/pages/main/main'
			})
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
		}
	}	
</style>
