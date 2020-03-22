<template>
    <view class="more-page">
        <venue-item v-for="(item,index) in venueArr" :key="index" :venue-data="item"></venue-item>
    </view>
</template>

<script>
import venueItem from '../../components/venueItem.vue'
import { mapState } from 'vuex'
export default {
    components: {
        venueItem
    },
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
    .more-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100vh;
        padding-top: 10rpx;
        background: #F5F2F5;
        .venue-item  {
            margin-bottom: 20rpx;
        }
    }
</style>