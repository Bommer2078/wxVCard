<template>
    <view class="content">
        <view class="ticket-banner">
            <view class="ticket-container">
                <view class="header">
                    <view>                      
                        <text class="city-name">{{locationObj.name}}</text>
                        <text class="city-tip">可享受6家场馆权益</text>
                    </view>
                    <view>                        
                        <text class="welcome-tip">{{userInfo.nickName}},早上好!</text> 
                    </view>
                </view>
                <view class="search-container" @click="gotoSearchPage">
                    <view class="search-input">快来输入点什么～</view>
                </view>
                <view class="banner" @click="intoTicket">
                    <img :src="vCardBaseInfo.banner ? vCardBaseInfo.banner[0] : ''">
                </view>
            </view>            
        </view>
        <view class="mian-container">
            <view class="item-container" v-if="venueArr.length > 0">
                <view class="tip"  @click="gotoMoreVenue">
                    <view class="title">
                        <text>本期精选场馆</text>
                    </view>
                    <view class="more">
                        更多 >
                    </view>
                </view>
                <view class="card" v-for="item in venueArr" :key='item' @click="intoVenueDetail(item)">
                    <img :src="item.photo" >
                    <view class="card-tip">
                        <view class="mask">                          
                        </view>
                        <view style="z-index: 5;">{{item.name}}</view>
                        <view style="z-index: 5;">{{item | rulesText}}</view>
                    </view>
                </view>
            </view>
        </view>        
    </view>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
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
                    yearTicketId: this.vCardBaseInfo.id,
                    pageNum: 1,
                    pageSize: 10,
                }                
                const res = await this.$api.getVenueList(params)
                if (res.code === '0') {
                    this.venueArr = res.data.list
                }
            },
            async getVenueTypeList() {
                const res = await this.$api.getVenueTypeList()
                if (res.code === '0') {
                    this.$store.commit('SET_VENUE_TYPE_ARR',res.data)
                }
            },
            gotoSearchPage () {
                uni.navigateTo({
                    url: '/pages/searchPage/searchPage'
                })
            },
            intoVenueDetail(item) {                
                let tempStr = this.$options.filters['rulesText'](item)
                uni.navigateTo({
                    url: `/pages/venueDetail/venueDetail?id=${item.id}&str=${tempStr}`
                })
            },
            intoTicket () {
                uni.switchTab({
                    url: `/pages/ticket/ticket`
                })
            },
            gotoMoreVenue () {
                uni.navigateTo({                
                    url: '../venueList/venueList'
                })
            },
        },
    }
</script>

<style lang="scss">
.content {
    width: 100%;
    color: #353535;
    .ticket-banner {
        position: relative;
        width: 100%;
        height: 454rpx;
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
            .banner {
                width: 93%;
                height: 310rpx;
                background: #F6F6F6;
                border-radius: 6px;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 310rpx;
                }
            }
            .search-container {
                width: 100%;
                padding-left: 14rpx;
                padding-right: 14rpx;
                padding-top: 10rpx; 
                height: 60rpx;
                margin-bottom: 29rpx;    
                background: #fff;                
                .search-input {
                    width: 100%;
                    height: 60rpx;
                    background: #fff;
                    border-radius: 4px;
                    color:#B0B0B0;
                    font-size: 12px;
                    line-height: 60rpx;
                    padding-left: 10px;
                }
            }
        }
        .mian-container {    
            width: 100%;
            z-index: 1;
            position: absolute;
            .item-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-left: 14rpx;
                padding-right: 14rpx;
                border-bottom: 2px solid #F6F6F6;
                .tip {   
                    width: 100%; 
                    display: flex;
                    flex-direction: row;
                    padding-top: 30rpx;
                    padding-bottom: 30rpx;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10rpx;
                    .title {
                        width: 100px;
                        height: 16px;
                        position: relative;
                        font-size: 16px;
                        font-weight: 700;
                        flex-shrink: 0;
                        &::before {
                            position: absolute;
                            top: 16px;
                            left: 12px;
                            content: '';
                            width: 40px;
                            height: 6px;
                            background: #FFCC00;
                            border-radius: 3px;
                            z-index: 2;
                        }
                        &::after {
                            position: absolute;    
                            top: 20px;
                            left: 16px;
                            content: '';
                            width: 30px;
                            height: 6px;
                            background: #FFEA98;
                            border-radius: 3px;
                            z-index: 1;
                        }
                        .more {
                            font-size: 12px;
                            color: #B0B0B0;
                        }
                        text {
                            position: absolute;
                            z-index: 3;
                        }
                    }
                }
                .card {
                    position: relative;
                    width: 100%;
                    height: 350rpx;
                    background: #F6F6F6;
                    border-radius: 12px;
                    margin-bottom: 10px;
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 350rpx;
                    }
                     .card-tip{
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        position: absolute;
                        bottom: 0;
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
            }
        }
    }
}
</style>
