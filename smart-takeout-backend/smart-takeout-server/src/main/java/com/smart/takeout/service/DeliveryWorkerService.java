package com.smart.takeout.service;


import com.smart.takeout.vo.ApplyBoxVO;

public interface DeliveryWorkerService {

    ApplyBoxVO applyBox(Long orderId);
}
