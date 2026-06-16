package com.smart.takeout.service.impl;

import com.smart.takeout.constant.MessageConstant;
import com.smart.takeout.exception.AccountNotFoundException;
import com.smart.takeout.mapper.DeliveryBoxMapper;
import com.smart.takeout.service.DeliveryWorkerService;
import com.smart.takeout.vo.ApplyBoxVO;
import com.smart.takeout.vo.DeliveryBoxVO;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.List;

@Service
public class DeliveryWorkerServiceImpl implements DeliveryWorkerService {
    @Autowired
    private DeliveryBoxMapper deliveryBoxMapper;


    @Override
    public ApplyBoxVO applyBox(Long orderId) {
        if(deliveryBoxMapper.isCompeleted(orderId) != 0)
            throw new AccountNotFoundException(MessageConstant.ORDER_IS_COMPLETED);
        List<DeliveryBoxVO> deliveryBoxVOList = deliveryBoxMapper.getStatus();
        int countByFreeStatus = deliveryBoxMapper.getCountByFreeStatus();
        if (countByFreeStatus == 0) {
            throw new AccountNotFoundException(MessageConstant.BOX_IS_FULL);
        }
        String boxCode = null;
        String boxCodeDigest = null;
        ApplyBoxVO applyBoxVO = null;
        for (DeliveryBoxVO deliveryBoxVO : deliveryBoxVOList) {
            if (deliveryBoxVO.getBoxStatus() == 0) {
                boxCode = RandomStringUtils.randomNumeric(6);
                boxCodeDigest = DigestUtils.md5DigestAsHex(boxCode.getBytes());
                while (deliveryBoxMapper.getCountByBoxCode(boxCodeDigest) > 0) {
                    boxCode = RandomStringUtils.randomNumeric(6);
                    boxCodeDigest = DigestUtils.md5DigestAsHex(boxCode.getBytes());
                }
                applyBoxVO = new ApplyBoxVO();
                applyBoxVO.setOrderId(orderId);
                applyBoxVO.setBoxId(deliveryBoxVO.getBoxId());
                applyBoxVO.setStatus(5);
                applyBoxVO.setBoxCode(boxCodeDigest);
                deliveryBoxMapper.applyBox(applyBoxVO);
                applyBoxVO.setBoxCode(boxCode);
                return applyBoxVO;
            }
        }
        return applyBoxVO;
    }
}
