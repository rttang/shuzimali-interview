/**
 * 优化 getUserInfo 请求
 *
 * 要求
 * getUserInfo 是个通用接口，在各个模块里面都有可能使用 requestUserInfo 模拟的是请求服务端真正获取* 用户信息的方法
 *
 * 业务背景
 * 1.在一个页面有 A, B, C 3个功能模块，A, B, C 模块渲染执行顺序不可控
 * 2.每个模块都会调用 getUserInfo 这个方法， 这个方法是可以直接调用 requestUserInfo 获取用户信息
 * 3.调用三次就会发起三次网络请求
 * 4.现在需要优化 getUserInfo 这个方法， 保证 getUserInfo 方法3次调用后， 最终只会发出一次网络请求。
 */

// 核心用户请求
let _requestTime = 0;
const requestUserInfo = () => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟 ajax 异步，1s 返回
        resolve();
      }, 1000);
    }).then(() => {
      _requestTime++;
      return {
        nick: 'nick',
        age: '18',
      };
    });
  });
};
// -------- 在这里完成代码 优化getdata --------
// 调用 requestUserInfo，并优化请求次数
// const getUserInfo = () => {};

// -------- 在这里完成代码 优化getdata --------
//定义变量，用于缓存整个Promise
let task;
// 调用 requestUserInfo，并优化请求次数
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    //任务不存在时，则判断为第一次请求，赋值Promise，并将Promise整体resolve出去
    if (!task) {
      task = requestUserInfo();
      resolve(task);
    } else {
      //后续请求时，直接在第一个Promise完成之后追加.then,并重新赋值给task，
      //并将返回的数据return，传递给下一个.then方法
      task = task.then((res) => {
        return res;
      });
      resolve(task);
    }
  });
};

/**
 * 以下为测试用例，无需修改
 */
const test = async () => {
  try {
    // 模拟请求
    const result = await Promise.all([
      getUserInfo(),
      new Promise((resolve) =>
        setTimeout(async () => {
          resolve(await getUserInfo());
        }, 300)
      ),
      new Promise((resolve) =>
        setTimeout(async () => {
          resolve(await getUserInfo());
        }, 2300)
      ),
    ]);
    // if (
    //   !isEqual(result, [
    //     {
    //       nick: 'nick',
    //       age: '18',
    //     },
    //     {
    //       nick: 'nick',
    //       age: '18',
    //     },
    //     {
    //       nick: 'nick',
    //       age: '18',
    //     },
    //   ])
    // ) {
    //   throw new Error('Wrong answer');
    // }
    console.log(result);
    return _requestTime === 1;
  } catch (err) {
    console.warn('测试运行失败');
    console.error(err);
    return false;
  }
};
test();
