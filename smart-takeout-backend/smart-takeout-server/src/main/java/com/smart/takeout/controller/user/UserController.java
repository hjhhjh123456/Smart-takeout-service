package com.smart.takeout.controller.user;

import com.smart.takeout.constant.JwtClaimsConstant;
import com.smart.takeout.dto.UserLoginDTO;
import com.smart.takeout.entity.User;
import com.smart.takeout.properties.JwtProperties;
import com.smart.takeout.result.Result;
import com.smart.takeout.service.UserService;
import com.smart.takeout.utils.JwtUtil;
import com.smart.takeout.vo.UserLoginVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user/user")
@Api(tags = "C端用户相关接口")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtProperties jwtProperties;

    /**
     * 微信登录
     * @param userLoginDTO
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("微信登录")
    public Result<UserLoginVO> login(@RequestBody UserLoginDTO userLoginDTO){
        log.info("微信用户登录：{}",userLoginDTO.getCode());

        //微信登录
        User user = userService.wxLogin(userLoginDTO);

        //为微信用户生成jwt令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtClaimsConstant.USER_ID,user.getId());
        String token = JwtUtil.createJWT(jwtProperties.getUserSecretKey(), jwtProperties.getUserTtl(), claims);

        UserLoginVO userLoginVO = UserLoginVO.builder()
                .id(user.getId())
                .openid(user.getOpenid())
                .token(token)
                .isDeliveryWorker(user.isDeliveryWorker())
                .build();
        return Result.success(userLoginVO);
    }

    @PostMapping("/getTakeout")
    @ApiOperation("密码来从外卖柜获取外卖")
    public Result getTakeout(@RequestParam String boxCode,@RequestParam String openid){
        log.info("用户获取外卖");
        return Result.success(userService.getTakeout(boxCode,openid));
    }
}
