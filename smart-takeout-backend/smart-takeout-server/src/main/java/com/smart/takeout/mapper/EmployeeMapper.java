package com.smart.takeout.mapper;

import com.github.pagehelper.Page;
import com.smart.takeout.annotation.AutoFill;
import com.smart.takeout.dto.EmployeePageQueryDTO;
import com.smart.takeout.entity.DeliveryWorker;
import com.smart.takeout.entity.Employee;
import com.smart.takeout.enumeration.OperationType;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface EmployeeMapper {

    /**
     * 根据用户名查询员工
     * @param username
     * @return
     */
    @Select("select * from employee where username = #{username}")
    Employee getByUsername(String username);

    /**
     * 插入员工数据
     * @param employee
     */
    @Insert("insert into employee (name, username, password, phone, sex, id_number, create_time, update_time, create_user, update_user,status) " +
            "values " +
            "(#{name},#{username},#{password},#{phone},#{sex},#{idNumber},#{createTime},#{updateTime},#{createUser},#{updateUser},#{status})")
    @AutoFill(value = OperationType.INSERT)
    void insert(Employee employee);

    /**
     * 分页查询
     * @param employeePageQueryDTO
     * @return
     */
    Page<Employee> pageQuery(EmployeePageQueryDTO employeePageQueryDTO);

    /**
     * 根据主键动态修改属性
     * @param employee
     */
    @AutoFill(value = OperationType.UPDATE)
    void update(Employee employee);

    /**
     * 根据id查询员工信息
     * @param id
     * @return
     */
    @Select("select * from employee where id = #{id}")
    Employee getById(Long id);

    /**
     * 新增配送员工信息
     * @param employee
     */
    @Insert("insert into delivery_workers (name, username, phone, sex, id_number, create_time, update_time, create_user, update_user,status) " +
            "values " +
            "(#{name},#{username},#{phone},#{sex},#{idNumber},#{createTime},#{updateTime},#{createUser},#{updateUser},#{status})")
    @AutoFill(value = OperationType.INSERT)
    void addDeliveryWorker(Employee employee);

    /**
     * 员工批量删除
     * @param ids
     */
    void deleteBatch(List<Long> ids);

    /**
     * 配送员工批量删除
     * @param ids
     */
    void deleteBatchDeliveryWorkers(List<Long> ids);

    /**
     * 根据openid查询配送员工信息
     * @param openid
     * @return
     */
    DeliveryWorker getByOpenid(String openid);
}
