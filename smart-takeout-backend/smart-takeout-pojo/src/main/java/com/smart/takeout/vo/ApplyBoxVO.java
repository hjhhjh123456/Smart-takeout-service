package com.smart.takeout.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 配送员端-外卖箱申请
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyBoxVO {
    private Long orderId;
    private int boxId;
    private String boxCode;
    private int status;
}