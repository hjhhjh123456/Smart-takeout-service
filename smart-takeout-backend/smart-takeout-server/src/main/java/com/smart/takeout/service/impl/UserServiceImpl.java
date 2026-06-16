package com.smart.takeout.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.smart.takeout.constant.MessageConstant;
import com.smart.takeout.dto.UserLoginDTO;
import com.smart.takeout.entity.DeliveryWorker;
import com.smart.takeout.entity.User;
import com.smart.takeout.entity.UserBoxCodeAuth;
import com.smart.takeout.exception.AccountNotFoundException;
import com.smart.takeout.exception.LoginFailedException;
import com.smart.takeout.mapper.EmployeeMapper;
import com.smart.takeout.mapper.OrderMapper;
import com.smart.takeout.mapper.UserMapper;
import com.smart.takeout.properties.WeChatProperties;
import com.smart.takeout.result.Result;
import com.smart.takeout.service.UserService;
import com.smart.takeout.utils.HttpClientUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    //微信服务接口地址
    public static final String WX_LOGIN = "https://api.weixin.qq.com/sns/jscode2session";

    @Autowired
    private WeChatProperties weChatProperties;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private EmployeeMapper employeeMapper;
    @Autowired
    private OrderMapper orderMapper;
    /**
     * 微信登录
     * @param userLoginDTO
     * @return
     */
    public User wxLogin(UserLoginDTO userLoginDTO) {
        String openid = getOpenid(userLoginDTO.getCode());

        //判断openid是否为空，如果为空表示登录失败，抛出业务异常
        if(openid == null){
            throw new LoginFailedException(MessageConstant.LOGIN_FAILED);
        }

        //判断当前用户是否为新用户
        User user = userMapper.getByOpenid(openid);

        //如果是新用户，自动完成注册
        if(user == null){
            user = User.builder()
                    .openid(openid)
                    .createTime(LocalDateTime.now())
                    .isDeliveryWorker(false)
                    .build();
            userMapper.insert(user);
        }

        //返回这个用户对象
        return user;
    }

    @Override
    public int getTakeout(String boxCode,String openid) {
        String boxCodeDigest = DigestUtils.md5DigestAsHex(boxCode.getBytes());
        UserBoxCodeAuth userBoxCodeAuth = orderMapper.getUserBoxCodeAuth(boxCodeDigest,openid);
        if(userBoxCodeAuth== null)
            throw new AccountNotFoundException(MessageConstant.BoxCode_NOT_FOUND);
        return userBoxCodeAuth.getBoxId();
    }

    /**
     * 调用微信接口服务，获取微信用户的openid
     * @param code
     * @return
     */
    private String getOpenid(String code){
        //调用微信接口服务，获得当前微信用户的openid
        Map<String, String> map = new HashMap<>();
        map.put("appid",weChatProperties.getAppid());
        map.put("secret",weChatProperties.getSecret());
        map.put("js_code",code);
        map.put("grant_type","authorization_code");
        String json = HttpClientUtil.doGet(WX_LOGIN, map);

        JSONObject jsonObject = JSON.parseObject(json);
        String openid = jsonObject.getString("openid");
        return openid;
    }
}
