<template>
    <view class="my-card" :class="{'no-info' : !userInfo || !userInfo.id}">
        <template v-if="userInfo && userInfo.id">            
            <swiper 
                class="swiper" 
                :indicator-dots="false" 
                :autoplay="false" 
                :interval="5000" 
                :duration="500"
                :circular="true"
                next-margin="80rpx"
                previous-margin="80rpx"            
                @change="handleBannerChange">
                <swiper-item v-for="(item,index) in myCardArr" :key="item">
                    <view class="swiper-item">
                        <div :class="{'scale-img': index !== currentBannerIndex}" class="card-cover"  @click="showQR(index)">                         
                            <text class="location-name">长沙</text>
                            <text class="user-name">{{userInfo.nickname}}</text>
                            <text class="due-date">{{timeText(item.due_date)}}</text>
                            <image class="user-header" :src="userInfo.avatar">                    
                            <image src="/static/mycard/locationIcon.png" class="location-icon">                    
                            <image src="/static/mycard/QRIcon.png" class="QR-icon">                     
                            <image src="/static/mycard/vipIcon.png" class="vip-icon">                     
                            <image 
                                class="bg-icon"
                                v-if="index % 3 === 0"
                                src="/static/mycard/cardBg1.png"/>
                            <image 
                                class="bg-icon"
                                v-if="index % 3 === 1"
                                src="/static/mycard/cardBg2.png"/>
                            <image 
                                class="bg-icon"
                                v-if="index % 3 === 2"
                                src="/static/mycard/cardBg3.png"/>
                        </div>
                    </view>
                </swiper-item>    
            </swiper>        
            <view class="indicator-dots" v-show="myCardArr.length > 1">
                <view 
                    class="dots" 
                    :class="{'dot-active':index === currentBannerIndex }"
                    v-for="(item,index) in myCardArr" :key="index"></view>
            </view>
            <view class="card-tip">请点击卡片生成二维码，并出示给场馆工作人员</view>
            <view class="my-card-container" v-if="false">
                <!-- <view class="part-container">                
                    <view class="part-title">                    
                        <img src="/static/rules.svg" class="list-icon">
                        <text>{{currentCard.name}}</text> 
                        <text>{{currentCard | dueDateText}}</text>
                    </view>
                    <view class="part-body QR-part">
                        <img src="/static/qrCover.svg" class="qr-cover" @click="showQR">
                        <view class="qr-tip">点击上方图标，出示权益卡二维码</view> </view>
                </view> -->
                <view class="part-container">                
                    <view class="part-title">
                        <img src="/static/rules.svg" class="list-icon">
                        <text>权益介绍</text> 
                    </view>
                    <view class="part-body">                    
                        <rich-text :nodes="processImg"></rich-text>
                    </view>
                </view>
            </view>
            <view class="QR-container" v-if="showQRBox">   
                <view class="mask"></view>       
                <view class="container">                
                    <img src="/static/close.svg" @click="closeQR" class="close-icon">
                    <tki-qrcode size="400" unit="upx" background="transparent" :onval="true" @result="getQRBack" :val="QRStr"  ref="qrcode"></tki-qrcode>
                    <view class="QR-warning">
                        <view>请向场馆工作人员出示该二维码</view>
                        <view>并保持该页面不要关闭</view>
                    </view>
                </view>  
            </view>
        </template>        
        <template v-else>
            <div class="card-tip">
                游客您好，请登录后查看
            </div>            
            <view class="open-btn" @click="gotoLogin">跳转登录页</view>
        </template>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import md5 from '../../libs/md5.min.js'
