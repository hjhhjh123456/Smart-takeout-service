package com.smart.takeout.controller.user;

import com.smart.takeout.result.Result;
import com.smart.takeout.service.DeliveryWorkerService;
import com.smart.takeout.vo.ApplyBoxVO;
import com.smart.takeout.vo.BusinessDataVO;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/delivery_worker")
@Api(tags = "配送员接口")
@Slf4j
public class DeliveryWorkerController {
    @Autowired
    private DeliveryWorkerService deliveryWorkerService;

    @PostMapping("/apply_box")
    public Result<ApplyBoxVO> applyBox(@RequestParam Long orderId){
        return Result.success(deliveryWorkerService.applyBox(orderId));
    }
}
