<template>
    <view class="card-detail">
        <view class="navigator-title">权益卡详情</view>
        <template v-if="vCardData">            
            <image src="/static/mycard/cardBg1.png" class="bg-imgs"/>
            <view class="vCard-info-cover">
                <!-- <swiper class="swiper" 
                    :indicator-dots="false" 
                    :autoplay="true" 
                    :interval="5000" 
                    :duration="500"
                    :circular="true"
                    @change="handleBannerChange"
                    next-margin="100rpx">
                    <swiper-item v-for="(item,index) in vCardData.banner" :key="item">
                        <view class="swiper-item" @click="handleImgClick(index)">
                            <image 
                                :src="item" 
                                class="swiper-imgs" 
                                :class="{'scale-img': index !== currentBannerIndex}"/>
                        </view>
                    </swiper-item>
                </swiper>                 -->
                <!-- <view class="indicator-dots" >
                    <view 
                        class="dots" 
                        :class="{'dot-active':index === currentBannerIndex }"
                        v-for="(item,index) in vCardData.banner" :key="index"></view>
                </view> -->
                <!-- <image class="vCard-banner" src="/static/mycard/cardBg1.png" /> -->
                <div class="vCard-banner card-cover">                         
                    <text class="location-name">长沙</text>
                    <text class="user-name">{{userInfo.nickname}}</text>
                    <text class="due-date" v-if="vipCardObj">{{vipCardObj.due_date | timeText}}</text>
                    <text class="due-date" v-else>未激活</text>
                    <image class="user-header" :src="userInfo.avatar">                    
                    <image src="/static/mycard/locationIcon.png" class="location-icon"/>                  
                    <image src="/static/mycard/vipIcon.png" class="vip-icon"/>                 
                    <image src="/static/mycard/cardBg1.png" class="bg-icon" />
                </div>
                <view class="vCard-summray-cover">                    
                    <view class="vCard-title">{{vCardData.name}}</view>
                    <view class="vCard-info">
                        <view class="vCard-summray">{{venueText}}</view>
                        <view class="price-info">
                            <text style="margin-bottom: 20rpx;">当前权益价</text> 
                            <view>
                                <text class="price-unit">￥</text>
                                <text class="price-num">{{vCardData.sku_arr[0].price/100}}</text>
                            </view>                            
                        </view>
                    </view>
                </view>
            </view>
        </template>
        <view class="info-content">            
            <view class="content-name">
                <img src="/static/rules.svg" class="list-icon">
                <view class="content-name-text">
                    权益介绍
                </view>
            </view>
            <view class="content-body" >                
                <rich-text :nodes="processImg(vCardData)"></rich-text>
            </view>
        </view>
        <view class="pay-btn">
            <view class="left-part">{{payText}}</view>
            <view class="right-part" @click="gotoPay">{{ vCardData.sell_type === 1 ? '去支付' : '直接领取' }}</view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    created() {
        this.$nextTick(() => {            
            this.getVcardData()
        })
    },
    onLoad (option) {
        this.vCardId = option.id || this.vCardBaseInfo.id
    },
    data() {
        return {
            vCardData: null,
            vCardId: '',
            currentBannerIndex: 0,
            myCardArr: [],
            vipCardObj: null // 用户是否激活过当前卡
        }
    },    
    filters: {
        timeText (val) {
            if (val.day + val.sec + val.hour + val.min === 0) {
                return '权益已过期'
            }
            let now = new Date().getTime()
            let str = val.day * 8.64e7 +   val.hour * 3.6e6 + val.min * 6e4 + val.sec * 1000
            let thenT = new Date(str + now)
            let temp = `${thenT.getFullYear()}-${thenT.getMonth() + 1}-${thenT.getDate()}`
            return `${temp}到期`
        }
    },
    computed: {
         ...mapState(['vCardBaseInfo','userInfo']),
        venueText () {
            if (!this.vCardData) {
                return '暂无优惠场馆'
            }
            let arr = JSON.parse(JSON.stringify(this.vCardData.venue_arr))
            let arr1 = arr.splice(0, 3)
            let arr2 = arr1.map(item => {
                return item.name
            })
            let str = arr2.join(';')
            return `可享受${str}等${this.vCardData.venue_arr.length}家场馆的优惠权益`
        },
        payText () {
            if (!this.vCardData) {
                return '获取中。。。'
            }
            let type = this.vCardData.sell_type
            if (type === 1) {
                let name = this.vCardData.sku_arr[0].name
                let price = this.vCardData.sku_arr[0].price
                return `${name}${price/100}元`
            } else {
                return '免费'
            }
        }
    },    
    onShow() {
        this.getMyCard()
    },
    methods: {        
        handleBannerChange (e) {
            this.currentBannerIndex = e.detail.current
        },
        handleImgClick (index) {
            const current = this.vCardData.banner[index]
                wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: this.vCardData.banner // 需要预览的图片http链接列表
            })
        },
        async getVcardData () {
            let params = {
                id: this.vCardId 
            }
            const res = await this.$api.getCardDetail(params)
            if (res.code === 0) {
                this.vCardData = res.data
                this.$store.commit('SET_TICKET_OBJ',res.data)
            }
        },
        processImg (obj) {
            if (!obj) return
            let val = obj.remark
            return val.replace(/\<img/g, '<img style="max-width:100%;height:auto" ')
        },
        gotoPay () {
            if (this.vCardData.sell_type === 1) {
                uni.navigateTo({
                    url: `/pages/buyPage/buyPage?id=${this.vCardId}`
                });
            }
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
                this.checkVipStatus()
            }
        },  
        checkVipStatus () {
            let temp = this.myCardArr.find(item => {
                return item.id === this.vCardId
            })
            this.vipCardObj = temp || null
        }
    },
}
</script>


