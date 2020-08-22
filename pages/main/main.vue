<template>
    <view class="content">
        <view class="ticket-banner">
            <view class="ticket-container">
                <view class="header">
                    <view>                      
                        <text class="city-name" @click="handleChoseCity">{{locationObj.name}}</text>
                        <text class="city-tip">可享受{{total}}家场馆权益</text>
                    </view>
                    <view>                        
                        <text class="welcome-tip">{{userInfo && userInfo.nickname || '游客'}},早上好!</text> 
                    </view>
                </view>
                <view class="search-container" @click="gotoSearchPage">
                    <view class="search-input">快来输入点什么～
                        <image src="../../static/search.svg" class="search-img">
                    </view>
                    <view class="search-btn">搜 索</view>
                </view>
                <view class="banner-cover" @click="intoVCard" v-if="vCardBaseInfo && vCardBaseInfo.banner && vCardBaseInfo.banner.length !== 1">    
                    <swiper 
                        class="swiper-cover" 
                        :indicator-dots="false" 
                        :autoplay="false" 
                        :interval="5000" 
                        :duration="500"
                        :circular="false"
                        next-margin="36rpx"
                        previous-margin="36rpx"            
                        @change="handleBannerChange">
                        <swiper-item v-for="(item,index) in vCardBaseInfo.banner" :key="item">
                            <view class="swiper-item">
                                <image 
                                    class="swiper-imgs"
                                    :src="item"
                                    :class="{'scale-img': index !== currentBannerIndex}"/>
                            </view>
                        </swiper-item>
                    </swiper>                                 
                    <view class="indicator-dots" v-show="vCardBaseInfo.banner.length > 1">
                        <view 
                            class="dots" 
                            :class="{'dot-active':index === currentBannerIndex }"
                            v-for="(item,index) in vCardBaseInfo.banner" :key="index"></view>
                    </view>  
                </view>                         
                <view class="banner-cover main-img" v-if="vCardBaseInfo.banner.length === 1" @click="intoVCard">
                    <img :src="vCardBaseInfo.banner ? vCardBaseInfo.banner[0] : ''">
                </view>
            </view>            
        </view>
        <view class="mian-container">
            <view class="item-container" v-if="venueArr.length > 0">
                <view class="tip"  @click="gotoMoreVenue">
                    <view class="title">
                        <text>场馆推荐</text>
                    </view>
                    <view class="more">
                        更多 >
                    </view>
                </view>
                <template v-for="item in venueArr" >                
                    <view class="card" @click="intoVenueDetail(item)" :key='item'>
                        <image :src="item.banner[0]" >
                        <view class="card-tip">
                            <view class="mask">                          
                            </view>
                            <view style="z-index: 5;">{{item.name}}</view>
                            <!-- <view style="z-index: 5;">{{item | rulesText}}</view> -->
                        </view>
                    </view>
                    <view class="border-split" :key='item'></view>
                </template>
            </view>
        </view>        
    </view>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                total: 0,
                venueArr: [],
                phoneCall :'4006099109',
                currentBannerIndex: 0
            }
        },
        computed: {
            ...mapState(['locationObj','vCardBaseInfo','venueTypeArr','roleType','userInfo'])
        },
        created() {            
            // uni.setEnableDebug({            
            //     enableDebug: true            
            // })
            this.initParams()
            // this.getVenueTypeList()
        },
        onShow() {                     
            // this.initGlobalData()    
        },
        methods: {       
            handleBannerChange (e) {
                this.currentBannerIndex = e.detail.current
            },
            initParams () {
                if (this.roleType === 'business') {
                    uni.reLaunch({
                        url: '/pages/business/business'
                    });
                    return
                }
                // if (!this.userInfo) {                				
                //     uni.redirectTo({
                //         url: '/pages/login/login'
                //     })
                //     return
                // }
                // 后期迭代开放多个城市后需要进行城市得选择
                // if (!this.locationObj) {                				
                //     uni.redirectTo({
                //         url: '/pages/city/city'
                //     })
                //     return
                // }
                // this.getVenueTypeList()
                this.initGlobalData()
            },
            async initGlobalData () { 
                // 后期迭代之后不在此页请求城市接口          
                const res1 = await this.$api.getPlaceList()
                const cityObj = res1.data.data[0]
                if (res1.code === 0) {
                    this.$store.commit('SET_LOCATION_OBJ',cityObj)
                }                     
                let params = {
                    id: cityObj.card_id
                }               
                const res2 = await this.$api.getCardDetail(params)
                if (res2.code === 0) {
                    this.$store.commit('SET_TICKET_OBJ',res2.data)
                }             
                this.getVenueData()
            },
            async getVenueData () {                       
                let params = {
                    city_id: this.locationObj.id,
                    page: 1,
                    pageSize: 10,
                }                
                const res = await this.$api.getVenueList(params)
                if (res.code === 0) {
                    this.venueArr = res.data.data
                    this.total = res.data.total
                }
            },
            async getVenueTypeList() {
                const res = await this.$api.getVenueTypeList()
                if (res.code === '0') {
                    this.$store.commit('SET_VENUE_TYPE_ARR',res.data)
                }
            },
            handleChoseCity () {                
                this.$tip.toast('暂未开放其它城市','none')
                // 后期迭代开放多个城市后需要开放这段代码
                // uni.navigateTo({
                //     url: '/pages/city/city'
                // })
            },
            gotoSearchPage () {
                uni.navigateTo({
                    url: '/pages/searchPage/searchPage'
                })
            },
            intoVenueDetail(item) {                
                uni.navigateTo({
                    url: `/pages/venueDetail/venueDetail?id=${item.id}`
                })
            },
            intoVCard () {
                uni.switchTab({
                    url: `/pages/cardDetail/cardDetail?id=${this.vCardBaseInfo.id}`
                })
            },
            gotoMoreVenue () {
                uni.navigateTo({                
                    url: '/pages/more/more'
                })
            }
        }
    }
