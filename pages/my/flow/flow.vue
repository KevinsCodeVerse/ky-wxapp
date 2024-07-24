<template>
	<view>
	    <view class="remark">
	        <text>账单详情</text>
	        <text>收入/支出</text>
	    </view>
	    <!-- <tab class="tabss" items="{{[{name:1,text:'可用余额'},{name:2,text:'冻结余额'}]}}" active="{{1}}" bind:change="tabChange"></tab> -->
	    <view class="telist">
	        <view class="tecard" v-for="(item, index) in list" :key="index">
	            <view class="toad">
	                <view style="display: flex">
	                    <view>{{ item.descr + '  ' }}</view>
	                    （
	                    <view v-if="item.type == 1" class="add">收入</view>
	                    <view v-if="item.type == 2" class="error">支出</view>
	                    <view v-if="item.type == 3" class="lanse">冻结中</view>
	                    <view v-if="item.type == 4" class="info">退款</view>
	                    ）
	                </view>
	                <view class="time">{{ item.createTime }}</view>
	            </view>
	
	            <view v-if="active == 1">
	                <view class="price add" v-if="item.type == 1">{{ '+' }}￥{{ item.amount }}</view>
	                <view class="price error" v-if="item.type == 2">{{ '-' }}￥{{ item.amount }}</view>
	                <view class="price lanse" v-if="item.type == 3 && item.status == 1">{{ '+' }}￥{{ item.amount }}</view>
	                <view class="price lanse" v-if="item.type == 3 && item.status == 2">{{ '+' }}￥{{ item.amount }}</view>
	                <view class="price lanse" v-if="item.type == 3 && item.status == 3">{{ '-' }}￥{{ item.amount }}</view>
	                <view class="price lanse" v-if="item.type == 3 && item.status == 5">{{ '-' }}￥{{ item.amount }}</view>
	                <view class="price lanse" v-if="item.type == 3 && item.status == 4">{{ '+' }}￥{{ item.amount }}</view>
	                <view class="price lanse" v-if="item.type == 3 && item.status == 9">{{ '-' }}￥{{ item.amount }}</view>
	                <view class="price freeze" v-if="item.type == 4">￥{{ item.amount }}</view>
	            </view>
	        </view>
	        <view class="loading">
	            <van-loading v-if="loading" size="24px" color="#0DC3FF">加载中...</van-loading>
	            <text class="finish" v-if="finish">{{ list.length > 0 ? '没有更多了' : '暂无数据' }}</text>
	        </view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
				],
				params:{
					pageNo: 0,
					pageSize: 20,
				},
				active: 1,
				
				
				finish: false,
				loading: false
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.remark {
    font-weight: bold;
    padding: 0 30rpx;
    height: 68rpx;
    line-height: 68rpx;
    display: flex;
    justify-content: space-between;
}
.telist {
    background-color: #fff;
}
.tecard {
    padding: 16rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
}
.tecard .time {
    color: #999999;
    font-size: 20rpx;
    margin-top: 4rpx;
}
.tecard .price {
    color: rgb(245, 86, 86);
    font-weight: bold;
    font-size: 40rpx;
    letter-spacing: 0;
}
.tecard .add {
    color: #32ca64;
}
.error {
    color: rgb(245, 86, 86);
}
.lanse {
    color: #3994ff !important;
}
.tecard .freeze {
    color: #636363;
}
.tecard .toad {
    width: calc(100% - 250rpx);
}
/* 滑动加载 */
.loading {
    text-align: center;
    padding: 30rpx 0;
}
.finish {
    font-size: 28rpx;
    color: #999999;
    padding-bottom: 20rpx;
}
</style>
