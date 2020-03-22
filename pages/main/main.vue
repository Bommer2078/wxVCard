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
                        <text class="welcome-tip">{{userInfo.nickName}},早上好!</text> 
                    </view>
                </view>
                <view class="search-container" @click="gotoSearchPage">
                    <view class="search-input">快来输入点什么～
                        <image src="../../static/search.svg" class="search-img">
                    </view>
                    <view class="search-btn">搜 索</view>
                </view>
                <view class="banner-cover" @click="intoVCard">                    
                    <view class="banner">
                        <img :src="vCardBaseInfo.banner ? vCardBaseInfo.banner[0] : ''">
                    </view>
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
                        <img :src="item.banner[0]" >
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
                phoneCall :'4006099109'
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
            initParams () {
                if (this.roleType === 'business') {
                    uni.reLaunch({
                        url: '/pages/business/business'
                    });
                    return
                }
                if (!this.userInfo) {                				
                    uni.redirectTo({
                        url: '/pages/login/login'
                    })
                    return
                }
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
                if (!this.vCardBaseInfo.id) {    
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
                // uni.switchTab({
                uni.navigateTo({
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
        margin-bottom: 5px;
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
                .banner {
                    width: 85%;
                    height: 300rpx;
                    margin: 0 auto;
                    background: #F6F6F6;
                    border-radius: 6px;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 310rpx;
                    }
                }
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
                        top: 10rpx;
                        width: 30rpx;
                        height: 30rpx;
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
                    &::before {
                        position: absolute;
                        top: 16px;
                        left: 12px;
                        content: '';
                        width: 82rpx;
                        height: 6px;
                        background: #FF3276;
                        border-radius: 3px;
                        z-index: 2;
                    }
                    &::after {
                        position: absolute;    
                        top: 20px;
                        left: 24px;
                        content: '';
                        width: 60rpx;
                        height: 6px;
                        background: #FFA8C5;
                        border-radius: 3px;
                        z-index: 1;
                    }
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
                height: 410rpx;
                padding-top: 30rpx;
                padding-bottom: 30rpx;
                background: #fff;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 350rpx;
                    border-radius: 12px;
                }
                    .card-tip{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: absolute;
                    bottom: 30rpx;
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
                width: 100%;
                height: 6rpx;
                background: #F7F7F7;;
            }
        }
    }
}
</style>
