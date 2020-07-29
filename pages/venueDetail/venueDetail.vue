<template>
    <view class="detail-page">
        <view class="navigator-title">场馆详情</view>
        <template v-if="venueData">            
            <image :src="venueData.banner[0]" class="bg-imgs"/>
            <view class="venue-info-cover">
                <swiper class="swiper" 
                    :indicator-dots="false" 
                    :autoplay="true" 
                    :interval="5000" 
                    :duration="500"
                    :circular="true"
                    @change="handleBannerChange"
                    next-margin="100rpx">
                    <swiper-item v-for="(item,index) in venueData.banner" :key="item">
                        <view class="swiper-item" @click="handleImgClick(index)">
                            <image 
                                :src="item" 
                                class="swiper-imgs" 
                                :class="{'scale-img': index !== currentBannerIndex}"/>
                        </view>
                    </swiper-item>
                </swiper>
                <view class="indicator-dots" >
                    <view 
                        class="dots" 
                        :class="{'dot-active':index === currentBannerIndex }"
                        v-for="(item,index) in venueData.banner" :key="index"></view>
                </view>
                <view class="venue-summray">                    
                    <view class="venue-title">{{venueData.name}}</view>
                    <view class="venue-info1">
                        <view @click="gotoMap" class="venue-address">{{venueData.address}}></view>
                        <view>
                            <view class="phone-btn" @click="callPhone">
                                <image src="/static/phone.png"/>
                                <text>客服电话</text>
                            </view>
                            <text>原价：{{venueData.price/100}}元</text>
                        </view>
                    </view>
                    <view class="venue-info2">
                        <view>{{ venueData.business_hours }}</view>
                        <view class="price-info">
                            当前权益价 
                            <text class="price-unit">￥</text>
                            <text class="price-num">{{venueData.card_vunue.price/100}}</text>
                        </view>
                    </view>
                </view>
            </view>
        </template>
        <view class="info-content">   
            <view class="content-name">
                <img src="/static/trafc.svg" class="location-icon">
                <view class="content-name-text">
                    交通路线
                </view>
            </view>  
            <view class="route-detail">
                <view class="route-row" v-for="(item,index) in routeArr" :key="index">{{item}}</view>
            </view>
        </view>
        <view class="info-content">            
            <view class="content-name">
                <img src="/static/rules.svg" class="list-icon">
                <view class="content-name-text">
                    场馆介绍
                </view>
            </view>
            <view class="content-body" >                
                <rich-text :nodes="processImg(venueData)"></rich-text>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    created() {
        this.$nextTick(() => {            
            this.getVenueDetail()
        })
    },
    onLoad (option) {
        this.venueId = option.id
    },
    data() {
        return {
            venueData: null,
            venueId: '',
            phoneCall: '',
            currentBannerIndex: 0 
        }
    },
    computed: {
         ...mapState(['vCardBaseInfo']),
        routeArr() {
            if (this.venueData) {
                let arr = this.venueData.traffic_routes.split(/；|;/)
                return arr
            }
            return []            
        }
    },
    methods: {
        handleBannerChange (e) {
            this.currentBannerIndex = e.detail.current
        },
        handleImgClick (index) {
            const current = this.venueData.banner[index]
                wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: this.venueData.banner // 需要预览的图片http链接列表
            })
        },
        async getVenueDetail () {
            let params = {
                id: this.venueId,
                card_id: this.vCardBaseInfo.id
            }
            const res = await this.$api.getVenueDetail(params)
            if (res.code === 0) {
                this.venueData = res.data
                this.phoneCall = res.data.phone
            }
        },
        processImg (obj) {
            if (!obj) return
            let val = obj.remark
            return val.replace(/\<img/g, '<img style="max-width:100%;height:auto" ')
        },
        callPhone () {
            let phoneCall = [this.phoneCall]
            uni.showActionSheet({
                itemList: [phoneCall[0]],
                success: function (res) {
                    wx.makePhoneCall({
                        phoneNumber: phoneCall[res.tapIndex], //此号码并非真实电话号码，仅用于测试  
                        success: function () {
                            console.log("拨打电话成功！")
                        },
                        fail: function () {
                            console.log("拨打电话失败！")
                        }
                    })
                },
                fail: function (res) {
                    console.log(res.errMsg)
                }
            })
        },
        gotoMap () {
            let lng = this.venueData.longitude
            let lat = this.venueData.latitude
            let name = this.venueData.name

            uni.navigateTo({
                url: `../map/map?lng=${lng}&lat=${lat}&name=${name}`
            })
        }
    },
}
</script>

<style lang="scss">
.detail-page {
    position: relative;
    width: 100%;
    padding-top: 740rpx;
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
    .venue-info-cover {        
        position: absolute;
        top: 140rpx;
        left: 50%;
        margin-left: -360rpx;
        width: 720rpx;
        height:570rpx;
        padding-top: 40rpx;
        padding-bottom: 30rpx;
        border-radius:20rpx;
        background: #fff;
        z-index: 2;
        .swiper {
            height: 335rpx;
            .swiper-item {
                padding-left: 15rpx;
                padding-right: 15rpx;
                background: #fff;
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
        .venue-summray {
            display: flex;
            flex-direction: column;
            padding-left: 25rpx;
            padding-right: 25rpx;
            font-size: 0rpx;
            .venue-title {
                font-size: 36rpx;
                font-weight: 700;
                margin-bottom: 19rpx;
            }
            .venue-info1,.venue-info2 {
                display: flex;
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                font-size: 0rpx;
                color:#9D9D9D;
                view {
                    max-width: 358rpx;
                    font-size: 24rpx;
                }
            }
            .venue-address {
                max-height: 80rpx;
                overflow: hidden;
            }
            .venue-info1 {
                align-items: flex-start;
                margin-bottom: 4rpx;
                .phone-btn {
                    display: flex;
                    align-items: center;
                    image {
                        width: 21rpx;
                        height: 27rpx;
                        margin-right: 12rpx;
                    }
                }
            }
            .venue-info2 {
                align-items: flex-end;
                .price-info {
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
}
</style>