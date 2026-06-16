package com.smart.takeout.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 全部外卖箱情况
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryBox {
    private int boxId;
    private int status;
}
