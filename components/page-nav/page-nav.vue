<template>
	<view class="nav-wrap">
		<view class="nav-title">
			<image class="logo" src="https://cdn.uviewui.com/uview/common/logo.png" mode="widthFix"></image>
			<view class="nav-info">
				<view class="nav-title__text">
					{{$t('common.title')}}
				</view>
				<view class="nav-slogan">
					 {{$t('common.intro')}}
				</view>
			</view>
		</view>
		<view class="nav-desc">
			{{desc}}
		</view>
		<view class="lang" >
			<u-icon size="46" color="warning" :name="lang"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			desc: String,
			title: String,
		},
		computed: {
	
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.nav-wrap {
		padding: 30rpx;
		position: relative;
	}
	
	.lang {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	}
	
	.nav-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	
	.nav-info {
		margin-left: 30rpx;
	}
	
	.nav-title__text {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		color: $u-main-color;
		font-size: 50rpx;
		font-weight: bold;
	}
	
	.logo {
		width: 140rpx;
		/* #ifndef APP-NVUE */
		height: auto;
		/* #endif */
	}
	
	.nav-slogan {
		color: $u-tips-color;
		font-size: 28rpx;
	}
	
	.nav-desc {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: $u-content-color;
	}
</style>
