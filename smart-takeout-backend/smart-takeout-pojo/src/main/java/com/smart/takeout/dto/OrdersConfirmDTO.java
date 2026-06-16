package com.smart.takeout.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrdersConfirmDTO implements Serializable {

    private Long id;
    //订单状态 1待付款 2待接单 3 已接单 4 派送中 5 送达至外卖柜 6 已完成 7 已取消 8 退款
    private Integer status;

}
