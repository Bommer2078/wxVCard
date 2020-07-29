<template>
    <view class="venue-item" @click="handleItemClick">
        <image :src="venueData.banner[0]" class="venue-item-img"/>
        <view class="venue-info">
            <view class="venue-title">{{venueData.name}}</view>
            <view class="venue-summray">{{venueData.introduce}}</view>
            <view class="created-time">{{venueData.create_at}}</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        venueData: {
            type: Object,
            require: true
        }
    },
    methods: {
        handleItemClick () {
            wx.navigateTo({
                url: `/pages/venueDetail/venueDetail?id=${this.venueData.id}`
            })
        }
    }
}
</script>

<style lang="scss">
    .venue-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 720rpx;
        padding: 20rpx;
        font-size: 0;
        background: #fff;
        border-radius:8rpx;
        .venue-item-img {
            width:150rpx;
            height:150rpx;
            border-radius:8rpx;
            margin-right: 19rpx;
            flex-shrink: 0;
        }
        .venue-info {
            display: flex;
            flex-direction: column;
            height: 150rpx;
            align-items: flex-start;
            justify-content: flex-start;
            .venue-title {
                font-size:30rpx;
                font-family:PingFang SC;
                font-weight:700;
                color:rgba(0,0,0,1);
                margin-bottom: 20rpx;
            }
            .venue-summray {
                font-size:24rpx;
                font-family:PingFang SC;
                font-weight:400;
                color:rgba(102,102,102,1);
                max-height: 60rpx;
                overflow: hidden;
            }
            .created-time {
                font-size:22rpx;
                font-family:PingFang SC;
                font-weight:400;
                margin-top: auto;
                margin-bottom: 2rpx;
                color:rgba(102,102,102,1);
            }
        }
    }
</style>