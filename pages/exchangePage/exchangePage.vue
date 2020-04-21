<template>
    <view class="exchange-page">
        <view class="exchange-cover">
            <view class="exchange-box">
                <view class="exchange-title">兑换码/优惠券</view>
                <view class="exchange-frame">
                    <input type="text" placeholder="请输入券码" v-model.trim="exchangeCode" maxlength="20">
                </view>
                <view class="exchange-btn" @click="handleExchange">兑换</view>
                <view class="exchange-tip">* 不区分大小写</view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default { 
    data() {
        return {
            exchangeCode: '',
            forbidClick: false
        }
    },
    computed: {
        ...mapState(['vCardBaseInfo'])
    },
    methods: {
        async handleExchange () {
            if (this.forbidClick) return
            if (!this.checkForm()) return
            this.forbidClick = true
            let params = {
                code: this.exchangeCode
            }
            const res = await this.$api.exchangeCard(params)
            this.forbidClick = false
            if (res.code === 0) {
                this.$tip.toast('兑换成功')
                wx.navigateBack();
            } else {
                this.$tip.toast(res.msg,'none')
            }
        },
        checkForm () {
            if (!this.exchangeCode) {
                this.$tip.toast('请输入券码', 'none')
                return false
            }
            return true
        }
    },
}
</script>

<style lang="scss">
.exchange-page {
    display: flex;
    width: 100%;
    height: 100vh;
    padding: 15rpx 15rpx 0;
    background: #F3F3F3;
    .exchange-cover {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 1075rpx;
        padding-top: 105rpx;
        background: #fff;
        .exchange-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 544rpx;
            height: 516rpx;
            border-radius: 10rpx;
            background: #F1F1F1;
            .exchange-title {
                color: #000000;
                font-weight: 700;
                font-size: 32rpx;
                margin-top: 43rpx;
                margin-bottom: 23rpx;
            }
            .exchange-frame {
                width:491rpx;
                height:194rpx;
                border:2rpx solid rgba(176,176,176,1);
                border-radius: 10rpx;
                margin-bottom: 30rpx;
                input {
                    font-size: #9B9B9B;
                    font-weight: 700;
                    margin-top: 50rpx;
                    text-align: center;
                }
            }
            .exchange-btn {
                width:407rpx;
                height:80rpx;
                line-height:80rpx;
                color: #fff;
                text-align: center;
                margin-bottom: 33rpx;
                background:rgba(255,50,118,1);
                border-radius:20rpx;
            }
            .exchange-tip {
                width: 516rpx;
                font-size: 22rpx;
                color: #999999;
                margin-left: 28rpx;
            }
        }
    }
}
</style>