import tkiQrcode from "../../components/tki-qrcode"
export default { 
    components: {
        tkiQrcode
    },
    data () {
        return {
            currentBannerIndex: 0,
            myCardArr: [],
            QRStr: '',
            currentTime: '',
            showQRBox: false,
            loopCount: 0,
            abortHttp: false,
            currentCardStatus: 0 // 0 未激活， 1 会员，-1会员过期
        }
    },
    filters: {
        dueDateText (val) {
            let temp = val.due_date
            if (temp) {
                for (let k in temp) {
                    temp[k] > 0
                    return temp.day === 0 ? '即将到期' : `还有${temp.day}天到期`
                }
                return '已过期'
            }
        }
    },
    onShow() {
        if (this.userInfo && this.userInfo.id) {            
            this.getMyCard()
        }
    },
    onHide() {
        if (this.showQRBox) {   
            this.showQRBox = false         
            this.$http.abort()
            this.abortHttp = true
        }
    },
    watch: {
        currentTime() {                  
            this.changeQR()
        }
    },
    destroyed() {        
        if (this.showQRBox) {  
            this.$http.abort()
            this.abortHttp = true
        }
    },
    computed: {
        ...mapState(['vCardBaseInfo','userInfo']),
        currentCard () {
            if (this.myCardArr.length === 0) {
                return {}
            }
            return JSON.parse(JSON.stringify(this.myCardArr[this.currentBannerIndex])) 
        }
    },
    methods: {
        gotoLogin () {                
            uni.navigateTo({
                url: '/pages/login/login'
            })
        },
        processImg () {
            if (!this.currentCard) return
            console.log(this.currentCard)
            let val = this.currentCard.remark
            return val.replace(/\<img/g, '<img style="max-width:100%;height:auto" ')
        },        
        timeText (val) {
            if (val.day + val.sec + val.hour + val.min === 0) {
                this.currentCardStatus = -1
                return '权益已过期'
            }
            this.currentCardStatus = 1
            let now = new Date().getTime()
            let str = val.day * 8.64e7 +   val.hour * 3.6e6 + val.min * 6e4 + val.sec * 1000
            let thenT = new Date(str + now)
            let temp = `${thenT.getFullYear()}-${thenT.getMonth() + 1}-${thenT.getDate()}`
            return `${temp}到期`
        },
        async getMyCard() {
            const res = await this.$api.myCardList()
            if (res.code === 0) {
                let myCardArr = res.data.data
                if (myCardArr.length === 0) {                                     
                    this.$tip.alertDialog(
                        '还没有权益卡，快去加入吧',
                        '去购买').then(() => {
                            uni.navigateTo({
                                url: `/pages/buyPage/buyPage?id=${this.vCardBaseInfo.id}`
                            });
                        })
                    return
                }
                this.myCardArr = myCardArr
            }
        },  
        showQR (index) {
            if (this.currentBannerIndex === index) {                  
                if (this.currentCardStatus < 1) {
                    this.$tip.toast('会员已过期','none')
                    return
                }               
                this.creatQrcode()
                this.showQRBox = true                 
                this.abortHttp = false                 
                this.startLoopFn(this.currentCard.id)
            }          
        },
        closeQR () {            
            this.$tip.toast('取消出示','none')
            this.$http.abort()
            this.abortHttp = true
            this.showQRBox = false
        },
        getQRBack (res) {

        },    
        handleBannerChange (e) {
            this.currentBannerIndex = e.detail.current
        },           
        creatQrcode() {
            let temp = new Date()
            this.currentTime = new Date().getTime()
            this.$nextTick(() => {                    
                this.$refs.qrcode._makeCode()
            })
        },      
        changeQR () {   
            if (this.QRStr) {
                this.$refs.qrcode._clearCode()         
            }
            let nowTime = new Date().getTime()
            let str = {card_id: this.currentCard.id,user_id: this.userInfo.id,t:nowTime}
            this.QRStr = JSON.stringify(str)
        },
        async startLoopFn (id) {
            this.loopCount++
            if (this.loopCount >= 55) {     
                this.showQRBox = false    
                this.loopCount = 0       
                this.$tip.toast('支付超时','none')
                return
            }
            let params = {
                card_id: id
            }
            let res = await this.$api.loopPayOrder(params)
            if (res.code === 0) {               
                this.showQRBox = false  
                this.handleWxPay(res.data.order_id) 
            } else if (res.code === 100) {
                if (this.abortHttp) return
                setTimeout(() => {                  
                    this.startLoopFn(id)
                },1000)          
            } else if (res.code === 1) {
                this.showQRBox = false
                this.$tip.toast('核销成功！','none')
            } else {           
                this.showQRBox = false
                this.$tip.toast(res.msg,'none')
            }
        },
        async handleWxPay (id) {
            let pramas = {
                order_id: id
            }
            const res = await this.$api.wxPay(pramas)
            if (res.code === 0) {
                this.payConfirm(res.data)
            } else {  
                this.$tip.alertDialog(res.msg)           
            }
        },
        payConfirm (obj) {
            let timeStamp = new Date().getTime()
            let paySign = `appId=wx1e383d6c91e8432f&nonceStr=${obj.nonce_str}&package=prepay_id=${obj.prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=0cd82b0fa72de1948bfee7d277c42053`
            paySign = md5(paySign)
            let that = this
            uni.requestPayment({
                timeStamp: String(timeStamp),
                nonceStr: obj.nonce_str,
                package: `prepay_id=${obj.prepay_id}`,
                signType: 'MD5',
                paySign: paySign,
                success: function() {                    
                    that.$tip.alertDialog(
                        '支付成功，请跳转订单查看',
                        '好的','不用了').then(() => {
                            uni.redirectTo({
                                url: '/pages/orderList/orderList',
                            });
                        }).catch(() => {
                            uni.navigateBack()
                        }) 
                },
                fail: function(err) {                       
                    that.$tip.toast(`支付失败，请查看订单`,'none')                 
                    uni.navigateBack()
                }
            })
        }, 
    },
}
</script>