</script>

<style lang="scss">
.content {
    width: 100%;
    background: #F7F7F7;
    color: #353535;
    .ticket-banner {
        position: relative;
        width: 100%;
        height: 510rpx;
        margin-bottom: 4px;
        .ticket-container {
            position: absolute;
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 100%;
            z-index: 1;
            .header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding-left: 24rpx;
                padding-right: 24rpx;
                height: 100rpx;
                font-size: 14px;
                font-weight: 400;
                background: #fff;
                view {
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    .city-name {
                        position: relative;
                        font-size: 34rpx;
                        font-weight: 700;
                        &::after {
                            content: '';
                            position: absolute;
                            top: 10rpx;
                            right: -30rpx;
                            width: 12rpx;
                            height: 12rpx;
                            transform: rotate(-45deg);
                            border: 4rpx solid;
                            border-color: transparent transparent #000 #000;
                        }
                    }
                    .city-tip {
                        font-size: 20rpx;
                        color: #909090;
                    }
                    .welcome-tip {
                        font-size: 30rpx;
                        font-weight: 700;
                    }
                }
            }
            .banner-cover {
                width: 100%;
                height: 360rpx;
                padding-top: 13rpx; 
                background: #fff;
                margin-bottom: 8rpx;
                .swiper-cover {
                    width: 100%;
                    height: 300rpx;
                }
                .swiper-item {                    
                    padding-left: 15rpx;
                    padding-right: 15rpx;
                    border-radius: 6px;
                    overflow: hidden;
                    .swiper-imgs {
                        width: 640rpx;
                        height: 300rpx;                        
                        border-radius:20rpx;
                    }
                }
                .indicator-dots {  
                    margin-top: 20rpx;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .dots + .dots {
                        margin-left: 10rpx;
                    }
                    .dots {
                        width:34rpx;
                        height:8rpx;
                        background:rgba(203,203,203,1);
                        border-radius:4rpx;
                    }
                    .dot-active {
                        width:42rpx;
                        height:10rpx;
                        background:rgba(45,45,45,1);
                        border-radius:5rpx;
                    }
                }
            }      
            .main-img image{
                display: block;
                width: 670rpx;
                height: 315rpx;
                border-radius: 14rpx;
                margin:0 auto;
            }      
            .search-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding-left: 24rpx;
                padding-right: 24rpx;
                height: 50rpx;   
                background: #fff;                
                .search-input {
                    position: relative;
                    width: 85%;
                    height: 50rpx;
                    background: #F4F1F1;
                    border-radius: 25rpx;
                    color:#B1B1B1;
                    font-size: 22rpx;
                    line-height: 50rpx;
                    padding-left: 48rpx;
                   .search-img {
                        position: absolute;
                        left: 15rpx;
                        top: 15rpx;
                        width: 22rpx;
                        height: 22rpx;
                    }
                }
                .search-btn {
                    width: 91rpx;
                    height: 50rpx;
                    font-size: 26rpx;
                    line-height: 50rpx;
                    text-align: center;
                    background: #FF3276;
                    color: #fff;
                    border-radius: 10rpx;
                }
            }
        }        
    }
    .mian-container {    
        width: 100%;
        z-index: 1;
        background: #fff;
        .item-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-left: 14rpx;
            padding-right: 14rpx;
            .tip {   
                width: 100%; 
                display: flex;
                flex-direction: row;
                padding-top: 30rpx;
                justify-content: space-between;
                align-items: center;
                .title {
                    width: 100px;
                    height: 16px;
                    position: relative;
                    font-size: 32rpx;
                    font-weight: 700;
                    flex-shrink: 0;
                    text {
                        position: absolute;
                        z-index: 3;
                    }
                }                
                .more {
                    font-size: 22rpx;
                    color: #FF3276;
                }
            }
            .card {
                position: relative;
                width: 100%;
                height: 350rpx;
                margin-top: 30rpx;
                margin-bottom: 30rpx;
                background: #fff;
                overflow: hidden;
                border-radius: 12px;
                image{
                    width: 100%;
                    // height: 350rpx;
                    border-radius: 12px;
                }
                    .card-tip{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: absolute;
                    bottom: 0rpx;
                    padding: 0;
                    padding-left: 30rpx;
                    padding-bottom: 10rpx;
                    margin: 0;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 13px;
                    color: #fff;
                    z-index: 1;
                    border-radius: 0 0 12px 12px;
                    .mask{
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        right: 1px;
                        background: #000;
                        opacity: .5;
                        background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
                        z-index: 1;
                    }
                }
            }
            .border-split {
                width: calc(100% + 28rpx);
                height: 4px;
                background: #F7F7F7;;
            }
        }
    }
}
</style>
