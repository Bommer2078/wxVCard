<template>
    <view class="city-page">
        <view class="city-grid-cover">            
            <view 
                class="city-item" 
                :class="{'active': locationObj && locationObj.id === item.id}" 
                v-for="item in cityArr" 
                :key="item.id"
                @click="choseCity(item)">
                {{ item.name }}
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'city',
    data() {
        return {
            cityArr: [{
                id:1,
                name:'北京城区'
            },{
                id:2,
                name:'北京城区'
            },{
                id:3,
                name:'北京城区'
            },{
                id:4,
                name:'北京城区'
            },{
                id:5,
                name:'北京城区'
            },{
                id:6,
                name:'北京城区'
            }]
        }
    },
    computed: {
        ...mapState(['locationObj'])
    },
    created() {
        this.getCityList()
    },
    methods: {
        choseCity (obj) {
            this.$store.commit('SET_LOCATION_OBJ',obj)            
            uni.redirectTo({
                url: '/pages/main/main'
            })
        },
        async getCityList () {
            let params = {
                pageSize: 100
            }
            const res = await this.$api.getPlaceList(params)
            if (res.code === 0) {
                this.cityArr = res.data.data
            }
        }
    },
}
</script>

<style lang="scss">
    .city-page {
        width: 100%;
        height: 100vh;
        padding: 20rpx;
        background: #F3F3F3;
        .city-grid-cover {            
            display: grid;
            grid-template-columns: repeat(4,20%);
            grid-column-gap: 7%;
            grid-row-gap: 20rpx;
            .city-item {
                position: relative;
                max-width: 138rpx;
                height: 90rpx;
                line-height: 90rpx;
                text-align: center;
                font-size: 26rpx;
                background: #fff;
                &.active::before {                    
                    border-color: transparent transparent transparent #FF3276;
                }
                &::before {
                    content: '';
                    position: absolute;
                    top: -8rpx;
                    left: -8rpx;
                    width: 0;
                    height: 0;
                    border: 10rpx solid;
                    border-color: transparent transparent transparent #C1C1C1;
                    transform: rotate(-135deg);
                }
            }
        }
    }
</style>