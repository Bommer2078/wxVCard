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
        <picker mode="date" :value="date" start="2020-01-01" :end="endDate" @change="bindDateChange" class="date-select">
            <view class="uni-input">{{date}}</view>
        </picker>
        <view class="num-conf">当日使用权益用户数量：<text class="text">{{todayNum}}</text></view>
        <view class="num-conf">使用权益总量：<text class="text">{{allNum}}</text></view>
        <view class="statistics-list">
            <view class="statistics-item" v-for="item in orderList" :key="item.id">
                <image :src="item.avatar || '/static/avatar.svg'" class="user-header"/>
                <text class="user-name">{{item.nickname}}</text>
                <view class="order-statu">
                    <text>{{item.card.name}}</text>
                    <text class="created-time">{{item.paid_date}}</text>                    
                    <text>{{item.paid_state | payText}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data () {
        return {
            searchContent: '',  
            currentDate: '',
            date: this.getDate(),
            allNum: 0,
            todayNum: 0,
            orderList: []
        }
    },
    filters: {
        //paid_state：支付状态，-1：支付失败，0：未支付，1：预支付，10：已支付
        payText (val) {
            let text = ''
            switch (val) {
                case -1:
                    text = '支付失败'
                    break;
                case 0:
                    text = '未支付'
                    break;
                case 1:
                    text = '预支付'
                    break;
                case 10:
                    text = '已支付'
                    break;            
                default:                    
                    text = '未支付'
                    break;
            }
            return text
        }
    },
    created() {
        this.getDate()
        this.getStatisticsList(true)
    },
    computed: {
        startDate() {
            return this.getDate('start');
        },
        endDate() {
            return this.getDate('end')
        }
    },
    methods: {  
        handleSearch () {
            this.getStatisticsList(false)
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
            let str = `${year}-${month}-${day}`
            this.currentDate = str
            return str;
        },
       async getStatisticsList (b) {
            const params  = {
                page: 1,
                pageSize: 100,
                nickname: this.searchContent,
                paid_at: this.date
            }
            const res = await this.$api.adminOrderList(params)
            if (res.code === 0) {
                this.orderList = res.data.data
                if (b) {                    
                    this.todayNum = res.data.total
                }
                this.allNum = res.order_all_num
            }
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
        .text {
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
            .user-header {
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
            .order-statu {
                height: 155rpx;
                margin-right: 30rpx;
                margin-left: auto;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;
                font-size: 28rpx;
                color: #000;
            }
        }
    }
}
</style>