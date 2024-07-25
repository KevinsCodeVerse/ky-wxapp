<template>
	<view>
	    <view class="telist">
	        <view class="tecard" v-for="(item, index) in list" :key="index">
	            <view class="toad">
	                <view style="display: flex">
	                    <view>{{ item.cardNum + '  ' }}</view>
	                </view>
	            	<view style="display: flex">
	            		<view>{{ item.cardName}}</view>
	            		<view style="margin-left: 10rpx;">{{ item.name}}</view>
	            	</view>
	                <view class="time">{{item.createTime}}</view>
					<view class="time" style="color: #f55656; width: 690rpx;" v-if="item.refusedReason">失败原因：{{item.refusedReason}}</view>
	            </view>
	            <view style="align-items: center;display: flex;flex-direction: column;">
	                <view class="price add">￥{{ item.money }}</view>
	            	<view class="price error" v-if="item.status == 0">审核中</view>
	            	<view class="price error" v-if="item.status == 1">提现成功</view>
	            	<view class="price error" v-if="item.status == -1">提现失败</view>
	            </view>
	        </view>
	        <u-loadmore :status="loadStatus" @loadmore="getList" v-if="list.length>0"></u-loadmore>
			<u-empty v-if="list.length==0" icon-size="550rpx" src="../../../static/index/noEmty.png" text=" "></u-empty>
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
					tenantId: '',
					pageNo: 0,
					pageSize: 20,
				},
				loadStatus: 'loadmore',
				
				finish: false,
				loading: false
			}
		},
		onLoad() {
			this.params.tenantId = uni.getStorageSync('infoId');
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			getList() {
				if(this.loadStatus != 'loadmore') return;
				this.loadStatus = 'loading';
				this.params.pageNo += 1;
				this.$request.post({
				  url: 'user/userWithdraw/list',
				  params: this.params,
				  success: (result) => {
					  if(result.length < this.params.pageSize) {
						  this.loadStatus = 'nomore';
					  }else {
						  this.loadStatus = 'loadmore';
					  }
					  this.list = [...this.list, ...result];
				  },
				  catch: (e) => {
				  },
				  finally: (e) => {
				  }
				});
			},
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
    // align-items: center;
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
    font-size: 36rpx;
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
