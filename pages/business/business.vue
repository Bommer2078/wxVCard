<template>
    <view class="business-page">
        <business-main-page v-if="currentTab === 'home'"></business-main-page>
        <statistics-page v-if="currentTab === 'statistics'"></statistics-page>
        <view class="bottom-tab">
            <view class="tab-btn" :class="{'activ-style': currentTab === 'home'}" @click="chageTab('home')">
                <img src="/static/homeA.png" v-if=" currentTab === 'home'">
                <img src="/static/home.png" v-else>
                <text>首页</text>
            </view>
            <view class="tab-btn" :class="{'activ-style': currentTab === 'statistics'}"  @click="chageTab('statistics')">
                <img src="/static/statisticsA.png" v-if=" currentTab === 'statistics'">
                <img src="/static/statistics.png" v-else>
                <text>统计</text>
            </view>
            <view class="tab-btn" :class="{'activ-style': currentTab === 'contact'}"  @click="loginOut">
                <img src="/static/userA.png" v-if=" currentTab === 'contact'">
                <img src="/static/user.png" v-else>
                <text>登出</text>
            </view>
        </view>
    </view>             
</template>

<script>
import businessMainPage from '../../components/businessMainPage'
import statisticsPage from '../../components/statisticsPage'
export default {
    data() {
        return {
            currentTab: 'home', //home 首页 ，statistics 统计，loginOut 联系
        }
    },
    onShow () {        
        if (wx.canIUse('hideHomeButton')) {
            wx.hideHomeButton()
        }
    },
    components: {
        businessMainPage,
        statisticsPage
    },
    methods: {
        chageTab (val) {
            this.currentTab = val
        },
        loginOut () {
            this.$tip.alertDialog(
                '确定要退出商家页面么',
                '确定','不了').then(() => {
                this.$store.commit('SET_ROLE_TYPE')
                    uni.switchTab({
                        url: '/pages/main/main'
                    })
                }).catch(() => {})
            
        }
    },
}
</script>

<style>
.business-page {    
    width: 100%;
    background: #F3F3F3;
}
.bottom-tab {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-around;
    bottom: 0;
    width: 100%;
    color: #666;
    font-size: 9px;
    height: 120upx;
    background: #fff;
}
.bottom-tab .tab-btn{
    display: flex;
    width: 33%;
    flex-direction: column;
    align-items: center;
}
.activ-style {
    color: #FFAF07;
}
.tab-btn img{
    width: 55upx;
    height: 55upx;
}
</style>