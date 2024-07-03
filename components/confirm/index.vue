<template>
	<view class="confirm">
		<view class="conf">
			<view>推荐授权绑定微信号</view>
			<view>下次可直接使用微信一键登录</view>
			<view class="handle">
				<view class="mybtn btn1" @tap="onCancel">跳过</view>
				<view class="mybtn btn2" @tap="onConfirm">授权微信</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Confirm',
	props: {
		// 这里可以定义组件的属性，如果需要的话
	},
	data() {
		return {};
	},
	methods: {
		onConfirm() {
			this.$emit('change', 'confirm');
		},
		onCancel() {
			this.$emit('change', 'cancel');
		}
	}
};
</script>

<style scoped>
.confirm {
	background-color: rgba(0, 0, 0, 0.5);
	height: 100vh;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	right: 0;
	z-index: 999;
}
.confirm .conf {
	background-color: #fff;
	margin: 50rpx;
	border-radius: 16rpx;
	text-align: center;
	padding-top: 60rpx;
	overflow: hidden;
	margin-top: calc(50vh - 200rpx);
}
.confirm .handle {
	display: flex;
	margin-top: 60rpx;
}
.confirm .btn1 {
	color: #666;
	height: 90rpx;
	line-height: 90rpx;
	width: 50%;
	border-top: 1px solid #eee;
}
.confirm .btn2 {
	color: #fff;
	background-color: #3994ff;
	height: 90rpx;
	line-height: 90rpx;
	width: 50%;
	border-top: 1px solid #3994ff;
}
</style>
