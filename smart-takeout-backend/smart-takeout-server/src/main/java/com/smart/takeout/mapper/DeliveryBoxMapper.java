package com.smart.takeout.mapper;

import com.smart.takeout.vo.ApplyBoxVO;
import com.smart.takeout.vo.BusinessDataVO;
import com.smart.takeout.vo.DeliveryBoxVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DeliveryBoxMapper {
    /**
     * 申请配送箱
     * @param applyBoxVO
     * @return
     */
    void applyBox(ApplyBoxVO applyBoxVO);

    /**
     * 修改配送箱状态
     * @param applyBoxVO
     */
    @Select("update boxs set box_status = #{status} where box_id = #{boxId}")
    void updateBoxStatus(ApplyBoxVO applyBoxVO);

    /**
     * 获取所有配送箱状态
     * @return
     */
    @Select("select box_id,box_status from boxs")
    List<DeliveryBoxVO> getStatus();

    /**
     * 获取配送箱数量
     * @return
     */
    @Select("select count(*) from boxs")
    int getCount();

    /**
     * 获取配送箱空闲数量
     * @return
     */
    @Select("select count(*) from boxs where box_status = 0")
    int getCountByFreeStatus();

    /**
     * 查询是否有重复箱密码
     * @return
     */
    @Select("select count(*) from boxs where box_code = #{boxCode}")
    int getCountByBoxCode(String boxCode);

    /**
     * 判断订单是否已经放入储物柜
     * @return
     */
    @Select("select count(*) from orders where id = #{orderId} and status = 5 ")
    int isCompeleted(Long orderId);
}
