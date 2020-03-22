<template>
    <view class="recode-list">
        <view class="recode-item-cover" v-for="(item,index) in venueArr" :key="index">
            <view class="recode-time">2020.02.22 20:45</view>
            <venue-item :venue-data="item"></venue-item>  
            <view class="venue-split"></view>  
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
                city_id: this.locationObj.id
            }
            const res = await this.$api.getVenueList(params)
            if (res.code === 0) {
                this.venueArr = res.data.data
            }
        }
    }
}
</script>

<style lang="scss">
.recode-list {
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
    }
}
</style>