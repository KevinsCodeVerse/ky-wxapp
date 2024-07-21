<template>
  <view>
    <view
        style="height: 174rpx;background: linear-gradient(135.00deg, #fad232 0%, #faaa32 100%);padding: 32rpx 54rpx;">
      <view style="display: flex;justify-content: space-between;">
        <view>
          <view style="font-weight: 700;font-size: 48rpx;text-align: center;color: #fff;">{{ count }}</view>
          <view style="font-size: 28rpx;text-align: center;color: #fff;">直推团队</view>
        </view>
        <view>
          <view style="font-weight: 700;font-size: 48rpx;text-align: center;color: #fff;">{{ tCount }}</view>
          <view style="font-size: 28rpx;text-align: center;color: #fff;">间推团队</view>
        </view>
        <view>
          <view style="font-weight: 700;font-size: 48rpx;text-align: center;color: #fff;">{{ count+tCount }}</view>
          <view style="font-size: 28rpx;text-align: center;color: #fff;">全部成员</view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y="true" class="scroll-Y content" @scrolltolower="getList">
      <view style="display: flex;flex-direction: column;justify-content: space-between;">
        <view style="margin-bottom:20rpx;padding: 24rpx 32rpx 36rpx 32rpx;background-color: #fff;"
              v-for="(item,index) in teamList">
          <view style="display: flex;align-items: center;">
            <view>
              <u-image width="108rpx" height="108rpx" :src="$comm.fullPath(item.avatar)"
                       shape="circle"></u-image>
            </view>
            <!-- 中间部分 -->
            <view
                style="display: flex;flex-direction: column;justify-content: space-between;margin-left: 16rpx;gap: 5rpx;">
              <view style="display: flex;">
                <view
                    style="font-weight: 700;font-size: 28rpx;text-align: left;color: #333;max-width: 190rpx;width: max-content;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  {{ item.nick }}
                </view>
                <view>
                   <u-image width="128rpx" height="40rpx" src="/static/my/vip1.png" v-if="item.vipLevel===0"></u-image>
                   <u-image width="128rpx" height="40rpx" src="/static/my/vip2.png" v-if="item.vipLevel===1"></u-image>
                  <u-image width="108rpx" height="40rpx" src="/static/my/vip3.png" v-if="item.vipLevel===2"></u-image>
                   <u-image width="148rpx" height="40rpx" src="/static/my/vip4.png" v-if="item.vipLevel===3"></u-image>
                </view>
              </view>
              <view style="font-size: 22rpx;text-align: left;color: #999;">
                注册时间:{{item.createTime}}
              </view>
              <view style="width: max-content;height: 32rpx;border-radius: 4rpx;background: #fff7e6;">
                <view style="font-size: 20rpx;text-align: left;color: #f2a600;line-height: 32rpx;">
                  累计收益:{{ item.amount }}
                </view>
              </view>
            </view>
            <!-- 右边部分 -->
            <view
                style="margin-left: auto;display: flex;flex-direction: column;justify-content: space-between;align-items: center;gap: 18rpx;"
				@click="openPage('/pages/my/fyJl?usId='+item.usId+'&usNick='+item.nick,2)">
              <view style="width: 144rpx;height: 52rpx;border-radius: 26rpx;background: #fff2d6;">
                <view
                    style="font-weight: 700;font-size: 22rpx;text-align: center;color: #f2a600;line-height: 52rpx;">
                  分佣记录
                </view>
              </view>
              <view style="display: flex;align-items: flex-end;" @click="openPage('/pages/my/team?usId='+item.usId+'&usNick='+item.nick,2)">
                <view style="font-size: 24rpx;text-align: center;color: #999;">
                  查看团队
                </view>
                <view>
                  <u-icon name="arrow-right" size="18rpx" color="#999"></u-icon>
                </view>
              </view>
            </view>
          </view>
          <view style="display: flex;justify-content: space-around;margin-top: 32rpx;">
            <view>
              <view style="font-size: 24rpx;text-align: left;color: #aaa;">
                今日开单
              </view>
              <view
                  style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
                {{ item.todayAmount }}
              </view>
            </view>
            <view>
              <view style="font-size: 24rpx;text-align: left;color: #aaa;">
                总开单
              </view>
              <view
                  style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
                {{ item.totalAmount }}
              </view>
            </view>
            <view>
              <view style="font-size: 24rpx;text-align: left;color: #aaa;">
                直推团队
              </view>
              <view
                  style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
                {{ item.count }}
              </view>
            </view>
            <view>
              <view style="font-size: 24rpx;text-align: left;color: #aaa;">
                间推团队
              </view>
              <view
                  style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
                {{ item.teamCount?item.teamCount:0 }}
              </view>
            </view>
          </view>
        </view>
      </view>


    </scroll-view>
	<u-loadmore :status="loadStatus" @loadmore="getList"></u-loadmore>


    <view
		v-if="!params.id"
        style="position: absolute;padding: 30rpx 40rpx 50rpx 40rpx;border-radius: 20rpx 20rpx 0 0;background-color: #fff;bottom: 0;width: 100vw;">
      <view style="display: flex;justify-content: space-between;">
        <view @click="openPage('/pages/my/goodsTgDt',1)"
              style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
          <u-icon name="home" color="#999" size="45"></u-icon>
          <view style="font-size: 20rpx;color: #999;">
            首页
          </view>
        </view>
        <view @click="openPage('/pages/my/team',1)"
              style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
          <u-icon name="account" color="#999" size="45"></u-icon>
          <view style="font-size: 20rpx;color: #999;">
            团队
          </view>
        </view>
        <view @click="openPage('/pages/my/fyJl',1)"
              style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
          <u-icon name="rmb-circle" color="#999" size="45"></u-icon>
          <view style="font-size: 20rpx;color: #999;">
            分佣
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      count:0,
      tCount:0,
      teamList:[
        // {
        //   "usId": 1,
        //   "avatar": "avatar1.jpg",
        //   "nick": "小明",
        //   "createTime": 1656855000000,
        //   "vipLevel": 0,
        //   "amount": 1000.00,
        //   "todayAmount": 200.00,
        //   "totalAmount": 5000.00,
        //   "count": 10,
        //   "teamCount": 50
        // },
        // {
        //   "usId": 2,
        //   "avatar": "avatar2.jpg",
        //   "nick": "小红",
        //   "createTime": 1656855700000,
        //   "vipLevel": 1,
        //   "amount": 1500.50,
        //   "todayAmount": 300.75,
        //   "totalAmount": 8000.25,
        //   "count": 15,
        //   "teamCount": 75
        // },
        // {
        //   "usId": 3,
        //   "avatar": "avatar3.jpg",
        //   "nick": "阿狸",
        //   "createTime": 1656856400000,
        //   "vipLevel": 2,
        //   "amount": 2000.25,
        //   "todayAmount": 250.50,
        //   "totalAmount": 10000.50,
        //   "count": 20,
        //   "teamCount": 100
        // },
        // {
        //   "usId": 4,
        //   "avatar": "avatar4.jpg",
        //   "nick": "小青",
        //   "createTime": 1656857100000,
        //   "vipLevel": 3,
        //   "amount": 2500.75,
        //   "todayAmount": 400.00,
        //   "totalAmount": 12000.75,
        //   "count": 25,
        //   "teamCount": 120
        // }
      ],
	  params: {
		id:'',
	  	pageNo: 0,
	  	pageSize: 10,
	  },
	  loadStatus: 'loadmore',
    }
  },
  onLoad(e){
	  if(e.usId) {
		  this.params.id = e.usId;
	  }
	  if(e.usNick) {
		  uni.setNavigationBarTitle({
		  	title: e.usNick+"的团队"
		  });
	  }
	  this.teamCount()
	  this.search();
  },
  methods: {
	search(){
		this.teamList = [];
		this.params.pageNo = 0;
		this.loadStatus = 'loadmore';
		this.getList();
	},  
    getList(){
		if(this.loadStatus != 'loadmore') return;
		this.loadStatus = 'loading';
		this.params.pageNo += 1;
      this.$request.post({
        url: 'user/userRoyalFlowPro/tenantTeam',
		params: this.params,
        success: (result) => {
			if(result.length < this.params.pageSize) {
				this.loadStatus = 'nomore';
			}else {
				this.loadStatus = 'loadmore';
			}
			this.teamList = [...this.teamList, ...result];
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    teamCount(id) {
      this.$request.post({
        url: 'user/userRoyalFlowPro/tenantTeamCount',
		params: {
			id: this.params.id
		},
        success: (result) => {
          this.count=result.count
          this.tCount=result.teamCount
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    openPage(path, type) {
      if (!path) {
        uni.navigateBack({
          delta: 1
        });
      }
      var pages = getCurrentPages() // 获取栈实例
      let currentRoute = pages[pages.length - 1].route; // 获取当前页面路由
      if (path === currentRoute) {
        return;
      }
      if (type == 1) {
        uni.redirectTo({
          url: path
        })
      } else {
        this.$u.route({
          url: path
        });
      }
    }
  }
}
</script>

<style lang="scss">
page {
  background: #f5f5f5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.content {
  height: 75vh;
}
</style>