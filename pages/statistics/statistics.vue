<template>
    <view class="statistics-page">        
        <view class="search-cover">
            <input 
                type="search" 
                class="search-input" 
                placeholder="请输入用户名"
                v-model.trim="searchContent" 
                @enter="handleSearch">
            <view class="search-btn" @click="handleSearch">搜索</view>
        </view>        
        <picker mode="date" :value="date" start="2019-10-29" :end="endDate" @change="bindDateChange" class="date-select">
            <view class="uni-input">{{date}}</view>
        </picker>
        <view class="num-conf">今日使用权益用户数量：<text>33</text></view>
        <view class="num-conf">使用权益总量：<text>368</text></view>
        <view class="statistics-list">
            <view class="statistics-item">
                <image src=""/>
                <text class="user-name">用户名</text>
                <text class="created-time">2019-08-11 19:46</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data () {
        const currentDate = this.getDate()
        return {
            searchContent: '',       
            date: currentDate,
        }
    },
    computed: {
        endDate() {
            return this.getDate()
        }
    },
    methods: {  
        handleSearch () {

        },
        bindDateChange(e) {
            this.searchContent = ''
            this.date = e.target.value
            this.getStatisticsList(true)
        },
        getDate(type) {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (type === 'start') {
                year = year - 5;
            } else if (type === 'end') {
                year = year + 2;
            }
            month = month > 9 ? month : '0' + month;;
            day = day > 9 ? day : '0' + day;
            return `${year}-${month}-${day}`;
        },
        getStatisticsList () {

        }
    },
}
</script>

<style lang="scss">
.statistics-page {
    padding-left: 32rpx;
    padding-right: 32rpx;
    min-height: 100vh;
    background: #F3F3F3;
    .search-cover {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100rpx;
        font-size: 0;
        .search-input {
            padding-left: 20rpx;
            width: 550rpx;
            height: 40rpx;
            background: #fff;
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
    .date-select {
        text-align: center;
        font-size: 13px;
        color: #666666;
        width:230rpx;
        height:49rpx;
        background:rgba(255,255,255,1);
        border-radius:4px;
        margin-bottom: 28rpx;
    }
    .num-conf {
        font-size: 26rpx;
        color: #666666;
        margin-right: 30rpx;
        margin-bottom: 30rpx;
        text {
            color: #FF324A;            
            font-size: 33rpx;
        }
    }
    .statistics-list {        
        height: calc(100vh - 350rpx);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        .statistics-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            height: 165rpx;
            background: #fff;
            border-radius:8rpx;
            margin-bottom: 5rpx;
            image {
                width: 130rpx;
                height: 130rpx;
                border-radius: 50%;
                margin-left: 38rpx;
                margin-right: 30rpx;
            }
            .user-name {
                color: #000;
                font-size: 30rpx;
            }
            .created-time {
                color: #000;
                margin-left: auto;
                margin-right: 30rpx;
                font-size: 28rpx;
            }
        }
    }
}
</style>