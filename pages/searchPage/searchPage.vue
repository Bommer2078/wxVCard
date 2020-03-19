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
        <template v-if="recodeArr.length > 0">            
            <view class="clear-row">
                <image src="/static/close.svg" />
                <text>清空所有记录</text>
            </view>
            <view class="recode-items-group">
                <view 
                    class="recode-item" 
                    v-for="(item,index) in recodeArr" 
                    :key="index">{{item}}</view>
            </view>
        </template>
        <template v-if="venueArr.length > 0">
            <venue-item v-for="(item,index) in venueArr" :key="index" :venue-data="item"></venue-item>
        </template>
    </view>
</template>

<script>
import venueItem from '../../components/venueItem.vue'
export default {
    components: {
        venueItem
    },
    data () {
        return {
            searchContent: ''
        }
    },
    computed: {
        recodeArr() {
            const str = uni.getStorageSync('recodeArr')
            if (typeof str === 'Object') {
                return str
            }
            return []
        },
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
        setRecode () {
            let index = this.recodeArr.findIndex(i => {
                return i === this.searchContent
            })
            let recodeArr = this.recodeArr
            if (index >= 0) {
                let item = this.recodeArr.splice(index,1)
                recodeArr.unshift(item)
            } else {
                recodeArr.push(this.searchContent)
            }
            uni.setStorageSync('recodeArr', recodeArr)
        },
        getArrData () {

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
}
</style>