<style lang="scss">
.card-detail {
    position: relative;
    width: 100%;
    padding-top: 720rpx;
    min-height:100vh;
    background: #F3F3F3;
    .navigator-title {
        position: absolute;
        width: 100%;
        font-size: 32rpx;
        text-align: center;
        top: 60rpx;
        color: #fff;
        z-index: 2;
    }
    .bg-imgs {
        position: absolute;
        top: -40rpx;
        width: 100%;
        height: 630rpx;
        filter: blur(20px);
        z-index: 1;
    }
    .vCard-info-cover {    
        position: absolute;
        top: 140rpx;
        left: 50%;
        margin-left: -360rpx;
        width: 720rpx;
        height:551rpx;
        display: flex;
        flex-direction: column; 
        align-items: center;   
        padding-top: 30rpx;
        padding-bottom: 30rpx;
        border-radius:20rpx;
        background: #fff;
        z-index: 2;
        .swiper {
            width: 100%;
            height: 335rpx;
            .swiper-item {
                background: #fff;
                padding-left: 20rpx;
                padding-right: 20rpx;
                .swiper-imgs {
                    width:600rpx;
                    height:310rpx;
                    border-radius:20rpx;
                }
                .scale-img {
                    transform: scale(0.9);
                }
            }
        }
        .indicator-dots {  
            margin-top: -10rpx;
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
        .vCard-banner {
            display: inline-block;
            width: 680rpx;
            height: 351rpx;
            border-radius: 20rpx;
        }
        .vCard-summray-cover {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-left: 25rpx;
            padding-right: 25rpx;
            font-size: 0rpx;
            .vCard-title {
                font-size: 36rpx;
                font-weight: 700;
                margin-bottom: 19rpx;
            }
            .vCard-info {
                display: flex;
                width: 100%;
                height: 52rpx;
                flex-direction: row;
                justify-content: space-between;
                font-size: 0rpx;
                color:#9D9D9D;
                .vCard-summray {
                    max-width: 358rpx;
                    font-size: 24rpx;
                }
                .price-info {
                    font-size: 24rpx;
                    color: #232323;
                    .price-unit {
                        font-size:32rpx;
                    }
                    .price-num {
                        font-size:42rpx;color:#FF3276;font-style:italic;font-weight:700;
                    }
                }
            }                
        }
    }
    .info-content {
        width: 720rpx;
        margin: 0 auto;
        background: #fff;
        border-radius:20rpx;
        margin-bottom: 20rpx;
        .route-detail {        
            padding-bottom: 15rpx;
        }
        .route-row {
            margin-left: 25rpx;
            font-size: 12px;
            color: #888;
        }
        .content-body /deep/ img {
            max-width: 550rpx !important;
        }
        .content-body {
            padding-left: 25rpx;
            padding-right: 25rpx;
        }
        .content-name {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 20rpx;
            padding-left: 12px;
            padding-top: 10rpx;
            .content-name-text {
                position: relative;
                font-size: 32rpx;
            }
            .location-icon {
                margin-right: 10rpx;
                width: 32rpx;
                height: 50rpx;
            }
            .list-icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 10rpx;
            }
        }
    }    
    .pay-btn {
        display: flex;
        align-items: center;
        position: fixed;
        bottom: 60rpx;
        left: 50%;
        width: 590rpx;
        height: 80rpx;
        font-size: 0;
        overflow: hidden;
        margin-left: -295rpx;
        border-radius:20px 35px 35px 20px;
        .left-part {
            font-size: 30rpx;
            width: 450rpx;
            line-height: 80rpx;
            color: #fff;
            background: #292929;
            padding-left: 20rpx;
        }
        .right-part {
            width: 140rpx;
            font-size: 30rpx;
            line-height: 80rpx;
            background: #FF3276;
            color: #fff;
            text-align: center;
            border-radius:0px 35px 35px 0px;
        }
    }
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
        width: 680rpx;
        height: 351rpx;
        border-radius:27rpx;
    }
}
</style>
