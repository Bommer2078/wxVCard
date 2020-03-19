<template>
    <view class="venue-item" @click="handleItemClick">
        <image :src="venueData.banner[0]"/>
        <view class="venue-info">
            <view class="venue-title">{{venueData.name}}</view>
            <view class="venue-summray">{{venueData.remark}}</view>
            <view class="created-time">{{venueData.created_time}}}</view>
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
        width: 720rpx;
        padding: 20rpx;
        font-size: 0;
        image {
            width:150rpx;
            height:150rpx;
            border-radius:8rpx;
            margin-right: 19rpx;
        }
        .venue-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .venue-title {
                font-size:30px;
                font-family:PingFang SC;
                font-weight:700;
                color:rgba(0,0,0,1);
                margin-bottom: 20rpx;
            }
            .venue-summray {
                font-size:24px;
                font-family:PingFang SC;
                font-weight:400;
                color:rgba(102,102,102,1);
            }
            .created-time {
                font-size:22px;
                font-family:PingFang SC;
                font-weight:400;
                margin-top: auto;
                margin-bottom: 2rpx;
                color:rgba(102,102,102,1);
            }
        }
    }
</style>