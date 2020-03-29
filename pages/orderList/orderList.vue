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
                <view class="order-item">
                    <view class="city-name">                        
                        <text class="name">长沙</text>
                    </view>
                    <view class="order-info">
                        <view class="order-title">
                            <image src=""/>
                            <view class="order-name">乐吧小镇</view>
                        </view>
                        <view class="order-time-price">
                            <view class="order-time">购买时间：2019.01.12</view>
                            <view class="order-price">
                                <text class="unit">￥</text>
                                <text class="price">246.00</text>
                            </view>
                        </view>
                        <view class="order-state">
                            已支付
                        </view>
                    </view>
                </view>
            </view>
        </template>
        <template v-if="currentTab === 'vcard'">            
            <view class="order-list-container">
                <view class="order-item">
                    <view class="city-name">
                        <text class="name">长沙</text>
                        <text class="state">已支付</text>
                    </view>
                    <view class="order-info">
                        <view class="order-title">
                            <image src=""/>
                            <view class="order-name">乐吧小镇</view>
                        </view>
                        <view class="order-sku-price">
                            <view class="order-sku">规格名称</view>
                            <view class="order-price">
                                <text class="unit">￥</text>
                                <text class="price">246.00</text>
                            </view>
                        </view>                        
                        <view class="vcard-order-time">购买时间：2019.01.12</view>
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentTab: 'vcard'
        }
    },
    created() {
        this.getOrderList()
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
            if (res.data.code === 0) {
                console.log(res)
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
                    color: #7C7C7C;
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
    }
}    
</style>