<style lang="scss">
.no-info{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}
    .my-card {
        min-height: 100vh;
        background: #F5F2F5;
        .swiper {
            height: 411rpx;
            padding-top: 20vh;
            .swiper-item {
               padding-left: 20rpx;
               padding-right: 20rpx;
               padding-top: 20rpx;
                .card-cover {
                    position: relative;                    
                    .location-name, .user-name, .due-date, .user-header, .location-icon, .QR-icon, .vip-icon{
                        position: absolute;
                    }
                    .location-name {
                        color: #fff;
                        font-size: 28rpx;
                        bottom: 16rpx;
                        right: 16rpx;
                    }
                    .user-name {
                        font-size: 22rpx;
                        color: #fff;
                        top: 32rpx;
                        left: 105rpx;
                    }
                    .due-date {
                        font-size: 24rpx;
                        color: #fff;
                        bottom: 24rpx;
                        left: 30rpx;
                    }
                    .user-header {
                        border-radius: 50%;
                        width: 76rpx;
                        height: 76rpx;
                        left: 20rpx;
                        top: 20rpx;
                    }
                    .location-icon {
                        bottom: 15rpx;
                        right: 70rpx;
                        width:26rpx;
                        height:26rpx;
                    }
                    .QR-icon {
                        right: 20rpx;                      
                        top: 20rpx; 
                        width:40rpx;
                        height:40rpx;
                    }
                    .vip-icon {               
                        left: 108rpx;                      
                        top: 71rpx;                      
                        width:20rpx;
                        height:20rpx;
                    }
                }
                .bg-icon {
                    width: 100%;
                    height: 325rpx;
                    margin-left:auto;
                    margin-right:auto;
                    border-radius:27rpx;
                }
                .scale-img {                    
                    transform: scale(0.9);
                }
            }
        }       
        .open-btn {
            width: 563rpx;
            height: 80rpx;
            color: #fff;
            font-size: 34rpx;
            line-height: 80rpx;
            text-align: center;
            border-radius:20px;
            background: #FF3276;
        }
    }    
    .indicator-dots {  
        position: relative;
        bottom: 40rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .dots + .dots {
            margin-left: 10rpx;
        }
        .dots {
            width: 12rpx;
            height: 8rpx;
            background: #CBCBCB;
            border-radius: 4rpx;
        }
        .dot-active {
            width: 22rpx;
            height: 8rpx;
            background: #2D2D2D;
        }
    }
    .card-tip {
        width: 100%;
        font-size: 24rpx;
        color: f3f3f3;
        text-align: center;
    }
    .my-card-container {
        padding-left: 14rpx;
        padding-right: 14rpx;
        .part-container {
            width: 100%;
            border-radius:20rpx;
            background: #fff;
            font-size: 0;
            margin-bottom: 40rpx;
            .part-title {
                height: 70rpx;
                width: 100%;
                display: flex;
                align-items: center;
                image {
                     width: 40rpx;
                     height: 42rpx;
                     margin-left: 38rpx;
                     margin-right: 9rpx;
                }
                text {
                    font-size: 32rpx;
                    color: #000;
                    font-weight: 700;
                }
            }
            .part-body {
                & > text {
                    padding-left: 38rpx;
                    display: block;
                    font-size: 24rpx;
                    color: #666666;
                }
            }            
            .QR-part {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 290rpx;
                .qr-tip {
                    font-size: 24rpx;
                    color: #353535;
                    text-align: center;
                    padding-bottom: 20rpx;
                }
            }
        }
        .qr-cover {
            width: 300rpx;
            height: 300rpx;
            margin-bottom: 10rpx;
        }
    }
    .QR-container {
        width: 100vw;
        height: 100vh;
        .mask {
            position: fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            background: #888;
            opacity: .7;
            z-index: 10;
        }
        .container {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 460rpx;
            height: 460rpx;
            position: fixed;
            top: -100rpx;
            left:0;
            right:0;
            bottom:0;
            margin: auto;
            background: #fff;
            z-index: 11;
            border-radius: 10rpx;
            padding-top: 30rpx;
            .close-icon {
                position: absolute;
                bottom: -120rpx;
                right: auto;
                left: auto;
                width: 68rpx;
                height: 68rpx;
            }
        }
        .QR-warning {
            position: absolute;
            top: -100rpx;
            text-align: center;
            view {
                font-size: 28rpx;
                color: #fff;
                margin-bottom: 10rpx;
            }
        }
    }
</style>