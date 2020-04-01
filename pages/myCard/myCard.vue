<template>
    <view class="my-card">
        <swiper 
            class="swiper" 
            :indicator-dots="true" 
            :autoplay="false" 
            :interval="5000" 
            :duration="500"
            :circular="true"
            next-margin="80rpx"
            previous-margin="80rpx"            
            @change="handleBannerChange">
            <swiper-item v-for="(item,index) in myCardArr" :key="item">
                <view class="swiper-item">
                    <image 
                        :src="vCardBaseInfo.banner[0]"
                        :class="{'scale-img': index !== currentBannerIndex}"/>
                </view>
            </swiper-item>
        </swiper>
        <view class="my-card-container">
            <view class="part-container">                
                <view class="part-title">                    
                    <img src="/static/rules.svg" class="list-icon">
                    <text>{{currentCard.name}}</text> 
                    <text>{{currentCard | dueDateText}}</text>
                </view>
                <view class="part-body QR-part">
                    <img src="/static/qrCover.svg" class="qr-cover" @click="showQR">
                    <view class="qr-tip">点击上方图标，出示权益卡二维码</view> </view>
            </view>
            <view class="part-container">                
                <view class="part-title">
                    <img src="/static/rules.svg" class="list-icon">
                    <text>使用规则</text> 
                </view>
                <view class="part-body">                    
                    <text>1.xxxxxxxx</text>
                    <text>1.xxxxxxxx</text>
                    <text>1.xxxxxxxx</text>
                    <text>1.xxxxxxxx</text>
                    <text>1.xxxxxxxx</text>
                    <text>1.xxxxxxxx</text>
                </view>
            </view>
        </view>
        <view class="QR-container" v-if="showQRBox">   
            <view class="mask"></view>       
            <view class="container">
                <tki-qrcode size="400" unit="upx" background="transparent" :onval="true" @result="getQRBack" :val="QRStr"  ref="qrcode"></tki-qrcode>
                <view class="QR-warning">请向场馆工作人员出示该二维码</view>
                <view class="QR-warning">并保持该页面不要关闭</view>
            </view>  
        </view>
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
            loopCount: 0
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
        this.getMyCard()
    },
    onHide() {
        if (this.showQRBox) {   
            this.showQRBox = false         
            this.$http.abort()
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
        showQR () {            
            this.creatQrcode()
            this.showQRBox = true                 
            this.startLoopFn(this.currentCard.id)
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
            let str = {card_id: this.currentCard.id,user_id: this.userInfo.id}
            this.QRStr = JSON.stringify(str)
        },
        async startLoopFn (id) {
            this.loopCount++
            if (this.loopCount >= 12) {     
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
                this.startLoopFn(id)
            } else {
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
            let paySign = `appId=wx2016b1a490fe007c&nonceStr=${obj.nonce_str}&package=prepay_id=${obj.prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=X69wh8eS7GRTLvvJzBzfEFEwiKkilfWf`
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
    .my-card {
        min-height: 100vh;
        background: #F5F2F5;
        .swiper {
            height: 411rpx;
            .swiper-item {
               padding-left: 20rpx;
               padding-right: 20rpx;
               padding-top: 20rpx;
                image {
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
            opacity: .5;
            z-index: 10;
        }
        .container {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 600rpx;
            height: 600rpx;
            position: fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin: auto;
            background: #fff;
            z-index: 11;
            border-radius: 10rpx;
            padding-top: 40rpx;
        }
        .QR-warning {
            margin-top:10rpx;
        }
    }
</style>