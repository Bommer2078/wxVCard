<template>
    <view class="buy-page">
        <view class="container-cover">
            <view class="specs" v-for="(item,index) in specsArr" :key="index">
                <view class="specs-title">
                    {{item.name}}
                    <view class="specs-tip">
                        场馆特惠
                    </view>
                </view>
                <view class="price">
                    ￥{{(item.price/100).toFixed(2)}}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            specsArr: [{
                name: '一个月',
                price: 1000
            }]
        }
    }
}
</script>