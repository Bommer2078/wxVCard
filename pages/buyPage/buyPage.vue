<template>
    <view class="buy-page">
        <view class="container-cover">
            <view 
                class="specs" 
                v-for="(item,index) in specsArr" 
                :key="index" 
                :class="{'active-item':skuId === item.id}"
                @click="choseItem(item)">
                <view class="specs-title">
                    {{item.name}}
                    <view class="specs-tip">
                        场馆特惠
                    </view>
                </view>
                <view class="price">
                    ￥{{item.price | priceText}}
                </view>
            </view>
            <view class="exchange-btn" @click="gotoExchange">兑换码/优惠券</view>
            <view class="open-btn" @click="handlePay">立即开通</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            specsArr: [{
                name: '一个月',
                price: 1000,
                id: 1
            },{
                name: '三个月',
                price: 3000,
                id: 2
            },{
                name: '十二个月',
                price: 12000,
                id: 3
            }],
            skuId: 1
        }
    },
    filters: {
        priceText(price) {
            return (price/100).toFixed(1)
        }
    },
    methods: {
        choseItem (item) {
            this.skuId = item.id
        },
        gotoExchange () {
            uni.navigateTo({
                url: '/pages/exchangePage/exchangePage'
            })
        },
        handlePay () {

        }
    },
}
</script>

<style lang="scss">
    .buy-page {
        display: flex;
        width: 100%;
        height: 100vh;
        padding: 15rpx 15rpx 0;
        background: #F3F3F3;
        .container-cover {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 1075rpx;
            padding-top: 25rpx;
            background: #fff;
            .specs {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 696rpx;
                height: 105rpx;
                color: #727272;
                border-radius: 10rpx;
                margin-bottom: 40rpx;
                border:1px solid rgba(193,193,193,1);
                .specs-title {
                    display: flex;
                    font-weight: 700;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 32rpx;
                    margin-left: 30rpx;
                    .specs-tip {
                        width: 80rpx;
                        height: 24rpx;
                        color: #666;
                        font-size: 18rpx;
                        font-weight: 400;
                        line-height: 24rpx;
                        text-align: center;
                        border-radius: 12rpx;
                        margin-left: 16rpx;
                        border: 1px solid #D4D4D4;
                    }
                }
                .price {
                    font-size: 30rpx;
                    margin-right: 18rpx;
                }
            }
            .active-item {
                border: 2px solid #FF3276;
                .specs-title {
                    color: #FF3276;
                }
                .price {
                    color: #FF3276;
                }
            }
            .exchange-btn {                
                width: 696rpx;
                height: 105rpx;
                position: relative;
                font-weight: 700;
                color: #727272;
                line-height: 105rpx;
                background: #F1F1F1;
                border-radius: 10rpx;
                font-size: 32rpx;
                padding-left: 30rpx;
                margin-bottom: 160rpx;
                &::after {
                    content: '';
                    position: absolute;
                    top: 40rpx;
                    right: 20rpx;
                    width: 20rpx;
                    height: 20rpx;
                    border: 1px solid;
                    transform: rotate(45deg);
                    border-color: #727272 #727272 transparent transparent;
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
    }
</style>