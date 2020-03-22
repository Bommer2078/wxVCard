<template>
    <view class="search-page">
        <view class="search-cover">
            <input 
                type="search" 
                class="search-input" 
                placeholder="请输入关键词"
                v-model.trim="searchContent" 
                @enter="handleSearch">
            <view class="search-btn" @click="handleSearch">搜索</view>
        </view>
        <!-- <template v-if="recodeArr.length > 0">             -->
            <view class="clear-row">
                <image src="/static/close.svg" />
                <text @click="clearAllRecode">清空所有记录</text>
            </view>
            <view class="recode-items-group">
                <view 
                    class="recode-item" 
                    v-for="(item,index) in recodeArr" 
                    :key="index"
                    @click="handleRecodeClick(item)">{{item}}</view>
            </view>
        <!-- </template> -->
        <template v-if="venueArr.length > 0">
            <view class="venue-list">
                <venue-item v-for="(item,index) in venueArr" :key="index" :venue-data="item"></venue-item>
            </view>           
        </template>
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
            searchContent: '',
            recodeArr: uni.getStorageSync('recodeArr') || [],
            venueArr: []
        }
    },
    computed: {
        ...mapState(['locationObj'])
    },
    methods: {
        handleSearch () {
            if (!this.searchContent) {
                this.getArrData()
                return
            }
            this.setRecode()
            this.getArrData()
        },
        handleRecodeClick (item) {
            this.searchContent = item
            this.handleSearch()
        },
        setRecode () {
            let index = this.recodeArr.findIndex(i => {
                return i === this.searchContent
            })
            let recodeArr = JSON.parse(JSON.stringify(this.recodeArr))
            if (index >= 0) {
                let item = recodeArr.splice(index,1)
                recodeArr.unshift(item[0])
            } else {
                if (recodeArr.length > 4) {                    
                    recodeArr.pop()
                }
                recodeArr.unshift(this.searchContent)
            }
            this.recodeArr = recodeArr
            uni.setStorageSync('recodeArr', recodeArr)
        },
        async getArrData () {
            let params = {
                page: 1,
                pageSize: 100,
                city_id: this.locationObj.id,
                search: this.searchContent
            }
            const res = await this.$api.getVenueList(params)
            if (res.code === 0) {
                this.venueArr = res.data.data
            }
        },
        clearAllRecode () {
            this.recodeArr = []
            uni.removeStorageSync('recodeArr')
        }
    }
}
</script>

<style lang="scss">
.search-page {
    width: 100%;
    height: 100vh;
    background: #F5F2F5;
    .search-cover {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100rpx;
        font-size: 0;
        background: #fff;
        padding-left: 50rpx;
        padding-right: 50rpx;
        .search-input {
            padding-left: 20rpx;
            width: 550rpx;
            height: 40rpx;
            background: #F1F1F1;
            font-size: 22rpx;
            margin-right: 26rpx;
        }
        .search-btn {
            width:72rpx;
            height:50rpx;
            line-height:50rpx;
            text-align: center;
            font-size: 24rpx;
            color: #fff;
            background:rgba(255,50,74,1);
            border-radius:7rpx;
        }
    }
    .clear-row {
        font-size: 0;
        height: 55rpx;
        line-height: 55rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        image {
            width: 24rpx;
            height: 24rpx;
            margin-right: 10rpx;
        }
        text {
            color: #6F6F6F;
            font-size: 22rpx;
            margin-right: 15rpx;
        }
    }
    .recode-items-group {
        display: flex;
        flex-direction: row;
        padding-left: 30rpx;
        flex-wrap: wrap;
        .recode-item {
            padding: 10rpx 16rpx;
            background: #fff;
            margin-right: 30rpx;            
            margin-bottom: 30rpx;
        }
    }
    .venue-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        .venue-item {
            margin-bottom: 20rpx;
        }
    }
}
</style>