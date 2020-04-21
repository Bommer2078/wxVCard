<template>
    <view class="recode-list">
        <template v-if="venueArr.length > 0">            
            <view class="recode-item-cover" v-for="(item,index) in venueArr" :key="index">
                <img src="/static/self/foot.svg" class="recode-icon">
                <view class="recode-time">{{item.update_at}}</view>
                <venue-item :venue-data="item.venue"></venue-item>  
                <view class="venue-split"></view>  
            </view>
        </template>
        <view v-else class="no-data">
            暂无足迹
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import venueItem from '../../components/venueItem.vue'
export default {
    data () {
        return {
            venueArr: []
        }
    },
    created() {
        this.getArrData()
    },
    computed: {
        ...mapState(['locationObj'])
    },
    components: {
        venueItem
    },    
    methods: {
        async getArrData () {
            let params = {
                page: 1,
                pageSize: 100,
                type: 0,
                paid_state: 10
            }
            const res = await this.$api.getOrderList(params)
            if (res.code === 0) {
                this.venueArr = res.data.data
            }
        }
    }
}
</script>

<style lang="scss">
.recode-list {
    padding-top: 25rpx;
    width: 100%;
    min-height: 100vh;
    background: #F5F2F5;
    .recode-item-cover {
        position: relative;
        background: #fff;
        padding-left: 50rpx;
        padding-right: 20rpx;
        &::before {
            content: '';
            position: absolute;
            height: 220rpx;
            left: 35rpx;         
            width: 1px;
            background: #eee;
            height: 300rpx;
        }
        .recode-time {
            color: #FF7474;
            font-size: 28rpx;
            margin-left: 20rpx;
        }
        .venue-split {    
            margin-top: 20rpx;
            margin-left: 20rpx;        
            border-bottom: 1px solid #eee;
        }
        .recode-icon {
            position: absolute;
            left: 10rpx;
            top: -25rpx;
            width: 50rpx;
            height: 50rpx;
        }
    }
    .no-data {
        width: 100%;
        font-size: 32rpx;
        color: #333;
        margin-top: 40vh;
        text-align: center;
    }
}
</style>