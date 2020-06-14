<template>
    <view class="order-list">
        <view class="order-tab">
            <view 
                class="tab-item" 
                :class="{'tab-item-active': currentTab === 'venue'}"
                @click="changeTabs('venue')">场馆订单</view>
            <view 
                class="tab-item" 
                :class="{'tab-item-active': currentTab === 'vcard'}"
                @click="changeTabs('vcard')">会员卡订单</view>
        </view>
        <template v-if="currentTab === 'venue'">            
            <view class="order-list-container">
                <view class="order-item" v-for="item in venueArr" :key="item.id">
                    <view class="city-name">                        
                        <text class="name">{{item.city.name}}</text>
                    </view>
                    <view class="order-info">
                        <view class="order-title">
                            <image src="/static/self/ticket.svg"/>
                            <view class="order-name">{{item.venue.name}}</view>
                        </view>
                        <view class="order-time-price">
                            <view class="order-time">下单时间：{{item.create_at}}</view>
                            <view class="order-price">
                                <text class="unit">￥</text>
                                <text class="price">{{item.price / 100}}</text>
                            </view>
                        </view>
                        <view class="order-state">
                            {{item.paid_state | payText}}
                        </view>
                    </view>
                </view>
                <view v-if="venueArr.length === 0" class="no-data">暂无数据</view>
            </view>
        </template>
        <template v-if="currentTab === 'vcard'">            
            <view class="order-list-container">
                <view class="order-item" v-for="item in cardList" :key="item.id">
                    <view class="city-name">
                        <text class="name">{{item.city.name}}</text>
                        <text class="state">{{item.paid_state | payText}}</text>
                    </view>
                    <view class="order-info">
                        <view class="order-title">
                            <image src="/static/self/ticket.svg"/>
                            <view class="order-name">{{item.card.name}}</view>
                        </view>
                        <view class="order-sku-price">
                            <view class="order-sku">{{item.card_sku.name}}</view>
                            <view class="order-price">
                                <text class="unit">￥</text>
                                <text class="price">{{item.price / 100}}</text>
                            </view>
                        </view>                        
                        <view class="vcard-order-time">下单时间：{{item.update_at || item.create_at}}</view>
                    </view>
                </view>                
                <view v-if="cardList.length === 0" class="no-data">暂无数据</view>
            </view>
        </template>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 'venue',
            cardList: [],
            venueArr: []
        }
    },
    created() {
        this.getOrderList()
    },
    filters: {
        //paid_state：支付状态，-1：支付失败，0：未支付，1：预支付，10：已支付
        payText (val) {
            let text = ''
            switch (val) {
                case -1:
                    text = '支付失败'
                    break;
                case 0:
                    text = '未支付'
                    break;
                case 1:
                    text = '预支付'
                    break;
                case 10:
                    text = '已支付'
                    break;            
                default:                    
                    text = '未支付'
                    break;
            }
            return text
        }
    },
    methods: {
        changeTabs (type) {
            this.currentTab = type
            this.getOrderList()
        },
        async getOrderList () {
            const params  = {
                page: 1,
                pageSize: 100,
                type: this.currentTab === 'venue' ? 0 : 1
            }
            const res = await this.$api.getOrderList(params)
            if (res.code === 0) {
                if (this.currentTab === 'venue') {
                    this.venueArr = res.data.data
                } else {                    
                    this.cardList = res.data.data
                }
            }
        }
    },
}
</script>

<style lang="scss">
.order-list {
    width: 100%;
    min-height: 100vh;
    background: #F3F3F3;
    .order-tab {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 60rpx;
        background: #fff;
        .tab-item {
            line-height: 60rpx;
            font-size: 28rpx;
            color: #767676;
        }
        .tab-item-active {
            position: relative;
            font-size: 32rpx;
            font-weight: 700;
            color: #000;
            &::after {
                content: '';
                bottom: 0;
                left: 50%;
                margin-left: -25rpx;
                position: absolute;
                width:50rpx;
                height:8rpx;
                background:rgba(255,50,118,1);
                border-radius:4rpx;
            }
        }
    }
    .order-list-container {
        padding: 20rpx 17rpx 0;
        .order-item {
            padding-left: 25rpx;
            padding-right: 18rpx;
            width: 100%;
            height: 240rpx;
            background:rgba(255,255,255,1);
            border-radius:27rpx;
            margin-bottom: 20rpx;
            box-shadow:3rpx 2rpx 15rpx 1rpx rgba(0,0,0,0.07);
            .city-name {
                height: 60rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                .name {
                    color: #000;
                    font-size: 30rpx;
                }
                .state {
                    color: #FF3276;
                    font-size: 28rpx;
                }
            }
            .order-info {
                .order-title {                    
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;                    
                    height: 66rpx;
                    image {
                        width: 41rpx;
                        height: 31rpx;
                        margin-right: 9rpx;
                    }
                    .order-name {
                        font-weight: 700;
                        font-size: 32rpx;
                        color: #000;
                    }
                }
                .order-time-price,.order-sku-price {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .order-sku {                                   
                        color: #000000;
                        font-size: 34rpx;
                    }
                    .order-time{                    
                        color: #000000;
                        font-size: 30rpx;
                    }
                    .order-price {
                        .unit {
                            font-weight: 700;
                            font-size: 46rpx;
                            margin-right: 20rpx;
                        }
                        .price {
                            font-weight: 400;
                            font-size: 42rpx;
                        }
                    }
                }
                .vcard-order-time{
                    color: #666;
                    font-size: 28rpx;
                }
                .order-state {
                    color: #7C7C7C;
                    font-size: 28rpx;
                }
            }
        }
        .no-data {
            width: 100%;
            text-align: center;
            margin-top: 30vh;
        }
    }
}    
</style>