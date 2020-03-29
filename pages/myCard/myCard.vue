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
                    <image src="" mode="" />
                    <text>二维码</text> 
                </view>
                <view class="part-body QR-part">
                    <tki-qrcode size="250" unit="upx" background="transparent" :onval="true" @result="getQRBack" :val="QRStr"  ref="qrcode"></tki-qrcode>
                </view>
            </view>
            <view class="part-container">                
                <view class="part-title">
                    <image src="" mode="" />
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
    </view>
</template>

<script>
import { mapState } from 'vuex'
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
            currentTime: ''
        }
    },
    onShow() {
        this.getMyCard()
        this.creatQrcode()
    },
    watch: {
        currentTime() {                  
            this.changeQR()
        }
    },
    computed: {
        ...mapState(['vCardBaseInfo','userInfo'])
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
                this.creatQrcode()
            }
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
            let code = 111
            let obj = {
                code
            }
            this.QRStr = JSON.stringify(obj)
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
                     width: 22rpx;
                     height: 24rpx;
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
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 290rpx;
            }
        }
    }
</style>