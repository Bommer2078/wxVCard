<template>
    <view class="user-content">
        <view class="navegation-title">个人中心</view>
        <view class="user-banner">
            <img class="bg" src="/static/bannerBg.png">
            <view class="user-bottom"></view>
            <view class="user-container">
                <view class="user-header"  v-if="userInfo">
                    <img :src="userInfo.avatar">
                    <view class="info">
                        <text>欢迎，</text>
                        <text class="tip">{{userInfo ? userInfo.nickname : '游客'}}</text>
                    </view>
                </view>
                <view class="user-header"  v-else>
                    <view class="no-login info" @click="gotoLogin">
                        <text>游客，请登录</text>
                    </view>
                </view>
                <view class="user-body">
                    <view class="item" @click="intoMyCard">
                        <img src="/static/self/ticket.svg">
                        <text class="lable">我的权益卡</text>
                        <view class="icon-arrow"></view>
                    </view>
                    <view class="item" @click="intoRecodeList">
                        <img src="/static/self/foot.svg">
                        <text class="lable">我的足迹</text>
                        <view class="icon-arrow"></view>
                    </view>
                </view>
                <view class="user-body">
                    <view class="item" @click="intoOrder">
                        <img src="/static/self/word.svg">
                        <text class="lable">我的订单</text>
                        <view class="icon-arrow"></view>
                    </view>
                    <view class="item" @click="intoBusiness" v-if="isBusiness">
                        <img src="/static/self/user.svg">
                        <text class="lable">我是商家</text>
                        <view class="icon-arrow"></view>
                    </view>
                </view>
                <view class="user-body user-body-end">
                    <view class="item" @tap="gotoExchangePage">
                        <img src="/static/self/edit.svg">
                        <text class="lable">兑换码/优惠券</text>
                        <view class="icon-arrow"></view>
                    </view>
                    <view class="item" @tap="showAbout">
                        <img src="/static/self/about.svg">
                        <text class="lable">关于</text>
                        <view class="icon-arrow"></view>
                    </view>
                </view>
            </view>            
        </view>
        <template v-if="showBox">            
            <view class="mask" @click="closeBox"></view>
            <view class="box" @click="closeBox">
                <view class="title">
                    关于
                </view>
                <view class="box-name">
                    <rich-text :nodes="aboutInfo"></rich-text>
                </view>
            </view>  
        </template>  
    </view>
</template>

<script>
import tip from '@/utils/tip'
import store from '@/store'
import { mapState } from 'vuex'
    export default {
        data() {
            return {
                showBox:false,
                aboutInfo: '',
                isBusiness: false
            }
        },
        onShow() {
            if (this.userInfo && this.userInfo.id) {   
                this.checkBusiness()
            }
        },
        computed: {
            ...mapState(['userInfo'])
        },
        methods: {
            intoOrder () {
                if (!this.goLogin()) return
                uni.navigateTo({
                    url: '/pages/orderList/orderList',
                });
            },
            intoMyCard () { 
                if (!this.goLogin()) return
				uni.switchTab({
					url: '/pages/myCard/myCard'
				})
            },
            intoRecodeList () {
                if (!this.goLogin()) return                		
				uni.navigateTo({
					url: '/pages/recodeList/recodeList'
				})
            },
            async getAbout () {
                let res = await this.$api.getAboutInfo()
                if (res.code === 0) {
                    this.aboutInfo = res.data.content
                }                
            },
            intoBusiness () {
                if (!this.goLogin()) return
                this.$store.commit('SET_ROLE_TYPE','business')
                uni.reLaunch({
                    url: '/pages/business/business'
                });
            },
            async checkBusiness () {                
                let res = await this.$api.checkBusiness().then((res) => {
                    if (res.code === 0) {
                        if (res.data.length > 0) {
                            this.isBusiness = true
                        }
                    }
                })
            },
            gotoExchangePage () {
                if (!this.goLogin()) return                
                uni.navigateTo({
                    url: `/pages/exchangePage/exchangePage`
                })
            },
            showAbout () {
                this.getAbout()
                this.showBox = true
            },
            closeBox () {
                this.showBox = false
            },
            gotoLogin () {                
                uni.navigateTo({
                    url: '/pages/login/login'
                })
            },
            goLogin () {
                if (this.userInfo) {
                    return true
                }
                tip.alertDialog('您还未登录，请登录后体验更多服务').then((val) => {
                    setTimeout(() => {                                
                        store.commit('SET_USER_INFO', null)
                        store.commit('SET_ROLE_TYPE', null)
                        uni.removeStorageSync('api_token')
                    },1000)
                    this.gotoLogin()
                })
            }            
        }
    }
</script>

<style>
.navegation-title {
    text-align: center;
    padding-top: 60rpx;
    color: #fff;
    background:#FF3177;
    height: 160rpx;
}
.user-content {
    width: 100%;
    min-height: 100vh;
    background: #F3F3F3;
}
.user-banner {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 500rpx;
    margin-bottom: 68rpx;
}
.user-banner .bg{
    position: absolute;
    top: 0;
    width: 100%;
}
.user-bottom {    
    position: absolute;
    top: 50rpx;
    width: 95%;
    height: 570rpx;
    border-radius: 8px;
    background: #F3F3F3;
    z-index: 1;
    box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
}
.user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50rpx;
    width: 95%;
    border-radius: 8px;
    z-index: 2;
}
.user-container .user-header {
    position: relative;
    width: 100%;
    height: 187rpx;
    padding-left: 100rpx;
    background: #fff;
    margin-bottom: 10rpx;
    border-radius: 8px 8px 0 0;
}
.user-header .info {
    position: absolute;
    top: 47rpx;
    left: 310rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.user-header .no-login {
    left: 40rpx;
}
.user-container .user-header image {
    position: absolute;
    top: -33rpx;
    width: 192rpx;
    height: 192rpx;
    left: 98rpx;
    border-radius: 27rpx;
}
.user-container .user-header text {
    font-weight: 700;
    font-size: 16px;
}
.user-container .info .tip {
    font-size: 12px;
    font-weight: 400;
    color: #5F5F5F;
    margin-top: 10px;
}

.user-body {
    width: 100%;
    background: #fff;
    padding-left: 22rpx;
    padding-right: 22rpx;
    margin-bottom: 10rpx;
    background: #fff;
}
.user-body .item {
    width: 100%;
    display: flex;
    align-items: center;
    height: 90rpx;
}
.item + .item {
    border-top: 1px solid #eee;
}
.user-body .item image {    
    width: 38rpx;
    height: 38rpx;
    margin-right: 20rpx;
}
.user-body .lable {
    font-size: 15px;
    color: #444343;
}
.user-body-end {
    border-radius: 0 0 8px 8px;
}
.icon-arrow {
    width: 16px;
    height: 16px;
    margin-left: auto;
    margin-right: 6px;
    border: 1px solid #38210B;
    transform: rotate(45deg);
    border-left: transparent;
    border-bottom: transparent;
}
.box {
        position: fixed;
        top: -50rpx;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto;
        width: 550rpx;
        max-height: 80vh;
        background: #fff;
        border-radius: 8px;
        box-shadow:3px 2px 15px 1px rgba(0,0,0,0.07);
        overflow: hidden;
        z-index: 4;
    }
    .box .title {
        width: 100%;
        height: 60rpx;
        text-align: center;
        margin-bottom: 10rpx;
        background: #FF3177;
    }
    .box .box-name {
        width: 100%;
        text-align: left;
        font-size: 13px;
        padding: 20rpx;
    }
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #888;
        opacity: .5;
        z-index: 3;
    }
</style>
