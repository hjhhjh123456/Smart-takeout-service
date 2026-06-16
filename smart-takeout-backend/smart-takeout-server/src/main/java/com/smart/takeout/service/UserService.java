package com.smart.takeout.service;

import com.smart.takeout.dto.UserLoginDTO;
import com.smart.takeout.entity.User;
import com.smart.takeout.result.Result;

public interface UserService {

    /**
     * 微信登录
     * @param userLoginDTO
     * @return
     */
    User wxLogin(UserLoginDTO userLoginDTO);

    /**
     * 密码来从外卖柜获取外卖
     * @param boxCode
     * @return
     */
    int getTakeout(String boxCode,String openid);
}
